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
      className="block rounded-xl border border-white/[0.08] hover:border-white/[0.20] bg-[#13161B] p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#272a2f] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Music size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-white truncate">{song.title}</h3>
              <p className="text-xs text-[#8e9192] truncate mt-0.5">{song.artist || '—'}</p>
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
            <p className="text-xs text-[#8e9192] mt-2 line-clamp-2 font-mono opacity-80">
              {song.lyrics.replace(/\[([^\]]+)\]/g, '').trim().slice(0, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
