import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, ActivityIndicator, Alert, Switch, TouchableOpacity
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Trash2, FileText } from 'lucide-react-native'
import { useApi } from '../../../hooks/useApi'
import { useSessionStore } from '../../../stores/useSessionStore'
import Button from '../../../components/ui/Button'
import type { Session } from '../../../types'

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<Session>()
  const { sessions, updateSession, removeSession } = useSessionStore()
  const [session, setSession] = useState<Session | null>(null)

  async function fetchSession() {
    const data = await execute(`/sessions/${id}`)
    if (data) {
      setSession(data)
      updateSession(id, data)
    }
  }

  useEffect(() => {
    const cached = sessions.find((s) => s.id === id)
    if (cached) setSession(cached)
    fetchSession()
  }, [id])

  async function toggleActive(value: boolean) {
    if (!session) return
    const data = await execute(`/sessions/${id}`, {
      method: 'PUT',
      body: { ...session, active: value },
    })
    if (data) {
      setSession(data)
      updateSession(id, data)
    }
  }

  async function handleDelete() {
    Alert.alert('Hapus Jadwal', 'Yakin ingin menghapus jadwal ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          await execute(`/sessions/${id}`, { method: 'DELETE' })
          removeSession(id)
          router.back()
        },
      },
    ])
  }

  if (loading && !session) {
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  if (!session) return null
  const loc = session.location || {}

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen
        options={{
          title: session.name,
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
          <Text className="text-white text-lg font-semibold">Status</Text>
          <Switch
            value={session.active}
            onValueChange={toggleActive}
            trackColor={{ false: '#404040', true: '#22c55e' }}
            thumbColor="#fff"
          />
        </View>

        {session.day && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Hari</Text>
            <Text className="text-white text-base">{session.day}</Text>
          </View>
        )}

        {session.time && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Waktu</Text>
            <Text className="text-white text-base">{session.time}</Text>
          </View>
        )}

        {loc.venue && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Tempat</Text>
            <Text className="text-white text-base">{loc.venue}</Text>
          </View>
        )}

        {loc.address && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Alamat</Text>
            <Text className="text-white text-base">{loc.address}</Text>
          </View>
        )}

        {loc.contactPerson && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Kontak</Text>
            <Text className="text-white text-base">{loc.contactPerson}</Text>
          </View>
        )}

        {loc.locationNotes && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Catatan</Text>
            <Text className="text-white text-base">{loc.locationNotes}</Text>
          </View>
        )}

        {session.setlistId && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-sm">Setlist</Text>
            <Text className="text-white text-base">Terhubung ke setlist</Text>
          </View>
        )}

        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 bg-white rounded-xl py-4 mt-4"
          onPress={() => router.push(`/(app)/sessions/${id}/rider`)}
        >
          <FileText size={18} color="#000" />
          <Text className="text-black font-semibold">Rider & RAB</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
