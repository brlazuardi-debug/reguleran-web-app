import { create } from 'zustand'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth, isConfigured } from '../services/firebase'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  init: () => {
    if (!isConfigured()) {
      set({ loading: false, error: null })
      return () => {}
    }
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ loading: false, error: 'Auth not available' })
      return () => {}
    }
    return onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })
  },

  login: async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase not configured')
    set({ error: null })
    const result = await signInWithEmailAndPassword(auth, email, password)
    set({ user: result.user })
  },

  register: async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase not configured')
    set({ error: null })
    const result = await createUserWithEmailAndPassword(auth, email, password)
    set({ user: result.user })
  },

  logout: async () => {
    const auth = getFirebaseAuth()
    if (auth) await signOut(auth)
    set({ user: null })
  },
}))

export default useAuthStore
