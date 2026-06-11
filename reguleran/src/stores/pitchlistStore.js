import { create } from 'zustand'

const usePitchlistStore = create((set) => ({
  transposeOffsets: {},

  setTranspose: (songId, offset) => {
    set((state) => ({
      transposeOffsets: { ...state.transposeOffsets, [songId]: offset },
    }))
  },

  resetTranspose: (songId) => {
    set((state) => {
      const rest = { ...state.transposeOffsets }
      delete rest[songId]
      return { transposeOffsets: rest }
    })
  },

  resetAll: () => set({ transposeOffsets: {} }),
}))

export default usePitchlistStore
