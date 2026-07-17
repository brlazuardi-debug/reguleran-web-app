import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useViewPreferencesStore = create(
  persist(
    (set) => ({
      showAllRoles: false,
      setShowAllRoles: (val) => set({ showAllRoles: val }),
      toggleShowAllRoles: () => set((s) => ({ showAllRoles: !s.showAllRoles })),
    }),
    { name: 'reguleran-view-preferences' }
  )
)

export default useViewPreferencesStore
