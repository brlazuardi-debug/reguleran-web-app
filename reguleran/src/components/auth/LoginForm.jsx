import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Guitar } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      // error handled by store
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 mb-4">
            <Guitar size={28} className="text-primary-600 dark:text-primary-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Masuk</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Selamat datang kembali di Reguleran
          </p>
        </div>

        <Card className="space-y-5">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm">
              {error}
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
              placeholder="Masukkan password"
            />
            <Button type="submit" fullWidth loading={submitting}>
              Masuk
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Daftar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
