import { create } from 'zustand'
import type { Song } from '../types'

interface SongStore {
  songs: Song[]
  selectedSong: Song | null
  loading: boolean
  error: string | null
  setSongs: (songs: Song[]) => void
  setSelectedSong: (song: Song | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  addSong: (song: Song) => void
  updateSong: (id: string, data: Partial<Song>) => void
  removeSong: (id: string) => void
}

export const useSongStore = create<SongStore>((set) => ({
  songs: [],
  selectedSong: null,
  loading: false,
  error: null,
  setSongs: (songs) => set({ songs }),
  setSelectedSong: (song) => set({ selectedSong: song }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addSong: (song) => set((s) => ({ songs: [song, ...s.songs] })),
  updateSong: (id, data) =>
    set((s) => ({
      songs: s.songs.map((song) => (song.id === id ? { ...song, ...data } : song)),
    })),
  removeSong: (id) =>
    set((s) => ({ songs: s.songs.filter((song) => song.id !== id) })),
}))
