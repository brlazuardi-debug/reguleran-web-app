import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Music, ArrowRight, LogIn, RefreshCw } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const { login, googleLogin, error } = useAuthStore()
  const navigate = useNavigate()

  const isNetworkError = (error || localError)?.toLowerCase().includes('koneksi')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!EMAIL_RE.test(email)) {
      setLocalError('Format email tidak valid')
      return
    }
    if (password.length < 8) {
      setLocalError('Password minimal 8 karakter')
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/app')
    } catch {
      // error handled by store
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleSubmitting(true)
    try {
      await googleLogin()
      navigate('/app')
    } catch {
      // error handled by store
    } finally {
      setGoogleSubmitting(false)
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
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity duration-200">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg cursor-pointer">
              <Music size={24} className="text-white dark:text-neutral-900" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-2xl font-display text-neutral-900 dark:text-white">Masuk</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            Selamat datang kembali di Reguleran
          </p>
        </div>

        <Card variant="glass" className="space-y-5">
          {displayError && (
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-3 rounded-xl text-sm border border-neutral-200 dark:border-neutral-700">
              <span className="flex-1">{displayError}</span>
              {isNetworkError && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-150 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  Coba Lagi
                </button>
              )}
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
              autoComplete="email"
              placeholder="email@example.com"
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Minimal 8 karakter"
            />
            <Button type="submit" fullWidth loading={submitting}>
              Masuk
            </Button>
          </form>

          <Button
            type="button"
            fullWidth
            variant="secondary"
            icon={LogIn}
            onClick={handleGoogle}
            loading={googleSubmitting}
          >
            Masuk dengan Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400 dark:text-neutral-500">atau</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
          >
            <span>Buat akun baru</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-6">
          <Link to="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150 cursor-pointer">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  )
}
