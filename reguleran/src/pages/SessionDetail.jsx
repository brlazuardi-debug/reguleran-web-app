import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, CalendarCheck, MapPin, Clock, Music } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import useSetlistStore from '../stores/setlistStore'
import SessionForm from '../components/sessions/SessionForm'
import { LocationCard } from '../components/location/MapPicker'
import { DAY_NAMES } from '../utils/transpose'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Spinner } from '../components/ui/Spinner'
import { Toggle } from '../components/ui/Toggle'
import { useToast } from '../components/ui/Toast'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sessions, subscribe: subSessions, updateSession, deleteSession } = useSessionStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSessions()
    const unsub2 = subSetlists()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSessions, subSetlists])

  const session = sessions.find((s) => s.id === id)

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateSession(id, data)
      setEditing(false)
      toast({ type: 'success', message: 'Sesi diperbarui' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSession(id)
      toast({ type: 'success', message: 'Sesi dihapus' })
      navigate('/sessions')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
      setDeleting(false)
    }
  }

  const toggleActive = async () => {
    await updateSession(id, { active: !session.active })
  }

  if (!session) {
    return <Spinner className="min-h-[60vh]" size="lg" />
  }

  const associatedSetlist = session.setlistId
    ? setlists.find((sl) => sl.id === session.setlistId)
    : null

  const dayIndex = DAY_NAMES.indexOf(session.day)
  const today = new Date().getDay()
  let daysUntil = dayIndex - today
  if (daysUntil < 0) daysUntil += 7

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/sessions')}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{session.name}</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Setiap {session.day}{session.time ? ` | ${session.time}` : ''}
            </p>
            <Badge
              variant={daysUntil === 0 ? 'success' : 'primary'}
              size="sm"
              className="mt-2"
            >
              {daysUntil === 0 ? 'Hari ini' : `${daysUntil} hari lagi`}
            </Badge>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={toggleActive}>
              {session.active !== false ? 'Nonaktifkan' : 'Aktifkan'}
            </Button>
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => setEditing(!editing)}>
              {editing ? 'Batal' : 'Edit'}
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {editing ? (
        <Card>
          <SessionForm
            initial={session}
            setlists={setlists}
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
            submitting={submitting}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Detail Sesi</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <CalendarCheck size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">Hari</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">{session.day}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Clock size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">Jam</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">{session.time || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Music size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">Setlist</p>
                  <p className="font-medium">
                    {associatedSetlist ? (
                      <button
                        onClick={() => navigate(`/setlists/${associatedSetlist.id}`)}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {associatedSetlist.name}
                      </button>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">Status</p>
                  <Toggle
                    checked={session.active !== false}
                    onChange={toggleActive}
                    label={session.active !== false ? 'Aktif' : 'Nonaktif'}
                  />
                </div>
              </div>
            </div>
          </Card>

          <LocationCard location={session.location} />
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Sesi"
        message={`Apakah kamu yakin ingin menghapus sesi "${session.name}"?`}
        loading={deleting}
      />
    </div>
  )
}
