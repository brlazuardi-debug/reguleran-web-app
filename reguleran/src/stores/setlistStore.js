import { create } from 'zustand'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { getFirestoreDB, isConfigured } from '../services/firebase'
import useAuthStore from './authStore'

const useSetlistStore = create((set) => ({
  setlists: [],
  loading: false,
  error: null,

  subscribe: () => {
    if (!isConfigured()) return () => {}
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    const db = getFirestoreDB()
    if (!db) return () => {}

    set({ loading: true })
    const q = query(
      collection(db, 'setlists'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const setlists = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        set({ setlists, loading: false })
      },
      (error) => set({ error: error.message, loading: false })
    )
  },

  addSetlist: async (data) => {
    const user = useAuthStore.getState().user
    const db = getFirestoreDB()
    if (!user || !db) throw new Error('Not available')
    const docRef = await addDoc(collection(db, 'setlists'), {
      ...data,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  },

  updateSetlist: async (id, data) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await updateDoc(doc(db, 'setlists', id), data)
  },

  deleteSetlist: async (id) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await deleteDoc(doc(db, 'setlists', id))
  },

  getSetlistById: (id) => {
    const setlists = useSetlistStore.getState().setlists
    return setlists.find((s) => s.id === id) || null
  },
}))

export default useSetlistStore
