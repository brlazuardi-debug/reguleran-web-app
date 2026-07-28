import { useState } from 'react'
import { Search, Check } from 'lucide-react'

export default function SetlistPicker({ setlists, selectedId, onSelect }) {
  const [search, setSearch] = useState('')
  const filtered = setlists.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
        <input
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-9 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari setlist..."
        />
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-xl p-2">
        <button
          type="button"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${!selectedId ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'}`}
          onClick={() => onSelect(null)}
        >
          <span className={!selectedId ? 'font-medium' : ''}>— Tanpa setlist —</span>
          {!selectedId && <Check size={16} className="text-emerald-500" />}
        </button>
        {filtered.map((sl) => (
          <button
            key={sl.id}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedId === sl.id ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'}`}
            onClick={() => onSelect(sl.id)}
          >
            <span className={selectedId === sl.id ? 'font-medium' : ''}>{sl.name}</span>
            {selectedId === sl.id && <Check size={16} className="text-emerald-500" />}
          </button>
        ))}
        {filtered.length === 0 && search && (
          <p className="text-xs text-neutral-400 text-center py-3">Setlist tidak ditemukan</p>
        )}
      </div>
    </div>
  )
}
