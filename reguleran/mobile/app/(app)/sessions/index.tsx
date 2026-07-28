import { useEffect, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { useApi } from '../../../hooks/useApi'
import { useSessionStore } from '../../../stores/useSessionStore'
import EmptyState from '../../../components/ui/EmptyState'
import type { Session } from '../../../types'

// ponytail: SectionList grouping by day instead of react-native-calendars
const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function SessionsScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Session[]>()
  const { sessions, setSessions } = useSessionStore()
  const [refreshing, setRefreshing] = useState(false)

  async function fetchSessions() {
    const data = await execute('/sessions')
    if (data) setSessions(data)
  }

  useEffect(() => { fetchSessions() }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await fetchSessions()
    setRefreshing(false)
  }

  // Group sessions by day
  const grouped: { day: string; sessions: Session[] }[] = []
  const dayMap = new Map<string, Session[]>()
  for (const s of sessions) {
    const day = s.day || 'Lainnya'
    if (!dayMap.has(day)) dayMap.set(day, [])
    dayMap.get(day)!.push(s)
  }
  const sortedDays = [...dayMap.keys()].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  )
  for (const day of sortedDays) {
    grouped.push({ day, sessions: dayMap.get(day)! })
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <View className="pt-12 px-4 pb-3 border-b border-neutral-800 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Jadwal</Text>
        <TouchableOpacity onPress={() => router.push('/(app)/sessions/new')}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-4 py-4 border-b border-neutral-800 active:bg-neutral-900"
              onPress={() => router.push(`/(app)/sessions/${item.id}`)}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-medium text-base">{item.name}</Text>
                <View
                  className={`rounded-full w-2.5 h-2.5 ${item.active ? 'bg-green-500' : 'bg-neutral-700'}`}
                />
              </View>
              <View className="flex-row gap-3 mt-1.5">
                {item.day && <Text className="text-neutral-500 text-sm">{item.day}</Text>}
                {item.time && <Text className="text-neutral-500 text-sm">{item.time}</Text>}
              </View>
              {item.location?.venue && (
                <Text className="text-neutral-600 text-xs mt-1">{item.location.venue}</Text>
              )}
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={
            <EmptyState title="Belum ada jadwal" description="Tambahkan jadwal latihan" />
          }
          contentContainerStyle={sessions.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  )
}
