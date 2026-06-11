import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'
import { Badge } from '../ui/Badge'

export default function SongCard({ song }) {
  const keyLabel = song.key || 'N/A'

  return (
    <Link
      to={`/app/songs/${song.id}`}
      className="block rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
          <Music size={18} className="text-primary-600 dark:text-primary-400" />
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
              <Badge variant="primary" size="sm">{keyLabel}</Badge>
            </div>
          </div>
          {song.lyrics && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 line-clamp-2">
              {song.lyrics.replace(/\[([^\]]+)\]/g, '').trim().slice(0, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
