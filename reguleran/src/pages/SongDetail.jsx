import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, Music, Eye, EyeOff } from 'lucide-react'
import useSongStore from '../stores/songStore'
import ChordDisplay from '../components/songs/ChordDisplay'
import TransposeSlider from '../components/songs/TransposeSlider'
import RoleSpecificPanel from '../components/songs/RoleSpecificPanel'
import { lazy, Suspense } from 'react'
const PitchShifter = lazy(() => import('../components/audio/PitchShifter'))
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import useViewPreferencesStore from '../stores/viewPreferencesStore'
import { useActiveRole } from '../hooks/useActiveRole'

export default function SongDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { songs, subscribe, deleteSong } = useSongStore()
  const [transpose, setTranspose] = useState(0)
  const [showPitch, setShowPitch] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const song = songs.find((s) => s.id === id)
  const sections = song?.sections || []

  const { showAllRoles, setShowAllRoles } = useViewPreferencesStore()
  const activeRole = useActiveRole()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSong(id)
      toast({ type: 'success', message: 'Lagu berhasil dihapus' })
      navigate('/app/songs')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal hapus: ' + err.message })
      setDeleting(false)
    }
  }

  if (!song) return <Spinner className="min-h-[60vh]" size="lg" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/app/songs')}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{song.title}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {song.artist || '—'} <span className="mx-1.5">•</span> Nada dasar: {song.key || 'N/A'}
              {song.bpm ? <span className="mx-1.5">•</span> : ''}{song.bpm ? `${song.bpm} BPM` : ''}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => navigate(`/app/songs/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <ChordDisplay lyrics={song.lyrics} transpose={transpose} sections={sections} filterByRole={!showAllRoles ? activeRole : null} />
          </Card>

          {activeRole && sections.some((s) => s.roleNotes) && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Catatan Peran
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    {showAllRoles ? 'Semua' : 'Peran Saya'}
                  </span>
                  <button
                    onClick={() => setShowAllRoles(!showAllRoles)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {showAllRoles ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {sections.filter((s) => showAllRoles || (activeRole && s.roleNotes?.[activeRole])).map((section) => (
                  <RoleSpecificPanel key={section.id} section={section} />
                ))}
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-1 space-y-4">
          <TransposeSlider value={transpose} onChange={setTranspose} />
          <Button variant="secondary" fullWidth icon={Music} onClick={() => setShowPitch(!showPitch)}>
            {showPitch ? 'Tutup' : 'Pitch Shifter'}
          </Button>
        </div>
      </div>

      {showPitch && (
        <Suspense fallback={<div className="text-sm text-neutral-400">Memuat pitch shifter…</div>}>
          <PitchShifter songId={song.id} audioUrl={song.audioUrl} audioFileName={song.audioFileName} />
        </Suspense>
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
