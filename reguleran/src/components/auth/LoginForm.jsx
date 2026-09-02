import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Music, ArrowRight, LogIn, Sparkles } from 'lucide-react'
import { useSignIn, useAuth, useClerk } from '@clerk/react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const { signIn } = useSignIn()
  const { isLoaded, isSignedIn } = useAuth()
  const clerk = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate('/app', { replace: true })
  }, [isLoaded, isSignedIn, navigate])

  if (!signIn) return null

  const handleDemoLogin = async () => {
    setError('')
    setDemoLoading(true)
    try {
      await signIn.create({ identifier: 'demo@reguleran.app', password: 'Reguleran2026!' })
      if (signIn.status === 'complete') {
        await clerk.setActive({ session: signIn.createdSessionId })
        navigate('/app')
      } else {
        setError('Verifikasi diperlukan')
      }
    } catch (err) {
      const msg = err.errors?.[0]?.message || err.message || 'Terjadi kesalahan login demo'
      setError(msg)
    } finally {
      setDemoLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) { setError('Format email tidak valid'); return }
    if (password.length < 8) { setError('Password minimal 8 karakter'); return }

    setSubmitting(true)
    try {
      await signIn.create({ identifier: email, password })
      if (signIn.status === 'complete') {
        await clerk.setActive({ session: signIn.createdSessionId })
        navigate('/app')
      } else {
        setError('Verifikasi diperlukan')
      }
    } catch (err) {
      const msg = err.errors?.[0]?.message || err.message || 'Terjadi kesalahan'
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('password')) {
        setError('Email atau password salah')
      } else if (msg.toLowerCase().includes('not found')) {
        setError('Akun tidak ditemukan')
      } else if (msg.toLowerCase().includes('rate limit')) {
        setError('Terlalu banyak percobaan. Coba beberapa saat lagi.')
      } else {
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/oauth-callback',
      redirectUrlComplete: '/app',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-[#08090A]">
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
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">Selamat datang kembali di Reguleran</p>
        </div>

        <Card variant="glass" className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm border border-red-500/20 font-mono">
              {error}
            </div>
          )}

          {/* Quick Demo Login Button */}
          <div className="p-3 bg-white/[0.04] border border-white/[0.10] rounded-lg text-center space-y-2">
            <div className="flex items-center justify-between text-xs text-[#c4c7ca] font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-white" />
                Demo Testing
              </span>
              <span className="text-[10px] uppercase text-[#8e9192]">Admin Access</span>
            </div>
            <Button
              type="button"
              variant="primary"
              fullWidth
              loading={demoLoading}
              onClick={handleDemoLogin}
              className="text-xs py-2"
            >
              1-Klik Masuk sebagai Demo Admin
            </Button>
            <p className="font-mono text-[10px] text-[#8e9192]">demo@reguleran.app / Reguleran2026!</p>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#13161B] px-2 text-[#8e9192] font-mono text-[11px]">atau login manual</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="email@example.com" />
            <Input label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Minimal 8 karakter" />
            <Button type="submit" fullWidth loading={submitting}>Masuk</Button>
          </form>

          <Button type="button" fullWidth variant="secondary" icon={LogIn} onClick={handleGoogle}>Masuk dengan Google</Button>

          <div className="relative pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#13161B] px-2 text-[#8e9192] font-mono text-[11px]">belum punya akun?</span>
            </div>
          </div>

          <Link to="/register" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-white/[0.12] text-sm font-medium text-white hover:bg-white/[0.05] transition-all duration-200">
            <span>Buat akun baru</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        <p className="text-center text-xs text-neutral-400 dark:text-[#8e9192] mt-6">
          <Link to="/" className="hover:text-white transition-colors duration-150">Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  )
}
