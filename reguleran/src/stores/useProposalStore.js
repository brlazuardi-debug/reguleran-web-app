import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'

const useProposalStore = create((set) => ({
  proposals: [],
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('proposals', (items) => {
      const proposals = items
        .filter((p) => p.userId === user.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ proposals, loading: false })
    })
  },

  addProposal: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    return await db.addItem('proposals', { ...data, userId: user.uid })
  },

  updateProposal: async (id, data) => {
    await db.updateItem('proposals', id, data)
  },

  deleteProposal: async (id) => {
    await db.deleteItem('proposals', id)
  },

  getProposalById: (id) => {
    const proposals = useProposalStore.getState().proposals
    return proposals.find((p) => p.id === id) || null
  },
}))

export default useProposalStore
