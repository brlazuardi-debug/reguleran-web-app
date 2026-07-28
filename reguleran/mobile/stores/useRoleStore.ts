import { create } from 'zustand'
import type { InstrumentRole } from '../types'

interface RoleStore {
  role: InstrumentRole | null
  loading: boolean
  initialized: boolean
  setRole: (role: InstrumentRole | null) => void
  setLoading: (v: boolean) => void
  setInitialized: (v: boolean) => void
}

export const ROLE_OPTIONS: InstrumentRole[] = [
  'guitar', 'bass', 'keyboard', 'drums', 'vocal',
]

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  loading: false,
  initialized: false,
  setRole: (role) => set({ role, initialized: true }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}))
