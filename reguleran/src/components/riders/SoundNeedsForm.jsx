import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { X, Plus } from 'lucide-react'

export default function SoundNeedsForm({ soundNeeds, onChange }) {
  const mics = soundNeeds.mics || []

  const update = (field, value) => onChange({ ...soundNeeds, [field]: value })
  const addMic = () => update('mics', [...mics, { type: '', qty: 1 }])
  const removeMic = (idx) => update('mics', mics.filter((_, i) => i !== idx))
  const updateMic = (idx, field, value) => update('mics', mics.map((m, i) => i === idx ? { ...m, [field]: field === 'qty' ? Number(value) : value } : m))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Jumlah Channel Mixer" type="number" value={soundNeeds.channels || ''} onChange={(e) => update('channels', Number(e.target.value))} min={0} />
        <Input label="Jumlah Monitor Panggung" type="number" value={soundNeeds.monitors || ''} onChange={(e) => update('monitors', Number(e.target.value))} min={0} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Daftar Microphone</label>
          <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addMic}>Tambah</Button>
        </div>
        {mics.map((m, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              value={m.type}
              onChange={(e) => updateMic(i, 'type', e.target.value)}
              placeholder="Tipe Mic (Vocal/Instrument/DI Box)"
            />
            <input
              className="w-20 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 text-center"
              type="number"
              min={1}
              value={m.qty}
              onChange={(e) => updateMic(i, 'qty', e.target.value)}
            />
            <button type="button" onClick={() => removeMic(i)} className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <Textarea label="Catatan Sound System" value={soundNeeds.notes || ''} onChange={(e) => update('notes', e.target.value)} rows={2} />
    </div>
  )
}
