import { create } from 'zustand'
import type { EventDocument } from '../types'

interface EventDocumentStore {
  documents: EventDocument[]
  selectedDocument: EventDocument | null
  loading: boolean
  error: string | null
  setDocuments: (docs: EventDocument[]) => void
  setSelectedDocument: (doc: EventDocument | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useEventDocumentStore = create<EventDocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
  setDocuments: (documents) => set({ documents }),
  setSelectedDocument: (document) => set({ selectedDocument: document }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
