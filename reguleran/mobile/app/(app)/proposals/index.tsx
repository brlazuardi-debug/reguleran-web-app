import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { File, Plus } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApi } from '../../../hooks/useApi'
import { useProposalStore } from '../../../stores/useProposalStore'
import type { Proposal } from '../../../types'

const STATUS_COLORS: Record<string, string> = {
  draft: '#525252',
  sent: '#3b82f6',
  accepted: '#22c55e',
  rejected: '#ef4444',
}
const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', sent: 'Terkirim', accepted: 'Diterima', rejected: 'Ditolak',
}

export default function ProposalsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { execute, loading } = useApi<Proposal[]>()
  const { proposals, setProposals } = useProposalStore()
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadProposals()
  }, [])

  async function loadProposals() {
    const data = await execute('/proposals')
    if (data) setProposals(data)
  }

  const filtered = filter === 'all' ? proposals : proposals.filter((p) => p.status === filter)

  return (
    <View className="flex-1 bg-neutral-950">
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-neutral-500 text-sm">{proposals.length} proposal</Text>
          <TouchableOpacity
            className="flex-row items-center gap-1.5 bg-white px-4 py-2 rounded-xl"
            onPress={() => router.push('/(app)/proposals/new')}
          >
            <Plus size={16} color="#000" />
            <Text className="text-black text-sm font-semibold">Baru</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={['all', 'draft', 'sent', 'accepted', 'rejected']}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          className="mb-2"
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`px-4 py-2 rounded-xl mr-2 ${filter === item ? 'bg-white' : 'bg-neutral-800'}`}
              onPress={() => setFilter(item)}
            >
              <Text className={`text-sm font-medium ${filter === item ? 'text-black' : 'text-neutral-400'}`}>
                {item === 'all' ? 'Semua' : STATUS_LABELS[item] || item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }}
          ListEmptyComponent={
            <View className="items-center pt-20">
              <File size={40} color="#525252" />
              <Text className="text-neutral-500 mt-4 text-sm">
                {filter === 'all' ? 'Belum ada proposal' : 'Tidak ada proposal'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-neutral-900 rounded-xl p-4 mb-3 border border-neutral-800"
              onPress={() => router.push(`/(app)/proposals/${item.id}`)}
            >
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-white font-semibold text-base flex-1 mr-2" numberOfLines={1}>
                  {item.venueName}
                </Text>
                <View className="px-2 py-0.5 rounded-md" style={{ backgroundColor: STATUS_COLORS[item.status] + '20' }}>
                  <Text style={{ color: STATUS_COLORS[item.status] }} className="text-xs font-medium">
                    {STATUS_LABELS[item.status]}
                  </Text>
                </View>
              </View>
              {item.proposedDate && (
                <Text className="text-neutral-500 text-xs mb-1">{item.proposedDate}</Text>
              )}
              {item.rateOffered && (
                <Text className="text-neutral-300 text-sm font-medium">
                  Rp {Number(item.rateOffered).toLocaleString('id-ID')}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}
