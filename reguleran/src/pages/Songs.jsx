import { useEffect, useState } from 'react'
import { Music, Plus } from 'lucide-react'
import useSongStore from '../stores/songStore'
import SongCard from '../components/songs/SongCard'
import SongForm from '../components/songs/SongForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'

export default function Songs() {
  const { songs, loading, subscribe, addSong } = useSongStore()
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
      await addSong(data)
      setShowForm(false)
      toast({ type: 'success', message: 'Lagu berhasil ditambahkan' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal menambah lagu: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Katalog Lagu"
        description={`${songs.length} lagu tersimpan`}
        actions={
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            icon={showForm ? undefined : Plus}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Batal' : 'Tambah Lagu'}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Tambah Lagu Baru</h2>
          <SongForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : songs.length === 0 && !showForm ? (
        <EmptyState
          icon={Music}
          title="Belum ada lagu"
          description="Tambah lagu pertama kamu untuk memulai!"
          action={
            <Button icon={Plus} onClick={() => setShowForm(true)}>Tambah Lagu</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}
