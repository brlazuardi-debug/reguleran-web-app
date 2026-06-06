import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Music, ListMusic, CalendarCheck, ArrowRight } from 'lucide-react'
import useSongStore from '../stores/songStore'
import useSetlistStore from '../stores/setlistStore'
import useSessionStore from '../stores/sessionStore'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'

const statIcons = [Music, ListMusic, CalendarCheck]

export default function Dashboard() {
  const { songs, subscribe: subSongs } = useSongStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const { sessions, subscribe: subSessions, getUpcoming } = useSessionStore()

  useEffect(() => {
    const unsub1 = subSongs()
    const unsub2 = subSetlists()
    const unsub3 = subSessions()
    return () => { unsub1?.(); unsub2?.(); unsub3?.() }
  }, [subSongs, subSetlists, subSessions])

  const upcoming = getUpcoming().slice(0, 3)

  const stats = [
    { label: 'Total Lagu', value: songs.length, link: '/songs', gradient: 'from-primary-500 to-violet-500' },
    { label: 'Setlist', value: setlists.length, link: '/setlists', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Sesi Aktif', value: sessions.filter(s => s.active !== false).length, link: '/sessions', gradient: 'from-amber-500 to-rose-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview aktivitas musik kamu"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = statIcons[i]
          return (
            <Link key={stat.label} to={stat.link}>
              <Card hover className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-br ${stat.gradient} opacity-5 dark:opacity-10`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-stone-800/80 flex items-center justify-center shadow-sm">
                      <Icon size={20} className={`text-${stat.gradient.split(' ')[0].replace('from-', '')}`} />
                    </div>
                    <ArrowRight size={16} className="text-stone-300 dark:text-stone-600" />
                  </div>
                  <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{stat.label}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {upcoming.length > 0 && (
        <Card>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-3">Sesi Mendatang</h2>
          <div className="space-y-2">
            {upcoming.map((s) => (
              <Link
                key={s.id}
                to="/sessions"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate">{s.name}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {s.day}{s.time ? ` • ${s.time}` : ''}
                  </p>
                </div>
                <Badge variant={s.daysUntil === 0 ? 'success' : 'primary'} size="sm">
                  {s.daysUntil === 0 ? 'Hari ini' : `${s.daysUntil} hari lagi`}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {songs.length === 0 && (
        <EmptyState
          icon={Music}
          title="Belum ada lagu"
          description="Mulai dengan menambah lagu pertama kamu!"
          action={
            <Link to="/songs">
              <Button icon={Music}>Tambah Lagu</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
