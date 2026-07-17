import { create } from 'zustand'
import * as db from '../services/db'
import { deleteAudio } from '../services/storage'
import useAuthStore from './authStore'

const useSongStore = create((set) => ({
  songs: [],
  loading: false,
  error: null,

  subscribe: () => {
    const user = useAuthStore.getState().user
    if (!user) return () => {}

    set({ loading: true })
    return db.subscribe('songs', (items) => {
      const songs = items
        .filter((s) => s.userId === user.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      set({ songs, loading: false })
    })
  },

  addSong: async (songData) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    const id = await db.addItem('songs', { ...songData, userId: user.uid, createdAt: new Date().toISOString() })
    if (songData.isPublic) {
      await db.addItem('publicSongs', { ...songData, originalSongId: id, sharedBy: user.uid, sharedByName: user.email, createdAt: new Date().toISOString() })
    }
    return id
  },

  updateSong: async (id, songData) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('Not available')
    await db.updateItem('songs', id, songData)
    if (songData.isPublic) {
      const existing = db.queryItems('publicSongs', (s) => s.originalSongId === id)
      if (existing.length > 0) {
        await db.updateItem('publicSongs', existing[0].id, { ...songData, sharedBy: user.uid, sharedByName: user.email })
      } else {
        await db.addItem('publicSongs', { ...songData, originalSongId: id, sharedBy: user.uid, sharedByName: user.email, createdAt: new Date().toISOString() })
      }
    } else {
      const existing = db.queryItems('publicSongs', (s) => s.originalSongId === id)
      for (const item of existing) {
        await db.deleteItem('publicSongs', item.id)
      }
    }
  },

  deleteSong: async (id) => {
    await db.deleteItem('songs', id)
    const existing = db.queryItems('publicSongs', (s) => s.originalSongId === id)
    for (const item of existing) {
      await db.deleteItem('publicSongs', item.id)
    }
    await deleteAudio(id)
  },

  getSongById: (id) => {
    const songs = useSongStore.getState().songs
    return songs.find((s) => s.id === id) || null
  },
}))

export default useSongStore
