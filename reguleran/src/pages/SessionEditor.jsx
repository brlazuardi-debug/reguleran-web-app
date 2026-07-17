import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import useSetlistStore from '../stores/setlistStore'
import SessionForm from '../components/sessions/SessionForm'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function SessionEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sessions, subscribe: subSessions, updateSession } = useSessionStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSessions()
    const unsub2 = subSetlists()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSessions, subSetlists])

  const session = sessions.find((s) => s.id === id)
  if (!session) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateSession(id, data)
      toast({ type: 'success', message: 'Sesi diperbarui' })
      navigate(`/app/sessions/${id}`)
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(`/app/sessions/${id}`)}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-1"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Edit Sesi</h1>

      <Card>
        <SessionForm initial={session} setlists={setlists} onSubmit={handleEdit} onCancel={() => navigate(`/app/sessions/${id}`)} submitting={submitting} />
      </Card>
    </div>
  )
}
