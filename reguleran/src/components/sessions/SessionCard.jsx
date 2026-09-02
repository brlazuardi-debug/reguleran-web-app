import { Link } from 'react-router-dom'
import { MapPin, CalendarCheck, User } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { DAY_NAMES } from '../../utils/transpose'

export default function SessionCard({ session }) {
  const dayIndex = DAY_NAMES.indexOf(session.day)
  const today = new Date().getDay()
  let daysUntil = dayIndex - today
  if (daysUntil < 0) daysUntil += 7

  const dayLabel = daysUntil === 0 ? 'Hari ini' : daysUntil === 1 ? 'Besok' : `${daysUntil} hari lagi`

  return (
    <Link
      to={`/app/sessions/${session.id}`}
      className="block rounded-xl border border-white/[0.08] hover:border-white/[0.20] bg-[#13161B] p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#272a2f] border border-white/[0.08] flex items-center justify-center shrink-0">
          <CalendarCheck size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-white truncate">{session.name}</h3>
              <p className="text-xs text-[#8e9192] font-mono mt-0.5">
                Setiap {session.day}{session.time ? ` | ${session.time}` : ''}
              </p>
            </div>
            <Badge variant={daysUntil === 0 ? 'success' : daysUntil <= 2 ? 'warning' : 'primary'} size="sm">
              {dayLabel}
            </Badge>
          </div>
          {session.location?.venue && (
            <p className="text-xs text-[#8e9192] mt-2 flex items-center gap-1 font-mono">
              <MapPin size={11} />
              {session.location.venue}
            </p>
          )}
          {session.location?.contactPerson && (
            <p className="text-xs text-[#8e9192] mt-1 flex items-center gap-1 font-mono">
              <User size={11} />
              {session.location.contactPerson}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
