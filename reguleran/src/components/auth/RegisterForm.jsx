import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Music, ArrowRight } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (password !== confirm) {
      setLocalError('Password tidak cocok')
      return
    }
    if (password.length < 6) {
      setLocalError('Password minimal 6 karakter')
      return
    }
    setSubmitting(true)
    try {
      await register(email, password)
      navigate('/app')
    } catch {
      // error handled by store
    } finally {
      setSubmitting(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-[#0a0a0a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-500/5 blur-[100px] dark:bg-neutral-500/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neutral-500/5 blur-[80px] dark:bg-neutral-500/8" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg">
              <Music size={24} className="text-white dark:text-neutral-900" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-2xl font-display text-neutral-900 dark:text-white">Daftar</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            Buat akun baru Reguleran
          </p>
        </div>

        <Card variant="glass" className="space-y-5">
          {displayError && (
            <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-3 rounded-xl text-sm border border-neutral-200 dark:border-neutral-700">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 6 karakter"
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              icon={Lock}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Ulangi password"
            />
            <Button type="submit" fullWidth loading={submitting} variant="gradient">
              Daftar Gratis
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400 dark:text-neutral-500">atau</span>
            </div>
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200"
          >
            <span>Sudah punya akun? Masuk</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-6">
          <Link to="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  )
}
