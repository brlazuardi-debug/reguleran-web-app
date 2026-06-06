import { useState } from 'react'
import { Search, Plus, X, Check, Music } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

export default function SongPicker({ songs, selected, onAdd, onRemove }) {
  const [search, setSearch] = useState('')

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist?.toLowerCase().includes(search.toLowerCase())
  )

  const alreadySelected = selected.map((s) => s.songId)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
        <input
          className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 pl-9 pr-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul atau artis..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Daftar Lagu</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-xl p-2 scrollbar-custom">
            {filtered.map((song) => {
              const isSelected = alreadySelected.includes(song.id)
              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer text-stone-900 dark:text-stone-100'
                  }`}
                  onClick={() => !isSelected && onAdd(song)}
                >
                  <div className="min-w-0 flex-1">
                    <span className="truncate block">{song.title}</span>
                    {song.artist && <span className="text-xs text-stone-400">{song.artist}</span>}
                  </div>
                  {isSelected ? (
                    <Check size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Plus size={16} className="text-stone-400 shrink-0" />
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-xs text-stone-400 text-center py-4">Tidak ada lagu</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Setlist ({selected.length} lagu)
          </h4>
          <div className="space-y-1 max-h-60 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-xl p-2 scrollbar-custom">
            {selected.map((item, idx) => {
              const song = songs.find((s) => s.id === item.songId)
              if (!song) return null
              return (
                <div
                  key={item.songId}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs text-stone-400 dark:text-stone-500 w-5 shrink-0">{idx + 1}.</span>
                    <span className="truncate text-stone-900 dark:text-stone-100">{song.title}</span>
                    {item.transpose !== 0 && (
                      <Badge variant="success" size="sm">
                        {item.transpose > 0 ? '+' : ''}{item.transpose}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(idx)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
            {selected.length === 0 && (
              <EmptyState
                icon={Music}
                title="Belum ada lagu"
                description="Klik lagu di samping untuk menambah"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
