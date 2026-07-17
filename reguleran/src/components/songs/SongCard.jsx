import { Link } from 'react-router-dom'
import { Music, Layers, FileText } from 'lucide-react'
import { Badge } from '../ui/Badge'

export default function SongCard({ song }) {
  const keyLabel = song.key || 'N/A'
  const sectionCount = song.sections?.length || 0
  const hasRoleNotes = song.sections?.some((sec) => sec.roleNotes)

  return (
    <Link
      to={`/app/songs/${song.id}`}
      className="block rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
          <Music size={18} className="text-neutral-600 dark:text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{song.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{song.artist || '—'}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {sectionCount > 0 && (
                <Badge variant="default" size="sm">
                  <Layers size={10} className="inline mr-0.5" />
                  {sectionCount}
                </Badge>
              )}
              {hasRoleNotes && (
                <Badge variant="default" size="sm">
                  <FileText size={10} className="inline mr-0.5" />
                </Badge>
              )}
              {song.bpm && (
                <Badge variant="default" size="sm">{song.bpm} BPM</Badge>
              )}
              <Badge variant="primary" size="sm">{keyLabel}</Badge>
            </div>
          </div>
          {song.lyrics && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 line-clamp-2">
              {song.lyrics.replace(/\[([^\]]+)\]/g, '').trim().slice(0, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
