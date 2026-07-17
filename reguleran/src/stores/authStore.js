import { create } from 'zustand'
import * as auth from '../services/auth'
import * as db from '../services/db'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  init: () => {
    const unsub = auth.onAuthChange((user) => {
      set({ user, loading: false })
    })
    return unsub
  },

  login: async (email, password) => {
    set({ error: null })
    try {
      const user = await auth.login(email, password)
      set({ user })
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  register: async (email, password, displayName) => {
    set({ error: null })
    try {
      const user = await auth.register(email, password, displayName)
      if (user) {
        await db.setItem('users', user.uid, { instrumentRole: null, email, displayName, createdAt: new Date().toISOString() })
        set({ user })
      }
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  googleLogin: async () => {
    set({ error: null })
    try {
      await auth.googleLogin()
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  logout: async () => {
    await auth.logout()
    set({ user: null })
  },
}))

export default useAuthStore
