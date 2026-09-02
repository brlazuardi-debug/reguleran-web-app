import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Music,
  ListMusic,
  CalendarCheck,
  ArrowRight,
  SlidersHorizontal,
  FileText,
  Play,
  MapPin,
  Layers,
  Radio,
  Guitar,
  Piano,
  Drum,
  Mic2,
  ChevronRight,
} from 'lucide-react'
import useSongStore from '../stores/songStore'
import useSetlistStore from '../stores/setlistStore'
import useSessionStore from '../stores/sessionStore'
import useRoleStore from '../stores/roleStore'
import { useTranslation } from '../i18n/useTranslation'

export default function Dashboard() {
  const { t } = useTranslation()
  const { songs, subscribe: subSongs } = useSongStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const { sessions, subscribe: subSessions, getUpcoming } = useSessionStore()
  const { role, setRole } = useRoleStore()

  const ROLE_OPTIONS = [
    { id: 'guitar', label: t('roles.guitar'), icon: Guitar },
    { id: 'bass', label: t('roles.bass'), icon: Music },
    { id: 'keyboard', label: t('roles.keyboard'), icon: Piano },
    { id: 'drums', label: t('roles.drums'), icon: Drum },
    { id: 'vocal', label: t('roles.vocal'), icon: Mic2 },
  ]

  useEffect(() => {
    const unsub1 = subSongs()
    const unsub2 = subSetlists()
    const unsub3 = subSessions()
    return () => {
      unsub1?.()
      unsub2?.()
      unsub3?.()
    }
  }, [subSongs, subSetlists, subSessions])

  const upcoming = getUpcoming()
  const nextGig = upcoming[0]

  const songsWithSections = songs.filter((s) => s.sections?.length > 0).length
  const songsWithRoleNotes = songs.filter((s) => s.sections?.some((sec) => sec.roleNotes)).length

  // Calculate days difference for countdown
  const getDaysCountdown = (session) => {
    if (!session?.date) return session?.daysUntil != null ? session.daysUntil : null
    const diff = new Date(session.date).getTime() - new Date().getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const gigDays = nextGig ? getDaysCountdown(nextGig) : null

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HERO STATUS BANNER (UPCOMING GIG)                      */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm dark:shadow-2xl transition-colors duration-200">
        {/* Subtle radial glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-neutral-500/5 dark:bg-white/[0.03] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex items-center gap-5 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neutral-100 dark:bg-[#272a2f] border border-neutral-200 dark:border-white/[0.15] flex items-center justify-center relative shrink-0 shadow-inner">
            <div className="absolute inset-0 rounded-xl border border-neutral-400 dark:border-white/30 animate-ping opacity-20" />
            <Radio size={28} className="text-neutral-900 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.12] text-neutral-800 dark:text-white">
                {t('dashboard.upcomingGig')}
              </span>
              {nextGig?.time && (
                <span className="font-mono text-xs text-neutral-500 dark:text-[#8e9192]">
                  {nextGig.time}
                </span>
              )}
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {nextGig ? nextGig.name : t('dashboard.noNextGig')}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-[#c4c7ca] mt-0.5">
              {nextGig
                ? gigDays === 0
                  ? t('dashboard.today')
                  : `${gigDays} ${t('dashboard.daysLeft')} ${nextGig.location ? `• ${nextGig.location}` : ''}`
                : t('dashboard.scheduleNext')}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6 md:mt-0 w-full md:w-auto">
          {nextGig ? (
            <>
              <Link
                to={`/app/sessions/${nextGig.id}/rider`}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#272a2f] dark:hover:bg-[#32353a] border border-neutral-200 dark:border-white/[0.12] rounded-lg font-medium text-xs sm:text-sm text-neutral-900 dark:text-white transition-all flex items-center justify-center gap-2"
              >
                <FileText size={15} />
                <span>{t('dashboard.openRider')}</span>
              </Link>
              {nextGig.setlistId ? (
                <Link
                  to={`/app/setlists/${nextGig.setlistId}`}
                  className="flex-1 md:flex-initial px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-300 dark:text-[#08090A] rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Play size={15} fill="currentColor" />
                  <span>{t('dashboard.startStage')}</span>
                </Link>
              ) : (
                <Link
                  to="/app/setlists"
                  className="flex-1 md:flex-initial px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-[#08090A] rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <ListMusic size={15} />
                  <span>{t('dashboard.selectSetlist')}</span>
                </Link>
              )}
            </>
          ) : (
            <Link
              to="/app/sessions"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-[#08090A] rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck size={15} />
              <span>{t('dashboard.createSession')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STAT MATRIX (3-COLUMN MINIMAL GRID)                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Lagu */}
        <Link
          to="/app/songs"
          className="group bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.20] rounded-xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#272a2f] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center text-neutral-700 dark:text-white/80 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              <Music size={18} />
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-white">
              {t('dashboard.catalogBadge')}
            </span>
          </div>
          <div>
            <p className="font-mono text-xs text-neutral-500 dark:text-[#8e9192] uppercase tracking-wider mb-1">{t('dashboard.totalSongs')}</p>
            <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{songs.length}</p>
          </div>
        </Link>

        {/* Stat 2: Setlist Siap */}
        <Link
          to="/app/setlists"
          className="group bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.20] rounded-xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#272a2f] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center text-neutral-700 dark:text-white/80 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              <ListMusic size={18} />
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-[#c4c7ca]">
              {t('dashboard.liveReadyBadge')}
            </span>
          </div>
          <div>
            <p className="font-mono text-xs text-neutral-500 dark:text-[#8e9192] uppercase tracking-wider mb-1">{t('dashboard.readySetlists')}</p>
            <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{setlists.length}</p>
          </div>
        </Link>

        {/* Stat 3: Sesi Aktif */}
        <Link
          to="/app/sessions"
          className="group bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.20] rounded-xl p-5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#272a2f] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center text-neutral-700 dark:text-white/80 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              <CalendarCheck size={18} />
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              {t('dashboard.activeBadge')}
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-mono text-xs text-neutral-500 dark:text-[#8e9192] uppercase tracking-wider mb-1">{t('dashboard.activeSessions')}</p>
            <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {sessions.filter((s) => s.active !== false).length}
            </p>
          </div>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 3. TWO-COLUMN ACTIVITY HUB                                */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri (60%): Upcoming Sessions */}
        <div className="lg:col-span-7 bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-neutral-900 dark:text-white" />
              <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">{t('dashboard.upcomingSessions')}</h3>
            </div>
            <Link
              to="/app/sessions"
              className="font-mono text-xs text-neutral-500 dark:text-[#8e9192] hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>{t('dashboard.viewAll')}</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="space-y-2.5">
              {upcoming.slice(0, 4).map((s) => {
                const days = getDaysCountdown(s)
                return (
                  <Link
                    key={s.id}
                    to={`/app/sessions/${s.id}`}
                    className="group flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-[#191c21] border border-neutral-200 dark:border-white/[0.06] hover:border-neutral-300 dark:hover:border-white/[0.18] rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 bg-neutral-200/80 dark:bg-[#272a2f] rounded-md flex flex-col items-center justify-center border border-neutral-300 dark:border-white/[0.08] shrink-0">
                        <span className="font-mono text-[9px] text-neutral-600 dark:text-[#8e9192] uppercase leading-none mb-0.5">
                          {s.day ? s.day.slice(0, 3).toUpperCase() : 'SESI'}
                        </span>
                        <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white leading-none">
                          {s.time ? s.time.slice(0, 5) : 'LIVE'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                          {s.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {s.location && (
                            <span className="px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-white/[0.04] text-neutral-700 dark:text-[#c4c7ca] font-mono text-[10px] flex items-center gap-1 max-w-[150px] truncate">
                              <MapPin size={10} />
                              {s.location}
                            </span>
                          )}
                          <span className="text-neutral-500 dark:text-[#8e9192] font-mono text-[11px]">
                            {days === 0 ? t('dashboard.today') : `${days} ${t('dashboard.daysLeft')}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded bg-transparent group-hover:bg-neutral-200/60 dark:group-hover:bg-white/[0.06] flex items-center justify-center text-neutral-400 dark:text-[#8e9192] group-hover:text-neutral-900 dark:group-hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-neutral-400 dark:text-[#8e9192]">
                <CalendarCheck size={22} />
              </div>
              <p className="text-sm text-neutral-500 dark:text-[#8e9192]">{t('dashboard.noSessions')}</p>
              <Link
                to="/app/sessions"
                className="inline-flex items-center gap-1 font-mono text-xs text-neutral-900 dark:text-white mt-2 hover:underline"
              >
                <span>{t('dashboard.createFirstSession')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Kolom Kanan (40%): Active Role Quick-Settings */}
        <div className="lg:col-span-5 bg-white dark:bg-[#13161B] border border-neutral-200 dark:border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-neutral-900 dark:text-white" />
                <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">{t('dashboard.quickInstrument')}</h3>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-[#8e9192] uppercase">{t('dashboard.liveFilter')}</span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-[#8e9192] mb-3">
              {t('dashboard.switchInstrumentDesc')}
            </p>

            {/* Role Switcher Grid */}
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((item) => {
                const Icon = item.icon
                const active = role === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`
                      flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all text-xs font-medium cursor-pointer
                      ${
                        active
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-[#08090A] border-neutral-900 dark:border-white font-semibold shadow-sm'
                          : 'bg-neutral-50 dark:bg-[#191c21] border-neutral-200 dark:border-white/[0.06] text-neutral-700 dark:text-[#c4c7ca] hover:text-neutral-950 dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/[0.15]'
                      }
                    `}
                  >
                    <Icon size={15} className={active ? 'text-white dark:text-[#08090A]' : 'text-neutral-400 dark:text-[#8e9192]'} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Metrics of Song Sections */}
          <div className="pt-4 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50/80 dark:bg-white/[0.02] rounded-lg p-3.5 border border-neutral-200 dark:border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-neutral-700 dark:text-[#c4c7ca] flex items-center gap-1.5">
                <Layers size={13} className="text-neutral-500 dark:text-[#8e9192]" />
                {t('dashboard.songReadiness')}
              </span>
              <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                {songs.length > 0 ? Math.round((songsWithSections / songs.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-[#272a2f] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 dark:bg-white h-full transition-all duration-500"
                style={{
                  width: `${songs.length > 0 ? (songsWithSections / songs.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-neutral-500 dark:text-[#8e9192] mt-2">
              <span>{songsWithSections} {t('dashboard.songsHaveSections')}</span>
              <span>{songsWithRoleNotes} {t('dashboard.songsHaveNotes')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
