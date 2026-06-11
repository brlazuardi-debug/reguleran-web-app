import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, ListMusic } from 'lucide-react'
import useSetlistStore from '../stores/setlistStore'
import useSongStore from '../stores/songStore'
import SongPicker from '../components/setlists/SongPicker'
import SetlistForm from '../components/setlists/SetlistForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function SetlistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setlists, subscribe: subSL, updateSetlist, deleteSetlist } = useSetlistStore()
  const { songs, subscribe: subSongs } = useSongStore()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subSL()
    const unsub2 = subSongs()
    return () => { unsub1?.(); unsub2?.() }
  }, [subSL, subSongs])

  const setlist = setlists.find((s) => s.id === id)

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateSetlist(id, data)
      setEditing(false)
      toast({ type: 'success', message: 'Setlist diperbarui' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSetlist(id)
      toast({ type: 'success', message: 'Setlist dihapus' })
      navigate('/app/setlists')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
      setDeleting(false)
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

  if (!setlist) {
    return <Spinner className="min-h-[60vh]" size="lg" />
  }

  const sortedSongs = (setlist.songs || [])
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, song: songs.find((sg) => sg.id === s.songId) }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/app/setlists')}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{setlist.name}</h1>
            {setlist.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{setlist.description}</p>
            )}
            <Badge variant="default" size="sm" className="mt-2">{sortedSongs.length} lagu</Badge>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => setEditing(!editing)}>
              {editing ? 'Batal' : 'Edit'}
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {editing ? (
        <Card>
          <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">Edit Setlist</h2>
          <SetlistForm initial={setlist} onSubmit={handleEdit} onCancel={() => setEditing(false)} submitting={submitting} />
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Atur Lagu</h3>
            <SongPicker
              songs={songs}
              selected={setlist.songs || []}
              onAdd={handleAddSong}
              onRemove={handleRemoveSong}
            />
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">
              Daftar Lagu ({sortedSongs.length})
            </h2>
            {sortedSongs.length === 0 ? (
              <EmptyState
                icon={ListMusic}
                title="Belum ada lagu"
                description="Tambahkan lagu ke setlist ini"
              />
            ) : (
              <div className="space-y-1">
                {sortedSongs.map((item, idx) => (
                  <div
                    key={item.songId}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm text-neutral-400 dark:text-neutral-500 w-6 shrink-0">{idx + 1}.</span>
                      <div className="min-w-0">
                        {item.song ? (
                          <Link
                            to={`/app/songs/${item.songId}`}
                            className="font-medium text-sm text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                          >
                            {item.song.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-neutral-400">(lagu tidak ditemukan)</span>
                        )}
                        {item.song?.artist && (
                          <span className="text-xs text-neutral-400 ml-2">{item.song.artist}</span>
                        )}
                      </div>
                    </div>
                    {item.transpose !== 0 && (
                      <Badge variant="success" size="sm">
                        {item.transpose > 0 ? '+' : ''}{item.transpose}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
              Tambah Lagu ke Setlist
            </h3>
            <SongPicker
              songs={songs}
              selected={setlist.songs || []}
              onAdd={handleAddSong}
              onRemove={handleRemoveSong}
            />
          </Card>
        </>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Setlist"
        message={`Apakah kamu yakin ingin menghapus "${setlist.name}"?`}
        loading={deleting}
      />
    </div>
  )
}
