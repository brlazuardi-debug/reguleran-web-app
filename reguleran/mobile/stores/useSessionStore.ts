import { create } from 'zustand'
import type { Session } from '../types'

interface SessionStore {
  sessions: Session[]
  selectedSession: Session | null
  loading: boolean
  error: string | null
  setSessions: (sessions: Session[]) => void
  setSelectedSession: (session: Session | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  addSession: (session: Session) => void
  updateSession: (id: string, data: Partial<Session>) => void
  removeSession: (id: string) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
  setSessions: (sessions) => set({ sessions }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addSession: (session) => set((s) => ({ sessions: [session, ...s.sessions] })),
  updateSession: (id, data) =>
    set((s) => ({
      sessions: s.sessions.map((ses) => (ses.id === id ? { ...ses, ...data } : ses)),
    })),
  removeSession: (id) =>
    set((s) => ({ sessions: s.sessions.filter((ses) => ses.id !== id) })),
}))
