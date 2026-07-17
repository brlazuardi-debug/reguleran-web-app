import { create } from 'zustand'
import * as db from '../services/db'

const useLibraryStore = create((set) => ({
  publicSongs: [],
  loading: false,
  error: null,

  subscribe: () => {
    set({ loading: true })
    return db.subscribe('publicSongs', (items) => {
      const publicSongs = items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ publicSongs, loading: false })
    })
  },
}))

export default useLibraryStore
