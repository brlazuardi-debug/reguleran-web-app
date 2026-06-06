import { create } from 'zustand'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { getFirestoreDB, isConfigured } from '../services/firebase'
import useAuthStore from './authStore'
import { scheduleSessionReminder } from '../services/notification'

const useSessionStore = create((set, get) => ({
  sessions: [],
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
      collection(db, 'sessions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const sessions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        set({ sessions, loading: false })
        sessions.forEach((s) => {
          if (s.active !== false) scheduleSessionReminder(s)
        })
      },
      (error) => set({ error: error.message, loading: false })
    )
  },

  addSession: async (data) => {
    const user = useAuthStore.getState().user
    const db = getFirestoreDB()
    if (!user || !db) throw new Error('Not available')
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...data,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  },

  updateSession: async (id, data) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await updateDoc(doc(db, 'sessions', id), data)
  },

  deleteSession: async (id) => {
    const db = getFirestoreDB()
    if (!db) throw new Error('Not available')
    await deleteDoc(doc(db, 'sessions', id))
  },

  getUpcoming: () => {
    const sessions = get().sessions
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const today = new Date().getDay()

    return sessions
      .filter((s) => s.active !== false)
      .map((s) => {
        const dayNum = dayNames.indexOf(s.day)
        let daysUntil = dayNum - today
        if (daysUntil < 0) daysUntil += 7
        return { ...s, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
  },
}))

export default useSessionStore
