import { useState } from 'react'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      artist,
      key,
      bpm: bpm ? parseInt(bpm, 10) : null,
      isPublic,
      lyrics,
    })
  }

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
