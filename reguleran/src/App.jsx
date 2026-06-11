import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import useAuthStore from './stores/authStore'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Songs from './pages/Songs'
import SongDetail from './pages/SongDetail'
import Setlists from './pages/Setlists'
import SetlistDetail from './pages/SetlistDetail'
import Sessions from './pages/Sessions'
import SessionDetail from './pages/SessionDetail'
import Pitchlist from './pages/Pitchlist'
import Library from './pages/Library'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1
})

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
      <Route element={<Layout />}>
        <Route path="app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="app/songs" element={<ProtectedRoute><Songs /></ProtectedRoute>} />
        <Route path="app/songs/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
        <Route path="app/setlists" element={<ProtectedRoute><Setlists /></ProtectedRoute>} />
        <Route path="app/setlists/:id" element={<ProtectedRoute><SetlistDetail /></ProtectedRoute>} />
        <Route path="app/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="app/sessions/:id" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
        <Route path="app/pitchlist" element={<ProtectedRoute><Pitchlist /></ProtectedRoute>} />
        <Route path="app/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="app/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function AppWithErrorBoundary() {
  return (
    <Sentry.ErrorBoundary fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-display mb-2">Oops! Terjadi Error</h1>
        <p className="text-white/60">Silakan refresh halaman atau hubungi support.</p>
      </div>
    </div>}>
      <AppContent />
    </Sentry.ErrorBoundary>
  )
}

export default function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    const unsub = init()
    return () => unsub?.()
  }, [init])

  return (
    <BrowserRouter>
      <AppWithErrorBoundary />
    </BrowserRouter>
  )
}
