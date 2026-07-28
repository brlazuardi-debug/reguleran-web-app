import { useEffect, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Trash2, GripVertical, Plus } from 'lucide-react-native'
import { useApi } from '../../../hooks/useApi'
import { useSetlistStore } from '../../../stores/useSetlistStore'
import { useSongStore } from '../../../stores/useSongStore'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import type { Setlist, SetlistSong } from '../../../types'

export default function SetlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<Setlist>()
  const { execute: fetchSongs } = useApi()
  const { setlists, updateSetlist } = useSetlistStore()
  const { songs } = useSongStore()
  const [setlist, setSetlist] = useState<Setlist | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  async function fetchSetlist() {
    const data = await execute(`/setlists/${id}`)
    if (data) {
      setSetlist(data)
      updateSetlist(id, data)
    }
  }

  useEffect(() => {
    const cached = setlists.find((s) => s.id === id)
    if (cached) setSetlist(cached)
    fetchSetlist()
  }, [id])

  async function addSong(songId: string) {
    if (!setlist) return
    const existing = setlist.songs || []
    if (existing.find((s) => s.songId === songId)) {
      Alert.alert('Info', 'Lagu sudah ada di setlist')
      return
    }
    const newSongs: SetlistSong[] = [
      ...existing,
      { songId, transpose: 0, order: existing.length },
    ]
    const data = await execute(`/setlists/${id}`, {
      method: 'PUT',
      body: { ...setlist, songs: newSongs },
    })
    if (data) {
      setSetlist(data)
      updateSetlist(id, data)
    }
  }

  async function removeSong(songId: string) {
    if (!setlist) return
    const newSongs = (setlist.songs || []).filter((s) => s.songId !== songId)
    const data = await execute(`/setlists/${id}`, {
      method: 'PUT',
      body: { ...setlist, songs: newSongs },
    })
    if (data) {
      setSetlist(data)
      updateSetlist(id, data)
    }
  }

  async function updateTranspose(songId: string, delta: number) {
    if (!setlist) return
    const newSongs = (setlist.songs || []).map((s) =>
      s.songId === songId ? { ...s, transpose: Math.max(-5, Math.min(5, s.transpose + delta)) } : s
    )
    const data = await execute(`/setlists/${id}`, {
      method: 'PUT',
      body: { ...setlist, songs: newSongs },
    })
    if (data) {
      setSetlist(data)
      updateSetlist(id, data)
    }
  }

  const songMap = new Map(songs.map((s) => [s.id, s]))

  if (loading && !setlist) {
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  if (!setlist) return null

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ title: setlist.name, headerTintColor: '#fff' }} />

      {showPicker ? (
        <View className="flex-1 px-4 pt-4">
          <Text className="text-white font-semibold text-base mb-3">Tambah Lagu</Text>
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="px-4 py-3 border-b border-neutral-800 active:bg-neutral-900"
                onPress={() => { addSong(item.id); setShowPicker(false) }}
              >
                <Text className="text-white">{item.title}</Text>
                {item.artist && <Text className="text-neutral-500 text-sm">{item.artist}</Text>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={<EmptyState title="Tidak ada lagu" description="Buat lagu dulu" />}
          />
          <Button title="Tutup" variant="secondary" onPress={() => setShowPicker(false)} />
        </View>
      ) : (
        <>
          {setlist.description && (
            <View className="px-4 py-2 border-b border-neutral-800">
              <Text className="text-neutral-400 text-sm">{setlist.description}</Text>
            </View>
          )}

          <FlatList
            data={setlist.songs || []}
            keyExtractor={(item) => item.songId}
            renderItem={({ item, index }) => {
              const song = songMap.get(item.songId)
              return (
                <View className="flex-row items-center px-4 py-3 border-b border-neutral-800">
                  <GripVertical size={18} color="#404040" />
                  <View className="flex-1 ml-2">
                    <Text className="text-white font-medium">
                      {index + 1}. {song?.title || 'Unknown'}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className="bg-neutral-900 rounded-lg px-2 py-1"
                      onPress={() => updateTranspose(item.songId, -1)}
                    >
                      <Text className="text-neutral-400 text-xs">-</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xs w-8 text-center">
                      {item.transpose > 0 ? `+${item.transpose}` : item.transpose}
                    </Text>
                    <TouchableOpacity
                      className="bg-neutral-900 rounded-lg px-2 py-1"
                      onPress={() => updateTranspose(item.songId, 1)}
                    >
                      <Text className="text-neutral-400 text-xs">+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeSong(item.songId)} className="ml-2">
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
            ListEmptyComponent={
              <EmptyState title="Setlist kosong" description="Tambahkan lagu dari daftar lagu" />
            }
          />

          <TouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full items-center justify-center"
            onPress={() => setShowPicker(true)}
          >
            <Plus size={24} color="#000" />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
