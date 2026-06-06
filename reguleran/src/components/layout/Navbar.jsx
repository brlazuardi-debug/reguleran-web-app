import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import useAuthStore from '../../stores/authStore'
import {
  LayoutDashboard,
  Music,
  ListMusic,
  CalendarCheck,
  CalendarDays,
  Guitar,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/songs', icon: Music, label: 'Lagu' },
  { to: '/setlists', icon: ListMusic, label: 'Setlist' },
  { to: '/sessions', icon: CalendarCheck, label: 'Sesi' },
  { to: '/schedule', icon: CalendarDays, label: 'Jadwal' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuthStore()

  const isActive = (to) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-primary-600 dark:text-primary-400">
              <Guitar size={24} strokeWidth={2.5} />
              Reguleran
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
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                    }
                  `}
                >
                  <item.icon size={17} strokeWidth={isActive(item.to) ? 2.5 : 2} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user && (
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-stone-500 dark:text-stone-400 hidden lg:block">
                    {user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:text-stone-400 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 transition-all duration-200"
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 backdrop-blur-lg safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium
                transition-all duration-200 min-w-0
                ${isActive(item.to)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-stone-400 dark:text-stone-500'
                }
              `}
            >
              <item.icon size={20} strokeWidth={isActive(item.to) ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile spacer to prevent content hiding behind bottom nav */}
      <div className="md:hidden h-16" />
    </>
  )
}
