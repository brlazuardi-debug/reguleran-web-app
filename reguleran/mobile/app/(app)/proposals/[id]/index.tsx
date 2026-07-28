import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Trash2, FileText, Share } from 'lucide-react-native'
import { useApi } from '../../../../hooks/useApi'
import { useProposalStore } from '../../../../stores/useProposalStore'
import type { Proposal } from '../../../../types'

const STATUS_COLORS: Record<string, string> = {
  draft: '#525252', sent: '#3b82f6', accepted: '#22c55e', rejected: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', sent: 'Terkirim', accepted: 'Diterima', rejected: 'Ditolak',
}

export default function ProposalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<Proposal>()
  const { proposals, updateProposal, removeProposal } = useProposalStore()
  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    const cached = proposals.find((p) => p.id === id)
    if (cached) setProposal(cached)
    fetchProposal()
  }, [id])

  async function fetchProposal() {
    const data = await execute(`/proposals/${id}`)
    if (data) {
      setProposal(data)
      updateProposal(id, data)
    }
  }

  async function handleDelete() {
    Alert.alert('Hapus Proposal', `Hapus proposal untuk venue "${proposal?.venueName}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          await execute(`/proposals/${id}`, { method: 'DELETE' })
          removeProposal(id)
          router.back()
        },
      },
    ])
  }

  async function handleGeneratePdf() {
    const data = await execute(`/proposals/${id}/generate-pdf`, { method: 'POST' })
    if (data && (data as any).pdfUrl) {
      updateProposal(id, { pdfUrl: (data as any).pdfUrl })
      Linking.openURL((data as any).pdfUrl)
    }
  }

  async function handleShare() {
    if (!proposal?.pdfUrl) {
      Alert.alert('Belum ada PDF', 'Generate PDF dulu sebelum share')
      return
    }
    await Linking.openURL(proposal.pdfUrl)
  }

  if (loading && !proposal) {
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator color="#fff" />
      </View>
    )
  }
  if (!proposal) return null

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen
        options={{
          title: proposal.venueName,
          headerTintColor: '#fff',
          headerRight: () => (
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={handleDelete}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-lg font-semibold">{proposal.venueName}</Text>
          <View className="px-3 py-1 rounded-md" style={{ backgroundColor: STATUS_COLORS[proposal.status] + '20' }}>
            <Text style={{ color: STATUS_COLORS[proposal.status] }} className="text-xs font-medium">
              {STATUS_LABELS[proposal.status]}
            </Text>
          </View>
        </View>

        {proposal.proposedDate && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Tanggal</Text>
            <Text className="text-white text-base">{proposal.proposedDate}{proposal.proposedTime ? ` | ${proposal.proposedTime}` : ''}</Text>
          </View>
        )}

        {proposal.performanceFormat && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Format</Text>
            <Text className="text-white text-base">{proposal.performanceFormat}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-neutral-400 text-sm">Rate</Text>
          <Text className="text-white text-base">
            {proposal.rateOffered ? `Rp ${Number(proposal.rateOffered).toLocaleString('id-ID')}` : '—'}
          </Text>
        </View>

        {proposal.rateNotes && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Catatan Rate</Text>
            <Text className="text-white text-base">{proposal.rateNotes}</Text>
          </View>
        )}

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 bg-white rounded-xl py-4"
            onPress={handleGeneratePdf}
          >
            <FileText size={18} color="#000" />
            <Text className="text-black font-semibold">Generate PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 bg-neutral-800 rounded-xl py-4 px-4"
            onPress={handleShare}
          >
            <Share size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {proposal.pdfUrl && (
          <TouchableOpacity
            className="mt-3 bg-neutral-900 border border-neutral-700 rounded-xl py-4 items-center"
            onPress={() => Linking.openURL(proposal.pdfUrl!)}
          >
            <Text className="text-blue-400 text-sm font-medium">Buka PDF</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}
