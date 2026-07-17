import { useEffect, useState } from 'react'
import { Music, Plus, Sparkles, Search, ArrowUpDown, ChevronDown } from 'lucide-react'
import useSongStore from '../stores/songStore'
import SongCard from '../components/songs/SongCard'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { Link } from 'react-router-dom'

const KEY_OPTIONS_ALL = ['', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm']

const PAGE_SIZE = 20

export default function Songs() {
  const { songs, loading, subscribe } = useSongStore()
  const [search, setSearch] = useState('')
  const [keyFilter, setKeyFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(0)
  const [prevKey, setPrevKey] = useState('')

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const filterKey = JSON.stringify({ search, keyFilter, sortBy })
  if (filterKey !== prevKey) {
    setPrevKey(filterKey)
    setPage(0)
  }

  let filtered = songs.filter((s) => {
    if (search) {
      const q = search.toLowerCase()
      if (!s.title?.toLowerCase().includes(q) && !s.artist?.toLowerCase().includes(q)) return false
    }
    if (keyFilter && s.key !== keyFilter) return false
    return true
  })

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
    if (sortBy === 'artist') return (a.artist || '').localeCompare(b.artist || '')
    if (sortBy === 'bpm') return (a.bpm || 0) - (b.bpm || 0)
    return (b.createdAt || '').localeCompare(a.createdAt || '')
  })

  const paged = filtered.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = paged.length < filtered.length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Musik</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Katalog Lagu</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{songs.length} lagu tersimpan</p>
        </div>
        <Link to="/app/songs/new">
          <Button variant="primary" icon={Plus}>Tambah Lagu</Button>
        </Link>
      </div>

      {songs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau artis..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
            />
          </div>
          <select
            value={keyFilter}
            onChange={(e) => setKeyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
          >
            <option value="">Semua Nada</option>
            {KEY_OPTIONS_ALL.filter(Boolean).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            >
              <option value="newest">Terbaru</option>
              <option value="title">Judul A-Z</option>
              <option value="artist">Artis A-Z</option>
              <option value="bpm">BPM</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : songs.length === 0 ? (
        <EmptyState icon={Music} title="Belum ada lagu" description="Tambah lagu pertama kamu untuk memulai!" action={
          <Link to="/app/songs/new"><Button icon={Plus}>Tambah Lagu</Button></Link>
        } />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="Lagu tidak ditemukan" description="Tidak ada lagu yang cocok" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paged.map((song) => <SongCard key={song.id} song={song} />)}
          </div>
          {hasMore && (
            <div className="text-center pt-2">
              <Button variant="secondary" icon={ChevronDown} onClick={() => setPage(page + 1)}>
                Tampilkan Lainnya ({filtered.length - paged.length} tersisa)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
