import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
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
  Home,
  ChevronDown,
} from 'lucide-react'

// Core items shown inline in the top bar. Longer list collapses into the "Menu" dropdown so
// the bar never overflows / shifts as features grow.
const primaryItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/songs', icon: Music, label: 'Lagu' },
  { to: '/app/setlists', icon: ListMusic, label: 'Setlist' },
  { to: '/app/sessions', icon: CalendarCheck, label: 'Sesi' },
  { to: '/app/proposals', icon: FileText, label: 'Proposal' },
]

const secondaryItems = [
  { to: '/app/band-profile', icon: Users, label: 'Band Profil' },
  { to: '/app/pitchlist', icon: SlidersHorizontal, label: 'Pitchlist' },
  { to: '/app/library', icon: Globe, label: 'Library' },
  { to: '/app/schedule', icon: CalendarDays, label: 'Jadwal' },
]

const ROLE_LABELS = {
  guitar: 'Gitaris',
  bass: 'Bassist',
  keyboard: 'Keyboardist',
  drums: 'Drummer',
  vocal: 'Vokalis',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuthStore()
  const { role } = useRoleStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isActive = (to) => {
    if (to === '/app') return pathname === '/app'
    return pathname.startsWith(to)
  }

  const anySecondaryActive = secondaryItems.some((item) => isActive(item.to))

  return (
    <>
      <nav className="hidden md:block glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 min-w-0">
              <Link to="/app" className="flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg">
                  <Music size={16} className="text-white dark:text-neutral-900" strokeWidth={2.5} />
                </div>
                <span className="font-display text-lg tracking-wide text-neutral-900 dark:text-white">
                  Reguleran
                </span>
              </Link>

              <div className="flex items-center gap-1 overflow-hidden">
                {primaryItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                      transition-all duration-200
                      ${isActive(item.to)
                        ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <item.icon size={17} strokeWidth={isActive(item.to) ? 2.5 : 2} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                ))}

                {/* "Menu" dropdown for remaining features — keeps bar from overflowing as features grow */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                      transition-all duration-200
                      ${anySecondaryActive
                        ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                      }
                    `}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <Menu size={17} strokeWidth={anySecondaryActive ? 2.5 : 2} />
                    <span className="hidden lg:inline">Menu</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {menuOpen && (
                    <div className="absolute left-0 top-full mt-2 min-w-[220px] rounded-2xl glass-strong shadow-2xl border border-neutral-200 dark:border-neutral-800 py-2 z-50">
                      {secondaryItems.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150
                            ${isActive(item.to)
                              ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                            }
                          `}
                        >
                          <item.icon size={16} strokeWidth={isActive(item.to) ? 2.5 : 2} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/"
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-all duration-200"
                aria-label="Beranda"
              >
                <Home size={18} />
              </Link>

              <button
                onClick={toggle}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user && (
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-neutral-200 dark:border-neutral-700">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden lg:block max-w-[140px] truncate">
                    {user.email}
                  </span>
                  {role && (
                    <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                      {ROLE_LABELS[role] || role}
                    </span>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span className="hidden lg:inline">Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur-lg safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          <Link
            to="/app"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
              isActive('/app') || pathname === '/' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <LayoutDashboard size={20} strokeWidth={isActive('/app') || pathname === '/' ? 2.5 : 2} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/app/songs"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
              isActive('/app/songs') ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <Music size={20} strokeWidth={isActive('/app/songs') ? 2.5 : 2} />
            <span>Lagu</span>
          </Link>
          <Link
            to="/app/setlists"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
              isActive('/app/setlists') ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <ListMusic size={20} strokeWidth={isActive('/app/setlists') ? 2.5 : 2} />
            <span>Setlist</span>
          </Link>
          <Link
            to="/app/sessions"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
              isActive('/app/sessions') ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <CalendarCheck size={20} strokeWidth={isActive('/app/sessions') ? 2.5 : 2} />
            <span>Sesi</span>
          </Link>
          {/* "Menu" — remaining features of the PWA in one tap, no overflow */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
                [primaryItems[4], ...secondaryItems].some(i => isActive(i.to))
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Menu size={20} strokeWidth={2} />
              <span>Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[220px] rounded-2xl glass-strong shadow-2xl border border-neutral-200 dark:border-neutral-800 py-2 z-50">
                {[primaryItems[4], ...secondaryItems].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150
                      ${isActive(item.to)
                        ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <item.icon size={16} strokeWidth={isActive(item.to) ? 2.5 : 2} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  )
}