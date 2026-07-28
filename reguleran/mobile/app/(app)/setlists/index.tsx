import { useEffect, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert, TextInput
} from 'react-native'
import { useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { useApi } from '../../../hooks/useApi'
import { useSetlistStore } from '../../../stores/useSetlistStore'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import type { Setlist } from '../../../types'

export default function SetlistsScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Setlist[]>()
  const { execute: createSetlist } = useApi<Setlist>()
  const { setlists, setSetlists, addSetlist } = useSetlistStore()
  const [refreshing, setRefreshing] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')

  async function fetchSetlists() {
    const data = await execute('/setlists')
    if (data) setSetlists(data)
  }

  useEffect(() => { fetchSetlists() }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await fetchSetlists()
    setRefreshing(false)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    const data = await createSetlist('/setlists', {
      method: 'POST',
      body: { name: newName.trim(), description: null, songs: [] },
    })
    if (data) {
      addSetlist(data)
      setNewName('')
      setShowNew(false)
      router.push(`/(app)/setlists/${data.id}`)
    }
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <View className="pt-12 px-4 pb-3 border-b border-neutral-800 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Setlist</Text>
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showNew && (
        <View className="px-4 py-3 border-b border-neutral-800">
          <TextInput
            className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-2"
            placeholder="Nama setlist"
            placeholderTextColor="#525252"
            value={newName}
            onChangeText={setNewName}
          />
          <Button title="Buat Setlist" onPress={handleCreate} disabled={!newName.trim()} />
        </View>
      )}

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={setlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-4 py-4 border-b border-neutral-800 active:bg-neutral-900"
              onPress={() => router.push(`/(app)/setlists/${item.id}`)}
            >
              <Text className="text-white font-medium text-base">{item.name}</Text>
              {item.description && (
                <Text className="text-neutral-500 text-sm mt-0.5">{item.description}</Text>
              )}
              <Text className="text-neutral-600 text-xs mt-1">
                {item.songs?.length || 0} lagu
              </Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={
            <EmptyState title="Belum ada setlist" description="Buat setlist untuk latihan" />
          }
          contentContainerStyle={setlists.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  )
}
