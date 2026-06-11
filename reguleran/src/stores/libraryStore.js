import { create } from 'zustand'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDB, isConfigured } from '../services/firebase'

const useLibraryStore = create((set) => ({
  publicSongs: [],
  loading: false,
  error: null,

  subscribe: () => {
    if (!isConfigured()) return () => {}

    const db = getFirestoreDB()
    if (!db) return () => {}

    set({ loading: true })
    const q = query(
      collection(db, 'publicSongs'),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const publicSongs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        set({ publicSongs, loading: false })
      },
      (error) => set({ error: error.message, loading: false })
    )
  },
}))

export default useLibraryStore
