import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'

export const ROLE_OPTIONS = ['guitar', 'bass', 'keyboard', 'drums', 'vocal']

function mapUser(data) {
  if (!data) return null
  return {
    id: data.id,
    email: data.email,
    displayName: data.displayName || null,
    instrumentRole: data.instrumentRole || null,
    onboardingDone: data.onboardingDone || false,
  }
}

const useRoleStore = create((set) => ({
  role: null,
  loading: false,
  initialized: false,
  showOnboarding: false,

  fetchRole: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    set({ loading: true })
    try {
      const data = await db.getItem('users', user.uid)
      const profile = mapUser(data)
      if (profile) {
        set({ role: profile.instrumentRole, loading: false, initialized: true })
        if (!profile.instrumentRole && !profile.onboardingDone) {
          set({ showOnboarding: true })
        }
      } else {
        await db.setItem('users', user.uid, { instrumentRole: null, email: user.email, onboardingDone: false })
        set({ role: null, loading: false, initialized: true, showOnboarding: true })
      }
    } catch (e) {
      console.error('fetchRole:', e)
      set({ loading: false, initialized: true })
    }
  },

  setRole: async (newRole) => {
    const user = useAuthStore.getState().user
    if (!user) return
    set({ role: newRole, showOnboarding: false })
    try {
      await db.updateItem('users', user.uid, { instrumentRole: newRole, onboardingDone: true })
    } catch (e) {
      console.error('Failed to save role:', e)
    }
  },

  skipOnboarding: () => {
    set({ showOnboarding: false })
  },
}))

export default useRoleStore
