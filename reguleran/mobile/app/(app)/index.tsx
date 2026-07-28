import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Music, List, Calendar, ArrowRight } from 'lucide-react-native'
import { useApi } from '../../hooks/useApi'
import { useSongStore } from '../../stores/useSongStore'
import { useSetlistStore } from '../../stores/useSetlistStore'
import { useSessionStore } from '../../stores/useSessionStore'
import type { Song, Setlist, Session } from '../../types'

export default function DashboardScreen() {
  const router = useRouter()
  const { execute: fetchSongs } = useApi<Song[]>()
  const { execute: fetchSetlists } = useApi<Setlist[]>()
  const { execute: fetchSessions } = useApi<Session[]>()
  const { songs, setSongs } = useSongStore()
  const { setlists, setSetlists } = useSetlistStore()
  const { sessions, setSessions } = useSessionStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, sl, ses] = await Promise.all([
        fetchSongs('/songs'),
        fetchSetlists('/setlists'),
        fetchSessions('/sessions'),
      ])
      if (s) setSongs(s)
      if (sl) setSetlists(sl)
      if (ses) setSessions(ses)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  const upcomingSessions = sessions.filter((s) => s.active).slice(0, 3)

  return (
    <ScrollView className="flex-1 bg-neutral-950">
      <View className="pt-12 px-4 pb-4">
        <Text className="text-white text-2xl font-bold">Dashboard</Text>
      </View>

      {/* Stats cards */}
      <View className="flex-row px-4 gap-3 mb-6">
        <View className="flex-1 bg-neutral-900 rounded-2xl p-4">
          <Music size={24} color="#fff" />
          <Text className="text-white text-2xl font-bold mt-2">{songs.length}</Text>
          <Text className="text-neutral-500 text-sm">Lagu</Text>
        </View>
        <View className="flex-1 bg-neutral-900 rounded-2xl p-4">
          <List size={24} color="#fff" />
          <Text className="text-white text-2xl font-bold mt-2">{setlists.length}</Text>
          <Text className="text-neutral-500 text-sm">Setlist</Text>
        </View>
        <View className="flex-1 bg-neutral-900 rounded-2xl p-4">
          <Calendar size={24} color="#fff" />
          <Text className="text-white text-2xl font-bold mt-2">{upcomingSessions.length}</Text>
          <Text className="text-neutral-500 text-sm">Aktif</Text>
        </View>
      </View>

      {/* Quick actions */}
      <View className="px-4 mb-6">
        <Text className="text-white font-semibold text-base mb-3">Quick Actions</Text>
        <TouchableOpacity
          className="flex-row items-center bg-neutral-900 rounded-xl px-4 py-4 mb-2"
          onPress={() => router.push('/(app)/songs/new')}
        >
          <View className="flex-1">
            <Text className="text-white font-medium">Tambah Lagu Baru</Text>
            <Text className="text-neutral-500 text-sm">Buat lagu dengan chord dan lirik</Text>
          </View>
          <ArrowRight size={18} color="#525252" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-neutral-900 rounded-xl px-4 py-4"
          onPress={() => router.push('/(app)/setlists')}
        >
          <View className="flex-1">
            <Text className="text-white font-medium">Buat Setlist</Text>
            <Text className="text-neutral-500 text-sm">Atur lagu untuk latihan</Text>
          </View>
          <ArrowRight size={18} color="#525252" />
        </TouchableOpacity>
      </View>

      {/* Upcoming sessions */}
      {upcomingSessions.length > 0 && (
        <View className="px-4 mb-8">
          <Text className="text-white font-semibold text-base mb-3">Jadwal Aktif</Text>
          {upcomingSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              className="bg-neutral-900 rounded-xl px-4 py-3 mb-2"
              onPress={() => router.push(`/(app)/sessions/${session.id}`)}
            >
              <Text className="text-white font-medium">{session.name}</Text>
              {session.day && (
                <Text className="text-neutral-500 text-sm">{session.day} {session.time || ''}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
