import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'

const useBandProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('band-profiles', (items) => {
      const profile = items.find((p) => p.userId === user.uid) || null
      set({ profile, loading: false })
    })
  },

  upsertProfile: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    const existing = useBandProfileStore.getState().profile
    if (existing) {
      await db.updateItem('band-profiles', existing.id, data)
    } else {
      await db.addItem('band-profiles', { ...data, userId: user.uid })
    }
  },

  deleteProfile: async () => {
    const existing = useBandProfileStore.getState().profile
    if (!existing) return
    await db.deleteItem('band-profiles', existing.id)
    set({ profile: null })
  },
}))

export default useBandProfileStore
