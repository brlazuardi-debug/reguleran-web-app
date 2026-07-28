import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, CalendarCheck, MapPin, Clock, Music, Phone, User, FileText, Mic } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import useSetlistStore from '../stores/setlistStore'
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
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSessions()
    const unsub2 = subSetlists()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSessions, subSetlists])

  const session = sessions.find((s) => s.id === id)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSession(id)
      toast({ type: 'success', message: 'Sesi dihapus' })
      navigate('/app/sessions')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
      setDeleting(false)
    }
  }

  const toggleActive = async () => {
    await updateSession(id, { active: !session.active })
  }

  if (!session) return <Spinner className="min-h-[60vh]" size="lg" />

  const associatedSetlist = session.setlistId
    ? setlists.find((sl) => sl.id === session.setlistId)
    : null

  const dayIndex = DAY_NAMES.indexOf(session.day)
  const today = new Date().getDay()
  let daysUntil = dayIndex - today
  if (daysUntil < 0) daysUntil += 7

  const loc = session.location || {}

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/app/sessions')}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{session.name}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Setiap {session.day}{session.time ? ` | ${session.time}` : ''}
            </p>
            <Badge variant={daysUntil === 0 ? 'success' : 'primary'} size="sm" className="mt-2">
              {daysUntil === 0 ? 'Hari ini' : `${daysUntil} hari lagi`}
            </Badge>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            <Button variant="secondary" size="sm" icon={Mic} onClick={() => navigate(`/app/sessions/${id}/rider`)}>
              Rider & RAB
            </Button>
            <Button variant="secondary" size="sm" onClick={toggleActive}>
              {session.active !== false ? 'Nonaktifkan' : 'Aktifkan'}
            </Button>
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => navigate(`/app/sessions/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Detail Sesi</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <CalendarCheck size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Hari</p>
                <p className="font-medium text-neutral-900 dark:text-white">{session.day}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Clock size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Jam</p>
                <p className="font-medium text-neutral-900 dark:text-white">{session.time || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Music size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Setlist</p>
                <p className="font-medium">
                  {associatedSetlist ? (
                    <button onClick={() => navigate(`/app/setlists/${associatedSetlist.id}`)} className="text-neutral-600 dark:text-neutral-400 hover:underline">
                      {associatedSetlist.name}
                    </button>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <MapPin size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Status</p>
                <Toggle checked={session.active !== false} onChange={toggleActive} label={session.active !== false ? 'Aktif' : 'Nonaktif'} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Lokasi & Kontak</h3>
          <div className="space-y-3">
            {loc.venue && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <MapPin size={16} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Tempat</p>
                  <p className="font-medium text-neutral-900 dark:text-white">{loc.venue}</p>
                  {loc.address && <p className="text-xs text-neutral-400">{loc.address}</p>}
                </div>
              </div>
            )}
            {loc.contactPerson && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <User size={16} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Kontak Person</p>
                  <p className="font-medium text-neutral-900 dark:text-white">{loc.contactPerson}</p>
                </div>
              </div>
            )}
            {loc.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Phone size={16} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Telepon</p>
                  <a href={`tel:${loc.phone}`} className="font-medium text-neutral-600 dark:text-neutral-400 hover:underline">{loc.phone}</a>
                </div>
              </div>
            )}
            {loc.locationNotes && (
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText size={16} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Catatan</p>
                  <p className="font-medium text-neutral-900 dark:text-white whitespace-pre-wrap text-sm">{loc.locationNotes}</p>
                </div>
              </div>
            )}
            {!loc.venue && !loc.contactPerson && !loc.phone && !loc.locationNotes && (
              <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">Tidak ada informasi lokasi</p>
            )}
          </div>
        </Card>
      </div>

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
