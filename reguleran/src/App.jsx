import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './services/supabase'
import useAuthStore from './stores/authStore'
import useRoleStore from './stores/roleStore'
import RoleOnboardingModal from './components/role/RoleOnboardingModal'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Songs from './pages/Songs'
import SongDetail from './pages/SongDetail'
import SongEditor from './pages/SongEditor'
import NewSong from './pages/NewSong'
import Setlists from './pages/Setlists';
import SetlistDetail from './pages/SetlistDetail'
import SetlistEditor from './pages/SetlistEditor'
import Sessions from './pages/Sessions'
import SessionDetail from './pages/SessionDetail'
import SessionEditor from './pages/SessionEditor'
import Pitchlist from './pages/Pitchlist'
import Library from './pages/Library'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ui/ErrorBoundary'

function AppContent() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="app/songs" element={<ProtectedRoute><Songs /></ProtectedRoute>} />
        <Route path="app/songs/new" element={<ProtectedRoute><NewSong /></ProtectedRoute>} />
        <Route path="app/songs/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
        <Route path="app/songs/:id/edit" element={<ProtectedRoute><SongEditor /></ProtectedRoute>} />
        <Route path="app/setlists" element={<ProtectedRoute><Setlists /></ProtectedRoute>} />
        <Route path="app/setlists/:id" element={<ProtectedRoute><SetlistDetail /></ProtectedRoute>} />
        <Route path="app/setlists/:id/edit" element={<ProtectedRoute><SetlistEditor /></ProtectedRoute>} />
        <Route path="app/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="app/sessions/:id" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
        <Route path="app/sessions/:id/edit" element={<ProtectedRoute><SessionEditor /></ProtectedRoute>} />
        <Route path="app/pitchlist" element={<ProtectedRoute><Pitchlist /></ProtectedRoute>} />
        <Route path="app/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="app/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  )
}

export default function App() {
  const { init, user } = useAuthStore()
  const { fetchRole } = useRoleStore()

  useEffect(() => {
    const unsub = init()
    return () => unsub?.()
  }, [init])

  useEffect(() => {
    if (user) {
      fetchRole()
    }
  }, [user, fetchRole])

  useEffect(() => {
    supabase.from('songs').select('id').limit(1).then(({ error }) => {
      if (error) console.warn('Supabase init:', error.message)
    })
  }, [])

  return (
    <BrowserRouter>
      <RoleOnboardingModal />
      <AppContent />
    </BrowserRouter>
  )
}
