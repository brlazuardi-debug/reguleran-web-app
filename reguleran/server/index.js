import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import postgres from 'postgres'
import { createClerkClient } from '@clerk/backend'
import { v2 as cloudinary } from 'cloudinary'

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
app.use('/api/*', cors({ origin: process.env.CORS_ORIGIN || '*' }))
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
    const { sub } = await clerk.verifyToken(auth.slice(7))
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
  const rows = await sql`SELECT * FROM ${sql(toSnake(collection))} WHERE id = ${id}`
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
  const body = mapKeys(await c.req.json(), toSnake)
  const keys = Object.keys(body)
  const rows = await sql`UPDATE ${sql(toSnake(collection))} SET ${sql(body, ...keys)} WHERE id = ${id} RETURNING *`
  return c.json(rows.length ? mapKeys(rows[0], toCamel) : null)
})

app.delete('/api/:collection/:id', async (c) => {
  const { collection, id } = c.req.param()
  await sql`DELETE FROM ${sql(toSnake(collection))} WHERE id = ${id}`
  return c.json({ success: true })
})

app.delete('/api/audio/:publicId', async (c) => {
  const { publicId } = c.req.param()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
  return c.json({ success: true })
})

const PORT = parseInt(process.env.PORT || '3001')
serve(app, (info) => {
  console.log(`Reguleran API on http://localhost:${info.port}`)
})
