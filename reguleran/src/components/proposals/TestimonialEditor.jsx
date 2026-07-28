import { Plus, X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

export default function TestimonialEditor({ testimonials, onChange }) {
  const add = () => onChange([...testimonials, { name: '', quote: '' }])
  const remove = (idx) => onChange(testimonials.filter((_, i) => i !== idx))
  const update = (idx, field, value) => {
    const updated = testimonials.map((t, i) => i === idx ? { ...t, [field]: value } : t)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {testimonials.map((t, i) => (
        <div key={i} className="relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-2 right-2 p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
            <Input label="Nama" value={t.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Contoh: Mang Ujang" />
            <Textarea label="Testimoni" value={t.quote} onChange={(e) => update(i, 'quote', e.target.value)} rows={2} placeholder="Band ini keren abis!" />
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={add}>
        Tambah Testimoni
      </Button>
    </div>
  )
}
