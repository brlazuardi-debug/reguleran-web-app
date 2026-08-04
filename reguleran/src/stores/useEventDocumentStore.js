import { create } from 'zustand'
import * as db from '../services/db'
import useAuthStore from './authStore'

const useEventDocumentStore = create((set) => ({
  documents: [],
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('eventDocuments', (items) => {
      const documents = items
        .filter((d) => d.userId === user.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ documents, loading: false })
    })
  },

  getBySession: (sessionId) => {
    const documents = useEventDocumentStore.getState().documents
    return documents.find((d) => d.sessionId === sessionId) || null
  },

  upsertDocument: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    const existing = useEventDocumentStore.getState().getBySession(data.sessionId)
    if (existing) {
      await db.updateItem('eventDocuments', existing.id, data)
      return existing.id
    } else {
      return await db.addItem('eventDocuments', { ...data, userId: user.uid })
    }
  },

  deleteDocument: async (id) => {
    await db.deleteItem('eventDocuments', id)
  },
}))

export default useEventDocumentStore
