import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, List, CalendarCheck } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import CalendarView from '../components/schedule/CalendarView'
import { DAY_NAMES } from '../utils/transpose'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'

export default function Schedule() {
  const { sessions, subscribe } = useSessionStore()
  const [activeTab, setActiveTab] = useState('calendar')

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const sortedSessions = [...sessions]
    .filter((s) => s.active !== false)
    .sort((a, b) => {
      const da = DAY_NAMES.indexOf(a.day)
      const db = DAY_NAMES.indexOf(b.day)
      return da - db
    })

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Jadwal"
        description="Lihat jadwal sesi mingguan"
      />

      <Tabs
        items={[
          { value: 'calendar', label: 'Kalender', icon: CalendarDays },
          { value: 'list', label: 'Daftar', icon: List },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'calendar' ? (
        <CalendarView sessions={sessions} />
      ) : (
        <Card padding={false}>
          {sortedSessions.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Tidak ada jadwal"
              description="Belum ada sesi aktif yang dijadwalkan"
            />
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {sortedSessions.map((s) => (
                <Link
                  key={s.id}
                  to={`/sessions/${s.id}`}
                  className="flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-stone-900 dark:text-stone-100">{s.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {s.day}{s.time ? ` | ${s.time}` : ''}
                    </p>
                  </div>
                  {s.location?.venue && (
                    <span className="text-xs text-stone-400 dark:text-stone-500 ml-4 shrink-0">
                      {s.location.venue}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
