import { create } from 'zustand'
import { supabase } from '../services/supabase'
import * as db from '../services/db'
import useAuthStore from './authStore'

export const ROLE_OPTIONS = ['guitar', 'bass', 'keyboard', 'drums', 'vocal']

// ponytail: maps snake_case from Postgres to camelCase used by UI
function mapUser(data) {
  if (!data) return null
  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name || null,
    instrumentRole: data.instrument_role || null,
    onboardingDone: data.onboarding_done || false,
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      const profile = mapUser(data)
      if (profile) {
        set({ role: profile.instrumentRole, loading: false, initialized: true })
        if (!profile.instrumentRole && !profile.onboardingDone) {
          set({ showOnboarding: true })
        }
      } else {
        await db.setItem('users', user.uid, { instrument_role: null, email: user.email, onboarding_done: false })
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
      const { error } = await supabase
        .from('users')
        .update({ instrument_role: newRole, onboarding_done: true })
        .eq('id', user.uid)
      if (error) throw error
    } catch (e) {
      console.error('Failed to save role:', e)
    }
  },

  skipOnboarding: () => {
    set({ showOnboarding: false })
  },
}))

export default useRoleStore
