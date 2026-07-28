import { useEffect, useState } from 'react'
import {
  FlatList, View, Text, TextInput,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { useRouter } from 'expo-router'
import { Plus, Search } from 'lucide-react-native'
import { useSongStore } from '../../../stores/useSongStore'
import { useApi } from '../../../hooks/useApi'
import SongCard from '../../../components/songs/SongCard'
import EmptyState from '../../../components/ui/EmptyState'
import type { Song } from '../../../types'

export default function SongsScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Song[]>()
  const { songs, setSongs } = useSongStore()
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  async function fetchSongs() {
    const data = await execute('/songs')
    if (data) setSongs(data)
  }

  useEffect(() => { fetchSongs() }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await fetchSongs()
    setRefreshing(false)
  }

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.artist ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View className="flex-1 bg-neutral-950">
      {/* Header */}
      <View className="pt-12 px-4 pb-3 border-b border-neutral-800">
        <Text className="text-white text-2xl font-bold">Lagu</Text>
        <View className="flex-row items-center bg-neutral-900 rounded-xl px-3 mt-3 gap-2">
          <Search size={16} color="#525252" />
          <TextInput
            className="flex-1 py-3 text-white text-sm"
            placeholder="Cari lagu atau artis..."
            placeholderTextColor="#525252"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() => router.push(`/(app)/songs/${item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#ffffff"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Belum ada lagu"
              description="Tambahkan lagu pertama Anda"
            />
          }
          contentContainerStyle={filtered.length === 0 ? { flex: 1 } : undefined}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/(app)/songs/new')}
      >
        <Plus size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  )
}
