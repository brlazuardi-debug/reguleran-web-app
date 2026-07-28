import { useState } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import SetlistPicker from './SetlistPicker'
import TestimonialEditor from './TestimonialEditor'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Terkirim' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
]

export default function ProposalForm({ initial, setlists, bandProfile, onSubmit, onCancel, submitting }) {
  const [venueName, setVenueName] = useState(initial?.venueName || '')
  const [venueContact, setVenueContact] = useState(initial?.venueContact || '')
  const [proposedDate, setProposedDate] = useState(initial?.proposedDate || '')
  const [proposedTime, setProposedTime] = useState(initial?.proposedTime || '')
  const [performanceFormat, setPerformanceFormat] = useState(initial?.performanceFormat || '')
  const [rateOffered, setRateOffered] = useState(initial?.rateOffered || '')
  const [rateNotes, setRateNotes] = useState(initial?.rateNotes || '')
  const [featuredSetlistId, setFeaturedSetlistId] = useState(initial?.featuredSetlistId || '')
  const [testimonials, setTestimonials] = useState(initial?.testimonials || [])
  const [status, setStatus] = useState(initial?.status || 'draft')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      venueName,
      venueContact: venueContact || null,
      proposedDate: proposedDate || null,
      proposedTime: proposedTime || null,
      performanceFormat: performanceFormat || null,
      rateOffered: rateOffered ? Number(rateOffered) : null,
      rateNotes: rateNotes || null,
      featuredSetlistId: featuredSetlistId || null,
      testimonials,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bandProfile && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
          <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-400">
            {bandProfile.bandName?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{bandProfile.bandName}</p>
            <p className="text-xs text-neutral-400">Profil ini akan dipakai di proposal</p>
          </div>
        </div>
      )}
      {!bandProfile && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl">
          Belum ada profil band. Buat profil dulu di menu Band Profil.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Venue" value={venueName} onChange={(e) => setVenueName(e.target.value)} required placeholder="Cafe Senja" />
        <Input label="Kontak Venue" value={venueContact} onChange={(e) => setVenueContact(e.target.value)} placeholder="0812-xxxx-xxxx" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Tanggal Proposal" type="date" value={proposedDate} onChange={(e) => setProposedDate(e.target.value)} />
        <Input label="Waktu" type="time" value={proposedTime} onChange={(e) => setProposedTime(e.target.value)} />
      </div>

      <Textarea label="Format Penampilan" value={performanceFormat} onChange={(e) => setPerformanceFormat(e.target.value)} rows={2} placeholder='Contoh: "2 sesi x 45 menit dengan jeda 15 menit"' />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Rate (Rp)" type="number" value={rateOffered} onChange={(e) => setRateOffered(e.target.value)} placeholder="5000000" min={0} />
        <Input label="Catatan Rate" value={rateNotes} onChange={(e) => setRateNotes(e.target.value)} placeholder="Termasuk transport & konsumsi" />
      </div>

      <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Setlist Andalan (opsional)</h4>
        <SetlistPicker setlists={setlists} selectedId={featuredSetlistId} onSelect={setFeaturedSetlistId} />
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Testimoni</h4>
        <TestimonialEditor testimonials={testimonials} onChange={setTestimonials} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initial ? 'Simpan Perubahan' : 'Buat Proposal'}
        </Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>}
      </div>
    </form>
  )
}
