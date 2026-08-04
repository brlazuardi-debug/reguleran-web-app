import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Music, ChevronDown, ChevronUp } from 'lucide-react'
import ChordDisplay from '../songs/ChordDisplay'
import { lazy, Suspense } from 'react'
const PitchShifter = lazy(() => import('../audio/PitchShifter'))
import { Badge } from '../ui/Badge'

const PRESETS = [-5, -2, 0, 2, 5]

export default function PitchCard({ song, transpose, onTransposeChange }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
            <Music size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/app/songs/${song.id}`} className="font-semibold text-stone-900 dark:text-stone-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {song.title}
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{song.artist || '—'}</p>
          </div>
          <Badge variant="primary" size="sm">{song.key || 'N/A'}</Badge>
        </div>

        {song.bpm && (
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">BPM: {song.bpm}</p>
        )}
      </div>

      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onTransposeChange(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                transpose === p
                  ? 'bg-primary-600 text-white shadow-sm'
                  : p === 0
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    : 'bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              {p > 0 ? `+${p}` : p}
            </button>
          ))}
        </div>
      </div>

      {transpose !== 0 && (
        <div className="px-4 pb-3">
          <Badge variant="warning" size="sm">
            Transpose {transpose > 0 ? '+' : ''}{transpose} dari {song.key || 'N/A'}
          </Badge>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 border-t border-stone-100 dark:border-stone-800 transition-colors"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Tutup' : 'Lihat Chord & Audio'}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-3">
          <div className="max-h-48 overflow-y-auto">
            <ChordDisplay lyrics={song.lyrics} transpose={transpose} />
          </div>
          <Suspense fallback={<div className="text-sm text-neutral-400 p-4">Memuat pitch shifter…</div>}>
            <PitchShifter songId={song.id} audioUrl={song.audioUrl} audioFileName={song.audioFileName} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
