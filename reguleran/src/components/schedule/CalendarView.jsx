import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DAY_NAMES } from '../../utils/transpose'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

export default function CalendarView({ sessions }) {
  const today = new Date().getDay()
  const [viewWeek, setViewWeek] = useState(0)

  const getWeekDates = (weekOffset) => {
    const dates = []
    const start = new Date()
    start.setDate(start.getDate() - today + weekOffset * 7)
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = getWeekDates(viewWeek)

  const sessionsByDay = {}
  sessions.forEach((s) => {
    const dayIdx = DAY_NAMES.indexOf(s.day)
    if (!sessionsByDay[dayIdx]) sessionsByDay[dayIdx] = []
    sessionsByDay[dayIdx].push(s)
  })

  const isToday = (d) => {
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }

  const weekLabel = viewWeek === 0 ? 'Minggu Ini' : viewWeek === -1 ? 'Minggu Lalu' : `Minggu ${viewWeek > 0 ? '+ ' : ''}${viewWeek}`

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" icon={ChevronLeft} onClick={() => setViewWeek((w) => w - 1)}>
          Sebelumnya
        </Button>
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">{weekLabel}</h3>
        <Button variant="secondary" size="sm" icon={ChevronRight} iconPosition="right" onClick={() => setViewWeek((w) => w + 1)}>
          Berikutnya
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-stone-500 dark:text-stone-400 py-2">
            {name.slice(0, 3)}
          </div>
        ))}

        {weekDates.map((date, idx) => {
          const dayIdx = date.getDay()
          const daySessions = sessionsByDay[dayIdx] || []
          const isTodayDate = isToday(date)

          return (
            <div
              key={idx}
              className={`min-h-[90px] rounded-xl border p-1.5 transition-colors ${
                isTodayDate
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className={`text-xs text-center mb-1 font-medium ${
                isTodayDate
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-stone-400 dark:text-stone-500'
              }`}>
                {date.getDate()}
              </div>
              <div className="space-y-0.5">
                {daySessions.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    className="text-[11px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-md px-1 py-0.5 truncate font-medium"
                  >
                    {s.time && `${s.time} `}{s.name}
                  </div>
                ))}
                {daySessions.length > 2 && (
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 text-center font-medium">
                    +{daySessions.length - 2} lagi
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
