import { create } from 'zustand'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { getFirestoreDB, isConfigured } from '../services/firebase'
import useAuthStore from './authStore'

const useSongStore = create((set) => ({
  songs: [],
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
      collection(db, 'songs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const songs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        set({ songs, loading: false })
      },
      (error) => set({ error: error.message, loading: false })
    )
  },

  addSong: async (songData) => {
    const user = useAuthStore.getState().user
    const db = getFirestoreDB()
    if (!user || !db) throw new Error('Not available')
    const docRef = await addDoc(collection(db, 'songs'), {
      ...songData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  },

  updateSong: async (id, songData) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await updateDoc(doc(db, 'songs', id), songData)
  },

  deleteSong: async (id) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await deleteDoc(doc(db, 'songs', id))
  },

  getSongById: (id) => {
    const songs = useSongStore.getState().songs
    return songs.find((s) => s.id === id) || null
  },
}))

export default useSongStore
