import useAuthStore from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const error = useAuthStore((s) => s.error)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const googleLogin = useAuthStore((s) => s.googleLogin)
  const logout = useAuthStore((s) => s.logout)

  return { user, loading, error, login, register, googleLogin, logout }
}
