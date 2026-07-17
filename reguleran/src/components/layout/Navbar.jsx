import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import useAuthStore from '../../stores/authStore'
import useRoleStore from '../../stores/roleStore'
import {
  LayoutDashboard,
  Music,
  ListMusic,
  CalendarCheck,
  CalendarDays,
  SlidersHorizontal,
  Globe,
  Sun,
  Moon,
  LogOut,
  Home,
} from 'lucide-react'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/songs', icon: Music, label: 'Lagu' },
  { to: '/app/setlists', icon: ListMusic, label: 'Setlist' },
  { to: '/app/sessions', icon: CalendarCheck, label: 'Sesi' },
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

  const isActive = (to) => {
    if (to === '/app') return pathname === '/app'
    return pathname.startsWith(to)
  }

  return (
    <>
      <nav className="hidden md:block glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/app" className="flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg">
                  <Music size={16} className="text-white dark:text-neutral-900" strokeWidth={2.5} />
                </div>
                <span className="font-display text-lg tracking-wide text-neutral-900 dark:text-white">
                  Reguleran
                </span>
              </Link>

              <div className="flex items-center gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive(item.to)
                        ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <item.icon size={17} strokeWidth={isActive(item.to) ? 2.5 : 2} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
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
            to="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-0 ${
              pathname === '/' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <Home size={20} strokeWidth={pathname === '/' ? 2.5 : 2} />
            <span>Beranda</span>
          </Link>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium
                transition-all duration-200 min-w-0
                ${isActive(item.to)
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-500'
                }
              `}
            >
              <item.icon size={20} strokeWidth={isActive(item.to) ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  )
}
