import { X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const ROLE_OPTIONS = ['guitar', 'bass', 'keyboard', 'drums', 'vocal']
const ROLE_LABELS = { guitar: 'Gitar', bass: 'Bass', keyboard: 'Keyboard', drums: 'Drum', vocal: 'Vokal' }
const PRESET_ITEMS = {
  guitar: ['Ampli 50W', 'DI Box', 'Gitar Cadangan', 'Tuner', 'Kabel Jack'],
  bass: ['Ampli Bass 100W', 'DI Box', 'Bass Cadangan', 'Tuner', 'Kabel Jack'],
  keyboard: ['Keyboard Stand', 'Ampli Keyboard', 'Kabel Power', 'Kabel Audio', 'Kursi'],
  drums: ['Drum Kit Lengkap', 'Kursi Drum', 'Cymbal Stand', 'Hi-hat Stand', 'Kick Pedal'],
  vocal: ['Mic Stand', 'Pop Filter', 'Monitor Kecil', 'Kabel XLR'],
}

export default function InstrumentNeedsForm({ instrumentNeeds, onChange }) {
  const add = (role) => onChange([...instrumentNeeds, { role, items: [], notes: '' }])
  const remove = (idx) => onChange(instrumentNeeds.filter((_, i) => i !== idx))
  const toggleItem = (idx, item) => {
    const updated = instrumentNeeds.map((inst, i) => {
      if (i !== idx) return inst
      const items = inst.items.includes(item) ? inst.items.filter((x) => x !== item) : [...inst.items, item]
      return { ...inst, items }
    })
    onChange(updated)
  }

  const rolesWithItems = instrumentNeeds.map((i) => i.role)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((role) => (
          <Button
            key={role}
            type="button"
            variant={rolesWithItems.includes(role) ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => rolesWithItems.includes(role) ? remove(instrumentNeeds.findIndex((i) => i.role === role)) : add(role)}
          >
            {rolesWithItems.includes(role) ? `✓ ${ROLE_LABELS[role]}` : `+ ${ROLE_LABELS[role]}`}
          </Button>
        ))}
      </div>

      {instrumentNeeds.map((inst, idx) => (
        <div key={idx} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-neutral-900 dark:text-white capitalize">{inst.role}</h4>
            <button type="button" onClick={() => remove(idx)} className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(PRESET_ITEMS[inst.role] || []).map((item) => (
              <label key={item} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${inst.items.includes(item) ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                <input type="checkbox" className="hidden" checked={inst.items.includes(item)} onChange={() => toggleItem(idx, item)} />
                {item}
              </label>
            ))}
          </div>
          <Input label="Catatan" value={inst.notes || ''} onChange={(e) => {
            const updated = instrumentNeeds.map((x, i) => i === idx ? { ...x, notes: e.target.value } : x)
            onChange(updated)
          }} placeholder="Kebutuhan khusus..." />
        </div>
      ))}
    </div>
  )
}
