import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Music } from 'lucide-react'
import SongForm from '../components/songs/SongForm'
import { Card } from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'
import useSongStore from '../stores/songStore'

export default function NewSong() {
  const navigate = useNavigate()
  const { addSong } = useSongStore()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await addSong(data)
      toast({ type: 'success', message: 'Lagu berhasil ditambahkan' })
      navigate('/app/songs')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal menambah lagu: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/app/songs')}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-1"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Music size={16} className="text-neutral-600 dark:text-neutral-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Tambah Lagu Baru</h1>
      </div>

      <Card variant="glass" className="border-neutral-300 dark:border-neutral-700">
        <SongForm onSubmit={handleSubmit} onCancel={() => navigate('/app/songs')} submitting={submitting} />
      </Card>
    </div>
  )
}
