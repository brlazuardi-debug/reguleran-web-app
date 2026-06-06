import { Outlet } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Navbar from './Navbar'

export default function Layout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-stone-950 transition-colors duration-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Mobile dark mode toggle */}
      <button
        onClick={toggle}
        className="md:hidden fixed bottom-20 right-4 z-50 p-3 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-90"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun size={18} className="text-amber-500" />
        ) : (
          <Moon size={18} className="text-primary-600" />
        )}
      </button>
    </div>
  )
}
