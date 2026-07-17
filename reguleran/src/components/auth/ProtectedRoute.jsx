import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { Spinner } from '../ui/Spinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return <Spinner className="min-h-[60vh]" size="lg" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
