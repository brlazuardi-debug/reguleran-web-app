import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-6">
        <SearchX size={40} className="text-stone-400 dark:text-stone-500" />
      </div>
      <h1 className="text-5xl font-bold text-stone-300 dark:text-stone-600 mb-2">404</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">
        Halaman tidak ditemukan
      </p>
      <Link to="/">
        <Button icon={Home}>Kembali ke Dashboard</Button>
      </Link>
    </div>
  )
}
