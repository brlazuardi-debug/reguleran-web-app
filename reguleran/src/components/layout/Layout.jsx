import { Outlet } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Navbar from './Navbar'

export default function Layout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-light dark:bg-grid opacity-40" />
      </div>

      <Navbar />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      <button
        onClick={toggle}
        className="md:hidden fixed bottom-24 right-4 z-50 p-3 rounded-full bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-90"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun size={18} className="text-neutral-400" />
        ) : (
          <Moon size={18} className="text-neutral-600" />
        )}
      </button>
    </div>
  )
}
