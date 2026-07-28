import { create } from 'zustand'
import type { Setlist } from '../types'

interface SetlistStore {
  setlists: Setlist[]
  selectedSetlist: Setlist | null
  loading: boolean
  error: string | null
  setSetlists: (setlists: Setlist[]) => void
  setSelectedSetlist: (setlist: Setlist | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  addSetlist: (setlist: Setlist) => void
  updateSetlist: (id: string, data: Partial<Setlist>) => void
  removeSetlist: (id: string) => void
}

export const useSetlistStore = create<SetlistStore>((set) => ({
  setlists: [],
  selectedSetlist: null,
  loading: false,
  error: null,
  setSetlists: (setlists) => set({ setlists }),
  setSelectedSetlist: (setlist) => set({ selectedSetlist: setlist }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addSetlist: (setlist) => set((s) => ({ setlists: [setlist, ...s.setlists] })),
  updateSetlist: (id, data) =>
    set((s) => ({
      setlists: s.setlists.map((sl) => (sl.id === id ? { ...sl, ...data } : sl)),
    })),
  removeSetlist: (id) =>
    set((s) => ({ setlists: s.setlists.filter((sl) => sl.id !== id) })),
}))
