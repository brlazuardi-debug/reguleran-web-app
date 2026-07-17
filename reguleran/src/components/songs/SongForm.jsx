import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, FileAudio, Play, Pause } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'

const KEY_OPTIONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm']

export default function SongForm({ initial, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [artist, setArtist] = useState(initial?.artist || '')
  const [key, setKey] = useState(initial?.key || 'C')
  const [bpm, setBpm] = useState(initial?.bpm || '')
  const [isPublic, setIsPublic] = useState(initial?.isPublic || false)
  const [lyrics, setLyrics] = useState(initial?.lyrics || '')
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    }
  }, [audioPreviewUrl])

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('audio/')) return
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    setAudioFile(file)
    setAudioPreviewUrl(URL.createObjectURL(file))
    setIsPreviewPlaying(false)
  }

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer?.files?.[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const removeAudio = () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    setAudioFile(null)
    setAudioPreviewUrl(null)
    setIsPreviewPlaying(false)
  }

  const togglePreview = () => {
    if (!audioRef.current) return
    if (isPreviewPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPreviewPlaying(!isPreviewPlaying)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      artist,
      key,
      bpm: bpm ? parseInt(bpm, 10) : null,
      isPublic,
      lyrics,
      audioFile,
    })
  }

  const isNew = !initial

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Judul Lagu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Judul lagu"
        />
        <Input
          label="Artis"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Nama artis"
        />
        <Select
          label="Nada Dasar"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          options={KEY_OPTIONS}
        />
        <Input
          label="BPM (opsional)"
          type="number"
          min="1"
          max="300"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="120"
        />
      </div>

      <div className="flex items-center gap-3 py-2">
        <Toggle
          checked={isPublic}
          onChange={setIsPublic}
          label="Bagikan ke publik"
        />
        <span className="text-xs text-stone-400 dark:text-stone-500">
          Izinkan player lain melihat lagu ini
        </span>
      </div>

      <Textarea
        label="Lirik & Chord"
        helperText="Gunakan [C] [Am] [F] untuk menandai chord"
        rows={10}
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder={`[C]Ku ingin [Am]berjalan [F]bersamamu [G7]\n[C]Di malam [Am]minggu yang [F]indah ini [G7]`}
        className="font-mono text-sm"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Audio {isNew ? '(opsional)' : ''}
        </label>

        {!audioFile && !initial?.audioFileName ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              isDragOver
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-stone-300 dark:border-stone-700 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-stone-900'
            }`}
          >
            <Upload size={24} className="text-stone-400 dark:text-stone-500" />
            <span className="text-sm text-stone-500 dark:text-stone-400 text-center">
              Tarik & lepas file audio di sini<br />atau klik untuk memilih
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              MP3, WAV, OGG — maksimal 20MB
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
            <FileAudio size={20} className="text-primary-600 dark:text-primary-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                {audioFile?.name || initial?.audioFileName || 'Audio'}
              </p>
              {audioPreviewUrl && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {isPreviewPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {isPreviewPlaying ? 'Pause' : 'Preview'}
                  </button>
                  <span className="text-xs text-stone-400">
                    {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={removeAudio}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {initial?.audioFileName && !audioFile && (
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
            Audio saat ini: {initial.audioFileName}. Gunakan Pitch Shifter di halaman lagu untuk mengganti.
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>

      <audio
        ref={audioRef}
        src={audioPreviewUrl}
        onEnded={() => setIsPreviewPlaying(false)}
        onPause={() => setIsPreviewPlaying(false)}
        onPlay={() => setIsPreviewPlaying(true)}
        className="hidden"
      />

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {initial ? 'Simpan Perubahan' : 'Tambah Lagu'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Batal
          </Button>
        )}
      </div>
    </form>
  )
}

export { KEY_OPTIONS }
