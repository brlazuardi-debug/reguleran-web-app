import { create } from 'zustand'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore'
import { getFirestoreDB, isConfigured } from '../services/firebase'
import { deleteAudio } from '../services/storage'
import useAuthStore from './authStore'

async function syncPublicSong(db, songId, songData) {
  if (!songData.isPublic) return
  try {
    const pubRef = doc(db, 'publicSongs', songId)
    await updateDoc(pubRef, {
      ...songData,
      originalSongId: songId,
    })
  } catch {
    await addDoc(collection(db, 'publicSongs'), {
      ...songData,
      originalSongId: songId,
    })
  }
}

async function removePublicSong(db, songId) {
  try {
    const q = query(collection(db, 'publicSongs'), where('originalSongId', '==', songId))
    const snapshot = await getDocs(q)
    snapshot.forEach(async (d) => {
      await deleteDoc(doc(db, 'publicSongs', d.id))
    })
  } catch {
    // ignore
  }
}

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
    if (songData.isPublic) {
      await addDoc(collection(db, 'publicSongs'), {
        ...songData,
        originalSongId: docRef.id,
        sharedBy: user.uid,
        sharedByName: user.email,
        createdAt: new Date().toISOString(),
      })
    }
    return docRef.id
  },

  updateSong: async (id, songData) => {
    const user = useAuthStore.getState().user
    const db = getFirestoreDB()
    if (!user || !db) throw new Error('Not available')
    await updateDoc(doc(db, 'songs', id), songData)
    if (songData.isPublic) {
      await syncPublicSong(db, id, {
        ...songData,
        sharedBy: user.uid,
        sharedByName: user.email,
      })
    } else {
      await removePublicSong(db, id)
    }
  },

  deleteSong: async (id) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await deleteDoc(doc(db, 'songs', id))
    await removePublicSong(db, id)
    await deleteAudio(id)
  },

  getSongById: (id) => {
    const songs = useSongStore.getState().songs
    return songs.find((s) => s.id === id) || null
  },
}))

export default useSongStore
