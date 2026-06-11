import { useEffect, useState } from 'react'
import { SlidersHorizontal, Sparkles, Search, RotateCcw, Plus } from 'lucide-react'
import useSongStore from '../stores/songStore'
import usePitchlistStore from '../stores/pitchlistStore'
import PitchCard from '../components/pitchlist/PitchCard'
import SongForm from '../components/songs/SongForm'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'

export default function Pitchlist() {
  const { songs, loading, subscribe, addSong } = useSongStore()
  const { transposeOffsets, setTranspose, resetAll } = usePitchlistStore()
  const [search, setSearch] = useState('')
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
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = songs.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.title?.toLowerCase().includes(q) ||
      s.artist?.toLowerCase().includes(q) ||
      s.key?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Pitchlist</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Pitchlist</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Atur nada dasar lagu dengan transpose cepat
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={RotateCcw} onClick={resetAll}>
            Reset Semua
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(true)}>
            Tambah Lagu
          </Button>
        </div>
      </div>

      {songs.length > 0 && (
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lagu..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : songs.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="Belum ada lagu"
          description="Tambah lagu pertama kamu untuk mulai menggunakan Pitchlist"
          action={
            <Button icon={Plus} onClick={() => setShowForm(true)}>Tambah Lagu</Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Lagu tidak ditemukan"
          description={`Tidak ada lagu yang cocok dengan "${search}"`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((song) => (
            <PitchCard
              key={song.id}
              song={song}
              transpose={transposeOffsets[song.id] ?? 0}
              onTransposeChange={(offset) => setTranspose(song.id, offset)}
            />
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Tambah Lagu Baru" size="lg">
        <SongForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
      </Modal>
    </div>
  )
}
