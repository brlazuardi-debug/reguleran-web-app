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
      className="block rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <CalendarCheck size={18} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">{session.name}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Setiap {session.day}{session.time ? ` | ${session.time}` : ''}
              </p>
            </div>
            <Badge variant={daysUntil === 0 ? 'success' : daysUntil <= 2 ? 'warning' : 'primary'} size="sm">
              {dayLabel}
            </Badge>
          </div>
          {session.location?.venue && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 flex items-center gap-1">
              <MapPin size={12} />
              {session.location.venue}
            </p>
          )}
          {session.location?.contactPerson && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1">
              <User size={12} />
              {session.location.contactPerson}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
