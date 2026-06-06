import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, Music } from 'lucide-react'
import useSongStore from '../stores/songStore'
import ChordDisplay from '../components/songs/ChordDisplay'
import TransposeSlider from '../components/songs/TransposeSlider'
import SongForm from '../components/songs/SongForm'
import PitchShifter from '../components/audio/PitchShifter'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function SongDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { songs, subscribe, updateSong, deleteSong } = useSongStore()
  const [transpose, setTranspose] = useState(0)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPitch, setShowPitch] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const song = songs.find((s) => s.id === id)

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateSong(id, data)
      setEditing(false)
      toast({ type: 'success', message: 'Lagu berhasil diperbarui' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal update: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSong(id)
      toast({ type: 'success', message: 'Lagu berhasil dihapus' })
      navigate('/songs')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal hapus: ' + err.message })
      setDeleting(false)
    }
  }

  if (!song) {
    return (
      <Spinner className="min-h-[60vh]" size="lg" />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/songs')}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{song.title}</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {song.artist || '—'} <span className="mx-1.5">•</span> Nada dasar: {song.key || 'N/A'}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Batal' : 'Edit'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setShowDelete(true)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {editing ? (
        <Card>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Edit Lagu</h2>
          <SongForm initial={song} onSubmit={handleEdit} onCancel={() => setEditing(false)} submitting={submitting} />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <ChordDisplay lyrics={song.lyrics} transpose={transpose} />
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <TransposeSlider value={transpose} onChange={setTranspose} />
              <Button
                variant="secondary"
                fullWidth
                icon={Music}
                onClick={() => setShowPitch(!showPitch)}
              >
                {showPitch ? 'Tutup' : 'Pitch Shifter'}
              </Button>
            </div>
          </div>

          {showPitch && <PitchShifter />}
        </>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Lagu"
        message={`Apakah kamu yakin ingin menghapus "${song.title}"?`}
        loading={deleting}
      />
    </div>
  )
}
