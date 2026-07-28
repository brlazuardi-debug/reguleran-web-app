import { create } from 'zustand'
import type { Proposal } from '../types'

interface ProposalStore {
  proposals: Proposal[]
  selectedProposal: Proposal | null
  loading: boolean
  error: string | null
  setProposals: (proposals: Proposal[]) => void
  setSelectedProposal: (proposal: Proposal | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  addProposal: (proposal: Proposal) => void
  updateProposal: (id: string, data: Partial<Proposal>) => void
  removeProposal: (id: string) => void
}

export const useProposalStore = create<ProposalStore>((set) => ({
  proposals: [],
  selectedProposal: null,
  loading: false,
  error: null,
  setProposals: (proposals) => set({ proposals }),
  setSelectedProposal: (proposal) => set({ selectedProposal: proposal }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addProposal: (proposal) => set((s) => ({ proposals: [proposal, ...s.proposals] })),
  updateProposal: (id, data) =>
    set((s) => ({
      proposals: s.proposals.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removeProposal: (id) =>
    set((s) => ({ proposals: s.proposals.filter((p) => p.id !== id) })),
}))
