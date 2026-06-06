import { useEffect, useState } from 'react'
import { ListMusic, Plus } from 'lucide-react'
import useSetlistStore from '../stores/setlistStore'
import SetlistCard from '../components/setlists/SetlistCard'
import SetlistForm from '../components/setlists/SetlistForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'

export default function Setlists() {
  const { setlists, loading, subscribe, addSetlist } = useSetlistStore()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const handleAdd = async (data) => {
    setSubmitting(true)
    try {
      await addSetlist(data)
      setShowForm(false)
      toast({ type: 'success', message: 'Setlist berhasil dibuat' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Setlist"
        description={`${setlists.length} setlist tersimpan`}
        actions={
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            icon={showForm ? undefined : Plus}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Batal' : 'Buat Setlist'}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Setlist Baru</h2>
          <SetlistForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : setlists.length === 0 && !showForm ? (
        <EmptyState
          icon={ListMusic}
          title="Belum ada setlist"
          description="Buat setlist untuk mengatur lagu-lagu kamu"
          action={
            <Button icon={Plus} onClick={() => setShowForm(true)}>Buat Setlist</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {setlists.map((sl) => (
            <SetlistCard key={sl.id} setlist={sl} />
          ))}
        </div>
      )}
    </div>
  )
}
