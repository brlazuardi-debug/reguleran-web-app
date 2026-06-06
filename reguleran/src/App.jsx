import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './stores/authStore'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Songs from './pages/Songs'
import SongDetail from './pages/SongDetail'
import Setlists from './pages/Setlists'
import SetlistDetail from './pages/SetlistDetail'
import Sessions from './pages/Sessions'
import SessionDetail from './pages/SessionDetail'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
      <Route element={<Layout />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="songs" element={<ProtectedRoute><Songs /></ProtectedRoute>} />
        <Route path="songs/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
        <Route path="setlists" element={<ProtectedRoute><Setlists /></ProtectedRoute>} />
        <Route path="setlists/:id" element={<ProtectedRoute><SetlistDetail /></ProtectedRoute>} />
        <Route path="sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="sessions/:id" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
        <Route path="schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
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
      <AppContent />
    </BrowserRouter>
  )
}
