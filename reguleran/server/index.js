import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import postgres from 'postgres'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { v2 as cloudinary } from 'cloudinary'
import React from 'react'
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer'

const sql = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
})

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = new Hono()

// ponytail: simple in-memory rate limiter, replace with @hono/rate-limiter if needed
const rateLimit = new Map()
function rateLimiter(maxReqs = 60, windowMs = 60000) {
  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'local'
    const now = Date.now()
    const entry = rateLimit.get(ip)
    if (!entry || now - entry.reset > windowMs) {
      rateLimit.set(ip, { count: 1, reset: now + windowMs })
      return next()
    }
    if (entry.count >= maxReqs) return c.json({ error: 'Too many requests' }, 429)
    entry.count++
    return next()
  }
}

app.use('*', logger())
app.use('/api/*', cors({
  origin: (origin) => {
    const allowed = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '').split(',').map(o => o.trim())
    if (!origin) return '*'
    if (allowed.includes(origin)) return origin
    if (origin.startsWith('exp://') || origin.startsWith('http://192.168.')) return origin
    return null
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))
app.use('/api/*', rateLimiter(120, 60000))

app.get('/api/health', (c) => c.json({ status: 'ok' }))

function toSnake(str) { return str.replace(/[A-Z]/g, l => '_' + l.toLowerCase()) }
function toCamel(str) { return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase()) }

function mapKeys(obj, fn) {
  if (Array.isArray(obj)) return obj.map(v => mapKeys(v, fn))
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k), v]))
  }
  return obj
}

const PUBLIC_TABLES = new Set(['publicSongs'])

app.use('/api/*', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  if (c.req.path === '/api/health') return next()
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const { sub } = await verifyToken(auth.slice(7), { secretKey: process.env.CLERK_SECRET_KEY })
    c.set('userId', sub)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

app.get('/api/:collection', async (c) => {
  const { collection } = c.req.param()
  const userId = c.get('userId')
  const table = toSnake(collection)
  const rows = PUBLIC_TABLES.has(collection)
    ? await sql`SELECT * FROM ${sql(table)} ORDER BY created_at DESC`
    : await sql`SELECT * FROM ${sql(table)} WHERE user_id = ${userId} ORDER BY created_at DESC`
  return c.json(rows.map(r => mapKeys(r, toCamel)))
})

app.get('/api/:collection/:id', async (c) => {
  const { collection, id } = c.req.param()
  const userId = c.get('userId')
  const table = toSnake(collection)
  const rows = PUBLIC_TABLES.has(collection)
    ? await sql`SELECT * FROM ${sql(table)} WHERE id = ${id}`
    : await sql`SELECT * FROM ${sql(table)} WHERE id = ${id} AND user_id = ${userId}`
  return c.json(rows.length ? mapKeys(rows[0], toCamel) : null)
})

app.post('/api/:collection', async (c) => {
  const { collection } = c.req.param()
  const userId = c.get('userId')
  const body = mapKeys(await c.req.json(), toSnake)
  const data = { ...body, user_id: userId }
  const keys = Object.keys(data)
  const rows = await sql`
    INSERT INTO ${sql(toSnake(collection))} ${sql(data)}
    ON CONFLICT (id) DO UPDATE SET ${sql(data, ...keys)}
    RETURNING *
  `
  return c.json(rows.length ? mapKeys(rows[0], toCamel) : null)
})

app.put('/api/:collection/:id', async (c) => {
  const { collection, id } = c.req.param()
  const userId = c.get('userId')
  const body = mapKeys(await c.req.json(), toSnake)
  const keys = Object.keys(body)
  const table = toSnake(collection)
  const rows = await sql`UPDATE ${sql(table)} SET ${sql(body, ...keys)} WHERE id = ${id} AND user_id = ${userId} RETURNING *`
  return c.json(rows.length ? mapKeys(rows[0], toCamel) : null)
})

app.delete('/api/:collection/:id', async (c) => {
  const { collection, id } = c.req.param()
  const userId = c.get('userId')
  const table = toSnake(collection)
  await sql`DELETE FROM ${sql(table)} WHERE id = ${id} AND user_id = ${userId}`
  return c.json({ success: true })
})

app.delete('/api/audio/:publicId', async (c) => {
  const { publicId } = c.req.param()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
  return c.json({ success: true })
})

// ponytail: server-side PDF generation for mobile.
// Client-side PDF (web) uses @react-pdf/renderer directly in browser.
// These endpoints let mobile request a server-rendered PDF.

const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#1a1a1a' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subheader: { fontSize: 13, color: '#666', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 16, marginBottom: 8, borderBottom: '1 solid #ccc', paddingBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 120, color: '#666' },
  value: { flex: 1 },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #eee', paddingVertical: 4 },
  tableHeader: { fontWeight: 'bold', backgroundColor: '#f5f5f5', paddingVertical: 6 },
  cell: { flex: 1, fontSize: 10 },
  cellRight: { flex: 1, fontSize: 10, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, fontSize: 9, color: '#999', textAlign: 'center', borderTop: '1 solid #eee', paddingTop: 8 },
})

async function uploadPdfToCloudinary(buffer, userId, type, id) {
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      resource_type: 'raw',
      folder: `reguleran/documents/${userId}`,
      public_id: `${type}-${id}-${Date.now()}`,
    }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    }).end(buffer)
  })
  return uploadResult.secure_url
}

app.post('/api/proposals/:id/generate-pdf', async (c) => {
  const { id } = c.req.param()
  const userId = c.get('userId')
  const [proposal] = await sql`SELECT * FROM proposals WHERE id = ${id} AND user_id = ${userId}`
  if (!proposal) return c.json({ error: 'Not found' }, 404)
  const [band] = proposal.band_profile_id
    ? await sql`SELECT * FROM band_profiles WHERE id = ${proposal.band_profile_id}`
    : []
  const data = mapKeys(proposal, toCamel)
  const bandData = band ? mapKeys(band, toCamel) : null

  const doc = React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: pdfStyles.page },
      React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.header }, bandData?.bandName || 'Reguleran'),
        React.createElement(Text, { style: pdfStyles.subheader }, bandData?.tagline || 'Proposal Booking'),
        bandData?.logoUrl && React.createElement(Text, null, `Logo: ${bandData.logoUrl}`),
        bandData?.description && React.createElement(Text, { style: { marginBottom: 12 } }, bandData.description),
      ),
      React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Detail Proposal'),
        React.createElement(View, { style: pdfStyles.row },
          React.createElement(Text, { style: pdfStyles.label }, 'Venue'),
          React.createElement(Text, { style: pdfStyles.value }, data.venueName),
        ),
        data.proposedDate && React.createElement(View, { style: pdfStyles.row },
          React.createElement(Text, { style: pdfStyles.label }, 'Tanggal'),
          React.createElement(Text, { style: pdfStyles.value }, data.proposedDate),
        ),
        data.performanceFormat && React.createElement(View, { style: pdfStyles.row },
          React.createElement(Text, { style: pdfStyles.label }, 'Format'),
          React.createElement(Text, { style: pdfStyles.value }, data.performanceFormat),
        ),
        data.rateOffered && React.createElement(View, { style: pdfStyles.row },
          React.createElement(Text, { style: pdfStyles.label }, 'Rate'),
          React.createElement(Text, { style: pdfStyles.value }, `Rp ${Number(data.rateOffered).toLocaleString('id-ID')}`),
        ),
        data.rateNotes && React.createElement(View, { style: pdfStyles.row },
          React.createElement(Text, { style: pdfStyles.label }, 'Catatan Rate'),
          React.createElement(Text, { style: pdfStyles.value }, data.rateNotes),
        ),
      ),
      bandData?.genres?.length > 0 && React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Genre'),
        React.createElement(Text, null, bandData.genres.join(', ')),
      ),
      data.testimonials?.length > 0 && React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Testimoni'),
        ...data.testimonials.map((t, i) =>
          React.createElement(View, { key: i, style: { marginBottom: 4 } },
            React.createElement(Text, { style: { fontStyle: 'italic' } }, `"${t.quote}"`),
            React.createElement(Text, { style: { color: '#666', fontSize: 10 } }, `— ${t.name}`),
          )
        ),
      ),
      React.createElement(Text, { style: pdfStyles.footer }, `Dibuat dengan Reguleran — ${new Date().toLocaleDateString('id-ID')}`),
    ),
  )

  const buffer = await pdf(doc).toBuffer()
  const pdfUrl = await uploadPdfToCloudinary(buffer, userId, 'proposal', id)
  await sql`UPDATE proposals SET pdf_url = ${pdfUrl}, updated_at = NOW() WHERE id = ${id}`
  return c.json({ pdfUrl })
})

app.post('/api/eventDocuments/:id/generate-pdf', async (c) => {
  const { id } = c.req.param()
  const userId = c.get('userId')
  const [doc] = await sql`SELECT * FROM event_documents WHERE id = ${id} AND user_id = ${userId}`
  if (!doc) return c.json({ error: 'Not found' }, 404)
  const data = mapKeys(doc, toCamel)

  let sessionName = 'Event'
  if (data.sessionId) {
    const [session] = await sql`SELECT name, location FROM sessions WHERE id = ${data.sessionId}`
    if (session) {
      sessionName = session.name
    }
  }

  const rider = data.soundNeeds || {}
  const instruments = data.instrumentNeeds || []
  const budget = data.budgetItems || []

  const docEl = React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: pdfStyles.page },
      React.createElement(Text, { style: pdfStyles.header }, sessionName),
      React.createElement(Text, { style: pdfStyles.subheader }, 'Technical Rider'),
      React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Sound System'),
      rider.channels && React.createElement(View, { style: pdfStyles.row },
        React.createElement(Text, { style: pdfStyles.label }, 'Channel'),
        React.createElement(Text, { style: pdfStyles.value }, String(rider.channels)),
      ),
      rider.monitors && React.createElement(View, { style: pdfStyles.row },
        React.createElement(Text, { style: pdfStyles.label }, 'Monitor'),
        React.createElement(Text, { style: pdfStyles.value }, String(rider.monitors)),
      ),
      rider.mics?.length > 0 && React.createElement(View, null,
        React.createElement(Text, { style: { fontWeight: 'bold', marginTop: 8, marginBottom: 4 } }, 'Microphones'),
        rider.mics.map((m, i) =>
          React.createElement(View, { key: i, style: pdfStyles.row },
            React.createElement(Text, { style: pdfStyles.label }, m.type),
            React.createElement(Text, { style: pdfStyles.value }, `x${m.qty}`),
          )
        ),
      ),
      rider.notes && React.createElement(View, { style: { marginTop: 8 } },
        React.createElement(Text, { style: pdfStyles.label }, 'Notes'),
        React.createElement(Text, { style: pdfStyles.value }, rider.notes),
      ),
      instruments.length > 0 && React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Instrument Requirements'),
        instruments.map((inst, i) =>
          React.createElement(View, { key: i, style: { marginBottom: 6 } },
            React.createElement(Text, { style: { fontWeight: 'bold', textTransform: 'capitalize' } }, inst.role),
            React.createElement(Text, null, inst.items.join(', ')),
            inst.notes && React.createElement(Text, { style: { color: '#666', fontSize: 10 } }, inst.notes),
          )
        ),
      ),
      data.stageLayoutNotes && React.createElement(View, null,
        React.createElement(Text, { style: pdfStyles.sectionTitle }, 'Stage Layout'),
        React.createElement(Text, null, data.stageLayoutNotes),
      ),
      data.soundcheckTime && React.createElement(View, { style: pdfStyles.row },
        React.createElement(Text, { style: pdfStyles.label }, 'Soundcheck'),
        React.createElement(Text, { style: pdfStyles.value }, data.soundcheckTime),
      ),
      data.powerNeeds && React.createElement(View, { style: pdfStyles.row },
        React.createElement(Text, { style: pdfStyles.label }, 'Power'),
        React.createElement(Text, { style: pdfStyles.value }, data.powerNeeds),
      ),
    ),
    budget.length > 0 && React.createElement(Page, { size: 'A4', style: pdfStyles.page },
      React.createElement(Text, { style: pdfStyles.header }, sessionName),
      React.createElement(Text, { style: pdfStyles.subheader }, 'RAB — Rincian Anggaran Biaya'),
      React.createElement(View, { style: [pdfStyles.tableRow, pdfStyles.tableHeader] },
        React.createElement(Text, { style: { width: '20%', fontSize: 10, fontWeight: 'bold' } }, 'Kategori'),
        React.createElement(Text, { style: { width: '35%', fontSize: 10, fontWeight: 'bold' } }, 'Deskripsi'),
        React.createElement(Text, { style: { width: '10%', fontSize: 10, fontWeight: 'bold', textAlign: 'center' } }, 'Qty'),
        React.createElement(Text, { style: { width: '20%', fontSize: 10, fontWeight: 'bold', textAlign: 'right' } }, 'Harga'),
        React.createElement(Text, { style: { width: '15%', fontSize: 10, fontWeight: 'bold', textAlign: 'right' } }, 'Subtotal'),
      ),
      budget.map((item, i) =>
        React.createElement(View, { key: i, style: pdfStyles.tableRow },
          React.createElement(Text, { style: { width: '20%', fontSize: 10 } }, item.category),
          React.createElement(Text, { style: { width: '35%', fontSize: 10 } }, item.description),
          React.createElement(Text, { style: { width: '10%', fontSize: 10, textAlign: 'center' } }, String(item.qty)),
          React.createElement(Text, { style: { width: '20%', fontSize: 10, textAlign: 'right' } }, `Rp ${Number(item.unitPrice).toLocaleString('id-ID')}`),
          React.createElement(Text, { style: { width: '15%', fontSize: 10, textAlign: 'right' } }, `Rp ${Number(item.subtotal).toLocaleString('id-ID')}`),
        )
      ),
      React.createElement(View, { style: { flexDirection: 'row', borderTop: '2 solid #333', paddingVertical: 6, marginTop: 4 } },
        React.createElement(Text, { style: { width: '85%', fontSize: 11, fontWeight: 'bold', textAlign: 'right' } }, 'Total'),
        React.createElement(Text, { style: { width: '15%', fontSize: 11, fontWeight: 'bold', textAlign: 'right' } }, `Rp ${Number(data.budgetTotal || 0).toLocaleString('id-ID')}`),
      ),
      data.budgetNotes && React.createElement(Text, { style: { marginTop: 16, fontSize: 10, color: '#666' } }, `Catatan: ${data.budgetNotes}`),
      React.createElement(Text, { style: pdfStyles.footer }, `Dibuat dengan Reguleran — ${new Date().toLocaleDateString('id-ID')}`),
    ),
  )

  const buffer = await pdf(docEl).toBuffer()
  const pdfUrl = await uploadPdfToCloudinary(buffer, userId, 'event-document', id)
  await sql`UPDATE event_documents SET pdf_url = ${pdfUrl}, updated_at = NOW() WHERE id = ${id}`
  return c.json({ pdfUrl })
})

const PORT = parseInt(process.env.PORT || '3001')
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Reguleran API on http://localhost:${info.port}`)
})
