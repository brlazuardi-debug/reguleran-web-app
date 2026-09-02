import { useState } from 'react'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

export default function SetlistForm({ initial, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, description, songs: initial?.songs || [] })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Setlist"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        label="Deskripsi / Catatan (opsional)"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {initial ? 'Simpan' : 'Buat Setlist'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>
        )}
      </div>
    </form>
  )
}
