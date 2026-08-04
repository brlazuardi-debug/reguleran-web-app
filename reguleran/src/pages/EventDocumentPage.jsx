import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import useEventDocumentStore from '../stores/useEventDocumentStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import SoundNeedsForm from '../components/riders/SoundNeedsForm'
import InstrumentNeedsForm from '../components/riders/InstrumentNeedsForm'
import BudgetTable from '../components/riders/BudgetTable'

function RiderForm({ existingDoc, onSave, onGeneratePdf }) {
  const [soundNeeds, setSoundNeeds] = useState(existingDoc?.soundNeeds || {})
  const [instrumentNeeds, setInstrumentNeeds] = useState(existingDoc?.instrumentNeeds || [])
  const [stageLayoutNotes, setStageLayoutNotes] = useState(existingDoc?.stageLayoutNotes || '')
  const [soundcheckTime, setSoundcheckTime] = useState(existingDoc?.soundcheckTime || '')
  const [powerNeeds, setPowerNeeds] = useState(existingDoc?.powerNeeds || '')
  const [budgetItems, setBudgetItems] = useState(existingDoc?.budgetItems || [])
  const [budgetNotes, setBudgetNotes] = useState(existingDoc?.budgetNotes || '')
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)

  const budgetTotal = budgetItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)

  const handleSave = async () => {
    setSubmitting(true)
    await onSave({
      soundNeeds,
      instrumentNeeds,
      stageLayoutNotes: stageLayoutNotes || null,
      soundcheckTime: soundcheckTime || null,
      powerNeeds: powerNeeds || null,
      budgetItems,
      budgetTotal,
      budgetNotes: budgetNotes || null,
    })
    setSubmitting(false)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await onGeneratePdf()
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" size="sm" icon={Save} onClick={handleSave} loading={submitting}>
          Simpan
        </Button>
        <Button variant="primary" size="sm" icon={Upload} onClick={handleGenerate} loading={generating}>
          Generate PDF
        </Button>
      </div>

      <Card>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Kebutuhan Sound</h3>
        <SoundNeedsForm soundNeeds={soundNeeds} onChange={setSoundNeeds} />
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Kebutuhan Alat per Instrumen</h3>
        <InstrumentNeedsForm instrumentNeeds={instrumentNeeds} onChange={setInstrumentNeeds} />
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Stage & Jadwal</h3>
        <div className="space-y-4">
          <Textarea label="Catatan Layout Panggung" value={stageLayoutNotes} onChange={(e) => setStageLayoutNotes(e.target.value)} rows={3} placeholder="Posisi drummer di kiri belakang, vocal di tengah..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Jam Soundcheck" type="time" value={soundcheckTime} onChange={(e) => setSoundcheckTime(e.target.value)} />
            <Input label="Kebutuhan Listrik/Power" value={powerNeeds} onChange={(e) => setPowerNeeds(e.target.value)} placeholder="1500W, butuh colokan tambahan..." />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Rincian Anggaran Biaya</h3>
        <BudgetTable items={budgetItems} onChange={setBudgetItems} />
        <div className="mt-4">
          <Textarea label="Catatan Anggaran" value={budgetNotes} onChange={(e) => setBudgetNotes(e.target.value)} rows={2} placeholder="Catatan tambahan..." />
        </div>
      </Card>
    </div>
  )
}

export default function EventDocumentPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { sessions, subscribe: subSessions } = useSessionStore()
  const { documents, subscribe: subDocs, upsertDocument } = useEventDocumentStore()
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSessions()
    const unsub2 = subDocs()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSessions, subDocs])

  const session = sessions.find((s) => s.id === sessionId)
  const existingDoc = documents.find((d) => d.sessionId === sessionId)

  if (!session) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleSave = async (data) => {
    try {
      await upsertDocument({ sessionId, ...data })
      toast({ type: 'success', message: 'Dokumen event disimpan' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    }
  }

  const generatePdf = async () => {
    const existing = documents.find((d) => d.sessionId === sessionId)
    if (!existing) {
      toast({ type: 'error', message: 'Simpan dulu sebelum generate PDF' })
      return
    }
    try {
      const API = import.meta.env.VITE_API_URL || '/api'
      const token = await window.Clerk?.session?.getToken()
      const res = await fetch(`${API}/eventDocuments/${existing.id}/generate-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Gagal generate PDF')
      const { pdfUrl } = await res.json()
      toast({ type: 'success', message: 'PDF siap' })
      if (pdfUrl) window.open(pdfUrl, '_blank')
    } catch (err) {
      toast({ type: 'error', message: err.message })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate(`/app/sessions/${sessionId}`)}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali ke sesi
        </button>
        <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Rider & RAB</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{session.name}</p>
      </div>

      <RiderForm
        key={existingDoc?.id || 'new'}
        existingDoc={existingDoc}
        onSave={handleSave}
        onGeneratePdf={generatePdf}
      />
    </div>
  )
}
