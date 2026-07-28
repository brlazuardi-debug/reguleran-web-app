import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const CATEGORIES = ['Transport', 'Konsumsi', 'Sewa Alat', 'Fee Player', 'Dokumentasi', 'Lainnya']

export default function BudgetTable({ items = [], onChange }) {
  const [newCategory, setNewCategory] = useState('Transport')
  const [newDesc, setNewDesc] = useState('')
  const [newQty, setNewQty] = useState(1)
  const [newPrice, setNewPrice] = useState(0)

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const add = () => {
    if (!newDesc.trim()) return
    const id = crypto.randomUUID()
    const subtotal = newQty * newPrice
    onChange([...items, { id, category: newCategory, description: newDesc, qty: newQty, unitPrice: newPrice, subtotal }])
    setNewDesc('')
    setNewQty(1)
    setNewPrice(0)
  }

  const remove = (id) => onChange(items.filter((i) => i.id !== id))
  const update = (id, field, value) => {
    onChange(items.map((item) => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'qty' || field === 'unitPrice') {
        updated.subtotal = (field === 'qty' ? value : updated.qty) * (field === 'unitPrice' ? value : updated.unitPrice)
      }
      return updated
    }))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              <th className="text-left py-2 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs">Kategori</th>
              <th className="text-left py-2 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs">Deskripsi</th>
              <th className="text-center py-2 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs w-16">Qty</th>
              <th className="text-right py-2 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs w-28">Harga</th>
              <th className="text-right py-2 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs w-28">Subtotal</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 dark:border-neutral-800">
                <td className="py-1.5 px-2">
                  <select className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none" value={item.category} onChange={(e) => update(item.id, 'category', e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="py-1.5 px-2">
                  <input className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none" value={item.description} onChange={(e) => update(item.id, 'description', e.target.value)} />
                </td>
                <td className="py-1.5 px-2">
                  <input className="w-full bg-transparent text-sm text-center text-neutral-900 dark:text-neutral-100 focus:outline-none" type="number" min={1} value={item.qty} onChange={(e) => update(item.id, 'qty', Number(e.target.value))} />
                </td>
                <td className="py-1.5 px-2">
                  <input className="w-full bg-transparent text-sm text-right text-neutral-900 dark:text-neutral-100 focus:outline-none" type="number" min={0} value={item.unitPrice} onChange={(e) => update(item.id, 'unitPrice', Number(e.target.value))} />
                </td>
                <td className="py-1.5 px-2 text-right text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </td>
                <td className="py-1.5">
                  <button type="button" onClick={() => remove(item.id)} className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-right py-3 px-2 text-sm font-bold text-neutral-900 dark:text-white">Total</td>
              <td className="text-right py-3 px-2 text-sm font-bold text-neutral-900 dark:text-white">Rp {total.toLocaleString('id-ID')}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-end gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
        <div className="flex-1">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Kategori</label>
          <select className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500/30" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-[2]">
          <Input label="Deskripsi" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Mis: Sewa mobil pickup" />
        </div>
        <div className="w-16">
          <Input label="Qty" type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} min={1} />
        </div>
        <div className="w-28">
          <Input label="Harga" type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} min={0} />
        </div>
        <Button type="button" size="sm" icon={Plus} onClick={add}>Tambah</Button>
      </div>
    </div>
  )
}
