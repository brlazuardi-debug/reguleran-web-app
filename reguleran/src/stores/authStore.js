import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  logout: async () => {
    await window.Clerk?.signOut()
    set({ user: null })
  },
}))

export default useAuthStore
