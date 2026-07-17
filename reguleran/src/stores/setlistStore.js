import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'

const useSetlistStore = create((set) => ({
  setlists: [],
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('setlists', (items) => {
      const setlists = items
        .filter((s) => s.userId === user.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ setlists, loading: false })
    })
  },

  addSetlist: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    return await db.addItem('setlists', { ...data, userId: user.uid, createdAt: new Date().toISOString() })
  },

  updateSetlist: async (id, data) => {
    await db.updateItem('setlists', id, data)
  },

  deleteSetlist: async (id) => {
    await db.deleteItem('setlists', id)
  },

  getSetlistById: (id) => {
    const setlists = useSetlistStore.getState().setlists
    return setlists.find((s) => s.id === id) || null
  },
}))

export default useSetlistStore
