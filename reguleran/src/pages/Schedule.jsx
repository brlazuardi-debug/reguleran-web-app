import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, List, CalendarCheck, Sparkles, ArrowRight, Download } from 'lucide-react'
import useSessionStore from '../stores/sessionStore'
import CalendarView from '../components/schedule/CalendarView'
import { DAY_NAMES } from '../utils/transpose'
import { generateIcsCalendar, downloadIcsFile } from '../utils/calendar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Tabs } from '../components/ui/Tabs'
import { EmptyState } from '../components/ui/EmptyState'

export default function Schedule() {
  const { sessions, subscribe } = useSessionStore()
  const [activeTab, setActiveTab] = useState('calendar')

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const activeSessions = sessions.filter((s) => s.active !== false)

  const sortedSessions = [...activeSessions]
    .sort((a, b) => {
      const da = DAY_NAMES.indexOf(a.day)
      const db = DAY_NAMES.indexOf(b.day)
      return da - db
    })

  const handleExport = () => {
    const ics = generateIcsCalendar(activeSessions)
    downloadIcsFile(ics)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Jadwal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Jadwal Mingguan</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Lihat dan atur jadwal sesi mingguan</p>
        </div>
        {activeSessions.length > 0 && (
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>
            Export ke Kalender
          </Button>
        )}
      </div>

      <Tabs items={[
        { value: 'calendar', label: 'Kalender', icon: CalendarDays },
        { value: 'list', label: 'Daftar', icon: List },
      ]} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'calendar' ? (
        <CalendarView sessions={sessions} />
      ) : (
        <Card padding={false} variant="glass">
          {sortedSessions.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="Tidak ada jadwal" description="Belum ada sesi aktif yang dijadwalkan" />
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {sortedSessions.map((s) => (
                <Link key={s.id} to={`/app/sessions/${s.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                      <CalendarCheck size={17} className="text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">{s.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.day}{s.time ? ` | ${s.time}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.location?.venue && <span className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:inline">{s.location.venue}</span>}
                    <ArrowRight size={14} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
