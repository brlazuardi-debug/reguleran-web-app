import { Link } from 'react-router-dom'
import { ListMusic } from 'lucide-react'
import { Badge } from '../ui/Badge'

export default function SetlistCard({ setlist }) {
  const songCount = setlist.songs?.length || 0

  return (
    <Link
      to={`/app/setlists/${setlist.id}`}
      className="block rounded-xl border border-white/[0.08] hover:border-white/[0.20] bg-[#13161B] p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#272a2f] border border-white/[0.08] flex items-center justify-center shrink-0">
          <ListMusic size={18} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-white truncate">{setlist.name}</h3>
          {setlist.description && (
            <p className="text-xs text-[#8e9192] mt-0.5 truncate">{setlist.description}</p>
          )}
          <div className="mt-2.5 flex items-center gap-2">
            <Badge variant="default" size="sm">{songCount} lagu</Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
