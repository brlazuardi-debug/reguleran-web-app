import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useTranslation } from '../../i18n/useTranslation'
import useAuthStore from '../../stores/authStore'
import useRoleStore from '../../stores/roleStore'
import {
  LayoutDashboard,
  Music,
  ListMusic,
  CalendarCheck,
  FileText,
  Users,
  SlidersHorizontal,
  Globe,
  CalendarDays,
  Menu,
  Sun,
  Moon,
  LogOut,
  Plus,
  Settings,
  AudioLines,
  X,
  Languages,
} from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const { t, language, toggleLanguage } = useTranslation()
  const { user, logout } = useAuthStore()
  const { role } = useRoleStore()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const drawerRef = useRef(null)

  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/app/songs', icon: Music, label: t('nav.songs') },
    { to: '/app/setlists', icon: ListMusic, label: t('nav.setlists') },
    { to: '/app/sessions', icon: CalendarCheck, label: t('nav.sessions') },
    { to: '/app/proposals', icon: FileText, label: t('nav.proposals') },
    { to: '/app/band-profile', icon: Users, label: t('nav.bandProfile') },
    { to: '/app/pitchlist', icon: SlidersHorizontal, label: t('nav.pitchlist') },
    { to: '/app/library', icon: Globe, label: t('nav.library') },
    { to: '/app/schedule', icon: CalendarDays, label: t('nav.schedule') },
  ]

  const ROLE_LABELS = {
    guitar: t('roles.guitar'),
    bass: t('roles.bass'),
    keyboard: t('roles.keyboard'),
    drums: t('roles.drums'),
    vocal: t('roles.vocal'),
  }

  useEffect(() => {
    function onClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileDrawerOpen(false)
      }
    }
    if (mobileDrawerOpen) {
      document.addEventListener('mousedown', onClick)
    }
    return () => document.removeEventListener('mousedown', onClick)
  }, [mobileDrawerOpen])

  const isActive = (to) => {
    if (to === '/app') return pathname === '/app'
    return pathname.startsWith(to)
  }

  const currentTitle = () => {
    const item = navItems.find((i) => isActive(i.to))
    if (pathname.includes('/rider')) return 'Rider & RAB'
    if (pathname.includes('/settings')) return t('nav.settings')
    return item ? item.label : t('nav.dashboard')
  }

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP FIXED SIDEBAR (256px / w-64)                     */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#08090A] flex-col z-40 transition-colors duration-200">
        {/* Monogram Brand Header */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-neutral-200 dark:border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-[#272a2f] flex items-center justify-center border border-neutral-800 dark:border-white/[0.20] shadow-sm shrink-0">
            <AudioLines size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-neutral-900 dark:text-white tracking-tight leading-none">
              Reguleran
            </h1>
            <p className="font-mono text-[11px] text-neutral-500 dark:text-[#8e9192] mt-1">Live Band OS</p>
          </div>
        </div>

        {/* Quick Action Button: New Session */}
        <div className="p-4 pb-2">
          <Link
            to="/app/sessions"
            className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:active:bg-neutral-300 dark:text-[#08090A] rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>{t('nav.newSession')}</span>
          </Link>
        </div>

        {/* Main Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-custom">
          {navItems.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    active
                      ? 'text-neutral-950 dark:text-white font-semibold bg-neutral-100 dark:bg-white/[0.08] border-r-2 border-neutral-900 dark:border-white'
                      : 'text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 2} className={active ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-[#8e9192]'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Navigation (Settings & User Profile) */}
        <div className="p-3 border-t border-neutral-200 dark:border-white/[0.08] space-y-1 bg-white dark:bg-[#08090A]">
          <Link
            to="/app/settings"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                isActive('/app/settings')
                  ? 'text-neutral-950 dark:text-white font-semibold bg-neutral-100 dark:bg-white/[0.08]'
                  : 'text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-white/[0.04]'
              }
            `}
          >
            <Settings size={17} className="text-neutral-400 dark:text-[#8e9192]" />
            <span>{t('nav.settings')}</span>
          </Link>

          {user && (
            <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-white/[0.08] flex items-center justify-between px-2">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">{user.displayName || user.email}</p>
                <span className="font-mono text-[10px] uppercase text-neutral-500 dark:text-[#8e9192] tracking-wider">
                  {ROLE_LABELS[role] || role || t('roles.noRole')}
                </span>
              </div>
              <button
                onClick={logout}
                title={t('nav.logout')}
                className="p-1.5 rounded-lg text-neutral-400 dark:text-[#8e9192] hover:text-red-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* DESKTOP TOP COMMAND BAR                                  */}
      {/* ========================================================= */}
      <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-16rem)] h-14 border-b border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#08090A]/85 backdrop-blur-md items-center justify-between px-6 z-30 transition-colors duration-200">
        {/* Breadcrumb Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 dark:text-[#8e9192]">
          <Link to="/app" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
            {t('nav.app')}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium">{currentTitle()}</span>
        </div>

        {/* Status indicator, Language & Theme Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-neutral-500 dark:text-[#8e9192]">
              {t('nav.sessionReady')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-neutral-200 dark:border-white/[0.08] pl-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={`Switch to ${language === 'id' ? 'English' : 'Bahasa Indonesia'}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors border border-neutral-200 dark:border-white/[0.08]"
            >
              <Languages size={14} className="text-neutral-500 dark:text-neutral-400" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE TOP APP BAR                                        */}
      {/* ========================================================= */}
      <header className="md:hidden fixed top-0 left-0 w-full z-40 bg-white/90 dark:bg-[#08090A]/90 backdrop-blur-xl border-b border-neutral-200 dark:border-white/[0.08] h-14 flex items-center justify-between px-4 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 rounded-lg text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-900 dark:bg-[#272a2f] flex items-center justify-center border border-neutral-800 dark:border-white/[0.20]">
              <AudioLines size={14} className="text-white" />
            </div>
            <h1 className="font-display text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {currentTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded text-[11px] font-mono uppercase bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.12] text-neutral-700 dark:text-neutral-200"
          >
            {language}
          </button>
          {role && (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.12] text-neutral-800 dark:text-white">
              {ROLE_LABELS[role] || role}
            </span>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-900 dark:hover:text-white transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE SLIDE-OUT DRAWER                                   */}
      {/* ========================================================= */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" />
          <div
            ref={drawerRef}
            className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-[#08090A] border-r border-neutral-200 dark:border-white/[0.08] flex flex-col p-4 animate-scale-in"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-white/[0.08] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-neutral-900 dark:bg-[#272a2f] flex items-center justify-center border border-neutral-800 dark:border-white/[0.20]">
                  <AudioLines size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-neutral-900 dark:text-white">Reguleran</h2>
                  <p className="font-mono text-[10px] text-neutral-500 dark:text-[#8e9192]">Live Band OS</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-neutral-500 dark:text-[#8e9192] hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.to)
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        active
                          ? 'bg-neutral-100 dark:bg-white/[0.10] text-neutral-950 dark:text-white font-semibold'
                          : 'text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    <Icon size={18} className={active ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-[#8e9192]'} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <Link
                to="/app/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive('/app/settings')
                      ? 'bg-neutral-100 dark:bg-white/[0.10] text-neutral-950 dark:text-white font-semibold'
                      : 'text-neutral-600 dark:text-[#c4c7ca] hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-white/[0.04]'
                  }
                `}
              >
                <Settings size={18} className="text-neutral-400 dark:text-[#8e9192]" />
                <span>{t('nav.settings')}</span>
              </Link>
            </nav>

            {user && (
              <div className="pt-3 border-t border-neutral-200 dark:border-white/[0.08] flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">{user.displayName || user.email}</p>
                  <p className="font-mono text-[10px] text-neutral-500 dark:text-[#8e9192] uppercase">{ROLE_LABELS[role] || role || 'Player'}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false)
                    logout()
                  }}
                  className="p-2 rounded-lg text-neutral-400 dark:text-[#8e9192] hover:text-red-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06]"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE BOTTOM FLOATING DOCK                               */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#08090A]/95 backdrop-blur-2xl border-t border-neutral-200 dark:border-white/[0.08] safe-area-bottom transition-colors duration-200">
        <div className="flex items-center justify-around px-2 py-1.5">
          <Link
            to="/app"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive('/app') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500 dark:text-[#8e9192]'
            }`}
          >
            <LayoutDashboard size={19} strokeWidth={isActive('/app') ? 2.5 : 2} />
            <span className="text-[11px]">{t('nav.dashboard')}</span>
          </Link>
          <Link
            to="/app/songs"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive('/app/songs') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500 dark:text-[#8e9192]'
            }`}
          >
            <Music size={19} strokeWidth={isActive('/app/songs') ? 2.5 : 2} />
            <span className="text-[11px]">{t('nav.songs')}</span>
          </Link>
          <Link
            to="/app/setlists"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive('/app/setlists') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500 dark:text-[#8e9192]'
            }`}
          >
            <ListMusic size={19} strokeWidth={isActive('/app/setlists') ? 2.5 : 2} />
            <span className="text-[11px]">{t('nav.setlists')}</span>
          </Link>
          <Link
            to="/app/sessions"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive('/app/sessions') ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500 dark:text-[#8e9192]'
            }`}
          >
            <CalendarCheck size={19} strokeWidth={isActive('/app/sessions') ? 2.5 : 2} />
            <span className="text-[11px]">{t('nav.sessions')}</span>
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium text-neutral-500 dark:text-[#8e9192]"
          >
            <Menu size={19} />
            <span className="text-[11px]">Menu</span>
          </button>
        </div>
      </nav>
    </>
  )
}
