import { useState } from 'react'
import { DAY_NAMES } from '../../utils/transpose'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

export default function SessionForm({ initial, setlists, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initial?.name || '')
  const [day, setDay] = useState(initial?.day || 'Sabtu')
  const [time, setTime] = useState(initial?.time || '19:00')
  const [venue, setVenue] = useState(initial?.location?.venue || '')
  const [address, setAddress] = useState(initial?.location?.address || '')
  const [lat, setLat] = useState(initial?.location?.lat || '')
  const [lng, setLng] = useState(initial?.location?.lng || '')
  const [setlistId, setSetlistId] = useState(initial?.setlistId || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      day,
      time,
      location: {
        venue,
        address,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
      setlistId: setlistId || null,
      active: true,
    })
  }

  const setlistOptions = [
    { value: '', label: '— Pilih setlist —' },
    ...setlists.map(sl => ({ value: sl.id, label: sl.name })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Sesi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Mis: Reguleran Cafe"
        />
        <Select
          label="Setlist (opsional)"
          value={setlistId}
          onChange={(e) => setSetlistId(e.target.value)}
          options={setlistOptions}
        />
        <Select
          label="Hari"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          options={DAY_NAMES}
        />
        <Input
          label="Jam"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
        <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Lokasi</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Tempat"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Mis: Cafe Senja"
          />
          <Input
            label="Alamat"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jl. Contoh No. 123"
          />
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="-6.2088"
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="106.8456"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {initial ? 'Simpan Perubahan' : 'Buat Sesi'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>
        )}
      </div>
    </form>
  )
}
