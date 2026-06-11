import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fade-in bg-neutral-50 dark:bg-[#0a0a0a]">
      <div className="w-24 h-24 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-inner">
        <SearchX size={48} className="text-neutral-400 dark:text-neutral-500" />
      </div>
      <h1 className="text-6xl sm:text-7xl font-display text-neutral-300 dark:text-neutral-700 mb-3">404</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-lg">Halaman tidak ditemukan</p>
      <div className="flex gap-3">
        <Link to="/"><Button icon={Home}>Ke Beranda</Button></Link>
        <Link to="/app"><Button variant="outline" icon={Home}>Dashboard</Button></Link>
      </div>
    </div>
  )
}
