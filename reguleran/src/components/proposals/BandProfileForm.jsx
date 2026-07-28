import { useState } from 'react'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { X } from 'lucide-react'

export default function BandProfileForm({ initial, onSubmit, onCancel, submitting }) {
  const [bandName, setBandName] = useState(initial?.bandName || '')
  const [tagline, setTagline] = useState(initial?.tagline || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [genres, setGenres] = useState(initial?.genres || [])
  const [genreInput, setGenreInput] = useState('')
  const [memberCount, setMemberCount] = useState(initial?.memberCount || '')
  const [contactName, setContactName] = useState(initial?.contactName || '')
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone || '')
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail || '')
  const [instagram, setInstagram] = useState(initial?.socialLinks?.instagram || '')
  const [youtube, setYoutube] = useState(initial?.socialLinks?.youtube || '')
  const [tiktok, setTiktok] = useState(initial?.socialLinks?.tiktok || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      bandName,
      tagline: tagline || null,
      description: description || null,
      genres,
      memberCount: memberCount ? Number(memberCount) : null,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      socialLinks: {
        instagram: instagram || undefined,
        youtube: youtube || undefined,
        tiktok: tiktok || undefined,
      },
    })
  }

  const addGenre = () => {
    const g = genreInput.trim()
    if (g && !genres.includes(g)) {
      setGenres([...genres, g])
      setGenreInput('')
    }
  }

  const removeGenre = (g) => setGenres(genres.filter((x) => x !== g))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Band" value={bandName} onChange={(e) => setBandName(e.target.value)} required placeholder="Mis: Reguleran Band" />
        <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="The Worship Band" />
        <Input label="Jumlah Member" type="number" value={memberCount} onChange={(e) => setMemberCount(e.target.value)} placeholder="5" min={1} />
      </div>

      <Textarea label="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Cerita singkat tentang band..." />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Genre</label>
        <div className="flex gap-2 mb-2">
          <input
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGenre() } }}
            placeholder="Ketik genre lalu Enter..."
          />
          <Button type="button" variant="secondary" size="sm" onClick={addGenre}>Tambah</Button>
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {g}
                <button type="button" onClick={() => removeGenre(g)} className="hover:text-rose-500 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Kontak</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Nama Kontak" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Bang Rudi" />
          <Input label="Telepon" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="0812-xxxx-xxxx" />
          <Input label="Email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="band@email.com" />
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Media Sosial</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@reguleran" />
          <Input label="YouTube" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="youtube.com/@reguleran" />
          <Input label="TikTok" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@reguleran" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initial ? 'Simpan Perubahan' : 'Buat Profil Band'}
        </Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>}
      </div>
    </form>
  )
}
