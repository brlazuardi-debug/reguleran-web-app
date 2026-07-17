import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Music } from 'lucide-react'
import useSongStore from '../stores/songStore'
import SongForm from '../components/songs/SongForm'
import SongSectionEditor from '../components/songs/SongSectionEditor'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function SongEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { songs, subscribe, updateSong } = useSongStore()
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const song = songs.find((s) => s.id === id)
  const sections = song?.sections || []
  const [editedSections, setEditedSections] = useState(sections)

  // ponytail: reset local sections when the underlying song changes (e.g. first load)
  if (song && JSON.stringify(sections) !== JSON.stringify(editedSections) && editedSections.length === 0) {
    setEditedSections(sections)
  }

  if (!song) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await updateSong(id, { ...data, sections: editedSections })
      toast({ type: 'success', message: 'Lagu berhasil diperbarui' })
      navigate(`/app/songs/${id}`)
    } catch (err) {
      toast({ type: 'error', message: 'Gagal update: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(`/app/songs/${id}`)}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-1"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Edit Lagu</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Music size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Detail Lagu</h2>
            </div>
            <SongForm initial={song} onSubmit={handleSubmit} onCancel={() => navigate(`/app/songs/${id}`)} submitting={submitting} />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <SongSectionEditor lyrics={song.lyrics} sections={editedSections} onChange={setEditedSections} />
          </Card>
        </div>
      </div>
    </div>
  )
}
