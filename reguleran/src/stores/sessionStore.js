import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'
import { scheduleSessionReminder } from '../services/notification'

const useSessionStore = create((set, get) => ({
  sessions: [],
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('sessions', (items) => {
      const sessions = items
        .filter((s) => s.userId === user.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ sessions, loading: false })
      sessions.forEach((s) => {
        if (s.active !== false) scheduleSessionReminder(s)
      })
    })
  },

  addSession: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    return await db.addItem('sessions', { ...data, userId: user.uid, createdAt: new Date().toISOString() })
  },

  updateSession: async (id, data) => {
    await db.updateItem('sessions', id, data)
  },

  deleteSession: async (id) => {
    await db.deleteItem('sessions', id)
  },

  getUpcoming: () => {
    const sessions = get().sessions
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const today = new Date().getDay()

    return sessions
      .filter((s) => s.active !== false)
      .map((s) => {
        const dayNum = dayNames.indexOf(s.day)
        let daysUntil = dayNum - today
        if (daysUntil < 0) daysUntil += 7
        return { ...s, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
  },
}))

export default useSessionStore
