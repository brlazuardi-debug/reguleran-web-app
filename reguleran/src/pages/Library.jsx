import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Sparkles, Search, Music, Plus } from 'lucide-react'
import useLibraryStore from '../stores/libraryStore'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

export default function Library() {
  const { publicSongs, loading, subscribe } = useLibraryStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const filtered = publicSongs.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.title?.toLowerCase().includes(q) ||
      s.artist?.toLowerCase().includes(q) ||
      s.key?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Library Publik</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {publicSongs.length} lagu dari berbagai player
          </p>
        </div>
        <Link
          to="/app/songs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
        >
          <Plus size={16} />
          Bagikan Lagu
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lagu publik..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : publicSongs.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="Belum ada lagu publik"
          description="Bagikan lagu kamu ke publik agar player lain bisa melihatnya"
          action={
            <Link to="/app/songs" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 transition-all">
              <Plus size={16} />
              Bagikan Lagu
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="Lagu tidak ditemukan" description={`Tidak ada lagu publik yang cocok dengan "${search}"`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((song) => (
            <div
              key={song.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Music size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">{song.title}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{song.artist || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {song.bpm && (
                        <Badge variant="default" size="sm">{song.bpm} BPM</Badge>
                      )}
                      <Badge variant="primary" size="sm">{song.key || 'N/A'}</Badge>
                    </div>
                  </div>
                  {song.sharedByName && (
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
                      Dibagikan oleh: {song.sharedByName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
