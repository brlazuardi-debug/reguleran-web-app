import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useSetlistStore from '../stores/setlistStore'
import useSongStore from '../stores/songStore'
import SongPicker from '../components/setlists/SongPicker'
import SetlistForm from '../components/setlists/SetlistForm'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function SetlistEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setlists, subscribe: subSL, updateSetlist } = useSetlistStore()
  const { songs, subscribe: subSongs } = useSongStore()
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSL()
    const unsub2 = subSongs()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSL, subSongs])

  const setlist = setlists.find((s) => s.id === id)
  if (!setlist) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateSetlist(id, data)
      toast({ type: 'success', message: 'Setlist diperbarui' })
      navigate(`/app/setlists/${id}`)
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddSong = (song) => {
    const currentSongs = setlist?.songs || []
    const newSongs = [...currentSongs, { songId: song.id, transpose: 0, order: currentSongs.length }]
    updateSetlist(id, { songs: newSongs })
  }

  const handleRemoveSong = (idx) => {
    const currentSongs = setlist?.songs || []
    const newSongs = currentSongs.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i }))
    updateSetlist(id, { songs: newSongs })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(`/app/setlists/${id}`)}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-1"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Edit Setlist</h1>

      <Card>
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">Detail Setlist</h2>
        <SetlistForm initial={setlist} onSubmit={handleEdit} onCancel={() => navigate(`/app/setlists/${id}`)} submitting={submitting} />
      </Card>

      <Card>
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Atur Lagu</h2>
        <SongPicker
          songs={songs}
          selected={setlist.songs || []}
          onAdd={handleAddSong}
          onRemove={handleRemoveSong}
        />
      </Card>
    </div>
  )
}
