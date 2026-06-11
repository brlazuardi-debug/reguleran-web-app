import { useEffect, useState } from 'react'
import { ListMusic, Plus, Sparkles } from 'lucide-react'
import useSetlistStore from '../stores/setlistStore'
import SetlistCard from '../components/setlists/SetlistCard'
import SetlistForm from '../components/setlists/SetlistForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Setlist</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Setlist</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{setlists.length} setlist tersimpan</p>
        </div>
        <Button variant={showForm ? 'secondary' : 'primary'} icon={showForm ? undefined : Plus} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : 'Buat Setlist'}
        </Button>
      </div>

      {showForm && (
        <Card variant="glass" className="border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <ListMusic size={16} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Setlist Baru</h2>
          </div>
          <SetlistForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : setlists.length === 0 && !showForm ? (
        <EmptyState icon={ListMusic} title="Belum ada setlist" description="Buat setlist untuk mengatur lagu-lagu kamu" action={
          <Button icon={Plus} onClick={() => setShowForm(true)}>Buat Setlist</Button>
        } />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {setlists.map((sl) => <SetlistCard key={sl.id} setlist={sl} />)}
        </div>
      )}
    </div>
  )
}
