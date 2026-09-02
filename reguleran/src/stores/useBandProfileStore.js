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
    return db.subscribe('bandProfiles', (items) => {
      const profile = items.find((p) => p.userId === user.uid) || null
      set({ profile, loading: false })
    })
  },

  upsertProfile: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    const existing = useBandProfileStore.getState().profile
    if (existing) {
      await db.updateItem('bandProfiles', existing.id, data)
    } else {
      await db.addItem('bandProfiles', { ...data, userId: user.uid })
    }
  },

  deleteProfile: async () => {
    const existing = useBandProfileStore.getState().profile
    if (!existing) return
    await db.deleteItem('bandProfiles', existing.id)
    set({ profile: null })
  },
}))

export default useBandProfileStore
