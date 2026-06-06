import { Link } from 'react-router-dom'
import { ListMusic } from 'lucide-react'
import { Badge } from '../ui/Badge'

export default function SetlistCard({ setlist }) {
  const songCount = setlist.songs?.length || 0

  return (
    <Link
      to={`/setlists/${setlist.id}`}
      className="block rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <ListMusic size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">{setlist.name}</h3>
          {setlist.description && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 truncate">{setlist.description}</p>
          )}
          <div className="mt-2">
            <Badge variant="default" size="sm">{songCount} lagu</Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
