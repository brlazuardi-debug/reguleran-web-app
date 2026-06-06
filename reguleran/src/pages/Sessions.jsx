import { useEffect, useState } from 'react'
import { CalendarCheck, Plus } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import useSetlistStore from '../stores/setlistStore'
import SessionCard from '../components/sessions/SessionCard'
import SessionForm from '../components/sessions/SessionForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'

export default function Sessions() {
  const { sessions, loading, subscribe: subSessions, addSession } = useSessionStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSessions()
    const unsub2 = subSetlists()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSessions, subSetlists])

  const handleAdd = async (data) => {
    setSubmitting(true)
    try {
      await addSession(data)
      setShowForm(false)
      toast({ type: 'success', message: 'Sesi berhasil dibuat' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const activeSessions = sessions.filter((s) => s.active !== false)
  const inactiveSessions = sessions.filter((s) => s.active === false)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sesi Rutin"
        description={`${activeSessions.length} sesi aktif`}
        actions={
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            icon={showForm ? undefined : Plus}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Batal' : 'Buat Sesi'}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Buat Sesi Baru</h2>
          <SessionForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            setlists={setlists}
            submitting={submitting}
          />
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : sessions.length === 0 && !showForm ? (
        <EmptyState
          icon={CalendarCheck}
          title="Belum ada sesi"
          description="Buat sesi rutin untuk jadwal manggung kamu"
          action={
            <Button icon={Plus} onClick={() => setShowForm(true)}>Buat Sesi</Button>
          }
        />
      ) : (
        <>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-stone-700 dark:text-stone-300">Sesi Aktif</h2>
              <Badge variant="success" size="sm">{activeSessions.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeSessions.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </div>

          {inactiveSessions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-semibold text-stone-500 dark:text-stone-400">Sesi Nonaktif</h2>
                <Badge variant="default" size="sm">{inactiveSessions.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inactiveSessions.map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
