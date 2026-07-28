import { create } from 'zustand'
import type { BandProfile } from '../types'

interface BandProfileStore {
  profile: BandProfile | null
  loading: boolean
  error: string | null
  setProfile: (profile: BandProfile | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useBandProfileStore = create<BandProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
