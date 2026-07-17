import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Music, ListMusic, CalendarCheck, ArrowRight, TrendingUp, Clock, Sparkles, Settings, Layers, SlidersHorizontal, Globe } from 'lucide-react'
import useSongStore from '../stores/songStore'
import useSetlistStore from '../stores/setlistStore'
import useSessionStore from '../stores/sessionStore'
import useRoleStore from '../stores/roleStore'
import RoleBadge from '../components/role/RoleBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

const ROLE_LABELS = {
  guitar: 'Gitaris',
  bass: 'Bassist',
  keyboard: 'Keyboardist',
  drums: 'Drummer',
  vocal: 'Vokalis',
}

const statCards = [
  { label: 'Total Lagu', link: '/app/songs', icon: Music, key: 'songs' },
  { label: 'Setlist', link: '/app/setlists', icon: ListMusic, key: 'setlists' },
  { label: 'Sesi Aktif', link: '/app/sessions', icon: CalendarCheck, key: 'sessions' },
]

export default function Dashboard() {
  const { songs, subscribe: subSongs } = useSongStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const { sessions, subscribe: subSessions, getUpcoming } = useSessionStore()
  const { role } = useRoleStore()

  useEffect(() => {
    const unsub1 = subSongs()
    const unsub2 = subSetlists()
    const unsub3 = subSessions()
    return () => { unsub1?.(); unsub2?.(); unsub3?.() }
  }, [subSongs, subSetlists, subSessions])

  const upcoming = getUpcoming().slice(0, 5)

  const songsWithSections = songs.filter((s) => s.sections?.length > 0).length
  const songsWithRoleNotes = songs.filter((s) => s.sections?.some((sec) => sec.roleNotes)).length

  const getValue = (key) => {
    if (key === 'songs') return songs.length
    if (key === 'setlists') return setlists.length
    if (key === 'sessions') return sessions.filter(s => s.active !== false).length
    return 0
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-neutral-900 dark:text-white">Selamat Datang</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Overview aktivitas musik kamu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const value = getValue(stat.key)
          return (
            <Link key={stat.label} to={stat.link} className="group">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2">
                  <div className="w-full h-full rounded-full bg-neutral-500/5 dark:bg-neutral-500/10 blur-2xl" />
                </div>
                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                      <Icon size={22} className="text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <ArrowRight size={16} className="text-neutral-300 dark:text-neutral-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-display text-neutral-900 dark:text-white mb-1">{value}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Link to="/app/settings" className="group">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 p-5 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Settings size={22} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <ArrowRight size={16} className="text-neutral-300 dark:text-neutral-600 transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Peran Aktif</p>
            {role ? (
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">
                  {ROLE_LABELS[role] || role}
                </span>
                <RoleBadge role={role} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-display text-neutral-400 dark:text-neutral-500">
                  Belum diatur
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  Klik atur
                </span>
              </div>
            )}
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
              {role ? 'Ubah peran di Pengaturan' : 'Atur peran untuk melihat catatan khusus'}
            </p>
          </div>
        </Link>

        <Link to="/app/songs" className="group">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 p-5 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Layers size={22} className="text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
              <ArrowRight size={16} className="text-neutral-300 dark:text-neutral-600 transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Ada Bagian</p>
                <p className="text-2xl sm:text-3xl font-display text-neutral-900 dark:text-white">{songsWithSections}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">dari {songs.length} lagu</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Ada Catatan</p>
                <p className="text-2xl sm:text-3xl font-display text-neutral-900 dark:text-white">{songsWithRoleNotes}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">dari {songs.length} lagu</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Clock size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Sesi Mendatang</h2>
            </div>
            {upcoming.length > 0 && (
              <Link to="/app/sessions" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:underline">Lihat semua</Link>
            )}
          </div>
          <div className="p-5">
            {upcoming.length > 0 ? (
              <div className="space-y-2">
                {upcoming.map((s) => (
                  <Link key={s.id} to="/app/sessions" className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <CalendarCheck size={15} className="text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">{s.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.day}{s.time ? ` \u2022 ${s.time}` : ''}</p>
                      </div>
                    </div>
                    <Badge variant="default" size="sm" dot>
                      {s.daysUntil === 0 ? 'Hari ini' : `${s.daysUntil} hari`}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                  <CalendarCheck size={24} className="text-neutral-400 dark:text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada sesi mendatang</p>
                <Link to="/app/sessions" className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-2 hover:underline">
                  Buat sesi baru
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <TrendingUp size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Aktivitas Cepat</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <Link to="/app/songs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Music size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Tambah Lagu Baru</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Tambahkan chord dan lirik lagu</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/app/setlists" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <ListMusic size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Buat Setlist Baru</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Atur lagu untuk manggung</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/app/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <CalendarCheck size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Atur Jadwal</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Kelola jadwal latihan dan manggung</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <SlidersHorizontal size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Tools</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <Link to="/app/pitchlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <SlidersHorizontal size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Pitchlist</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Transpose cepat banyak lagu</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/app/library" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Globe size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Library Publik</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Jelajahi lagu dari player lain</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/app/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <CalendarCheck size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Jadwal</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Kalender mingguan sesi</p>
              </div>
              <ArrowRight size={15} className="text-neutral-300 dark:text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {songs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 p-8 sm:p-12">
          <EmptyState
            icon={Music}
            title="Belum ada lagu"
            description="Mulai dengan menambah lagu pertama kamu! Atur chord, lirik, dan nada dasar dengan mudah."
            action={
              <Link to="/app/songs">
                <Button icon={Music} size="lg">Tambah Lagu</Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  )
}
