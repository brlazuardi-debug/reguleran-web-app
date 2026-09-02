import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-[#08090A] dark:text-neutral-200 transition-colors duration-200 antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white/20 dark:selection:text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-15 dark:opacity-30" />
      </div>

      <Navbar />

      {/* Main Canvas Content: Responsive offset for desktop sidebar (ml-64) and mobile header/footer */}
      <main className="relative z-10 md:ml-64 pt-16 md:pt-[4.5rem] pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
