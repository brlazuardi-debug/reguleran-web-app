import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { Trash2, Edit3, ChevronDown, ChevronUp } from 'lucide-react-native'
import { useApi } from '../../../../hooks/useApi'
import { useSongStore } from '../../../../stores/useSongStore'
import { uploadAudioToCloudinary } from '../../../../services/cloudinary'
import ChordDisplay from '../../../../components/songs/ChordDisplay'
import PitchShifterPanel from '../../../../components/audio/PitchShifterPanel'
import type { Song, SongSection } from '../../../../types'

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<Song>()
  const { selectedSong, setSelectedSong, removeSong } = useSongStore()
  const [transpose, setTranspose] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  async function fetchSong() {
    const data = await execute(`/songs/${id}`)
    if (data) setSelectedSong(data)
  }

  useEffect(() => { fetchSong() }, [id])

  async function handleDelete() {
    Alert.alert('Hapus Lagu', 'Yakin ingin menghapus lagu ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          await execute(`/songs/${id}`, { method: 'DELETE' })
          removeSong(id)
          router.back()
        },
      },
    ])
  }

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  if (loading && !selectedSong) {
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  const song = selectedSong
  if (!song) return null

  async function handleAudioUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' })
      if (result.canceled || !result.assets?.[0]) return

      const file = result.assets[0]
      const cloudinaryResult = await uploadAudioToCloudinary(file.uri, file.name)
      if (!cloudinaryResult) {
        Alert.alert('Error', 'Gagal upload audio')
        return
      }

      const data = await execute(`/songs/${id}`, {
        method: 'PUT',
        body: { audioStoragePath: cloudinaryResult.url },
      })
      if (data) {
        setSelectedSong(data)
      }
    } catch {
      Alert.alert('Error', 'Gagal memproses audio')
    }
  }

  const lines = (song.lyrics || '').split('\n')
  const sections = song.sections || []

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen
        options={{
          title: song.title,
          headerTintColor: '#fff',
          headerRight: () => (
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => router.push(`/(app)/songs/${id}/edit`)}>
                <Edit3 size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView className="flex-1 px-4">
        {/* Song Info */}
        <View className="py-4 border-b border-neutral-800">
          <Text className="text-white text-2xl font-bold">{song.title}</Text>
          {song.artist && <Text className="text-neutral-400 text-base mt-1">{song.artist}</Text>}
          <View className="flex-row gap-4 mt-3">
            {song.key && (
              <View className="bg-neutral-900 rounded-lg px-3 py-1">
                <Text className="text-neutral-400 text-xs">Nada</Text>
                <Text className="text-white font-semibold">{song.key}</Text>
              </View>
            )}
            {song.bpm && (
              <View className="bg-neutral-900 rounded-lg px-3 py-1">
                <Text className="text-neutral-400 text-xs">BPM</Text>
                <Text className="text-white font-semibold">{song.bpm}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Audio Player */}
        <View className="py-3 border-b border-neutral-800">
          <PitchShifterPanel
            audioUrl={song.audioStoragePath}
            onUpload={handleAudioUpload}
          />
        </View>

        {/* Transpose */}
        <View className="py-3 border-b border-neutral-800">
          <Text className="text-neutral-400 text-sm mb-2">Transpose</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="bg-neutral-900 rounded-lg px-4 py-2"
              onPress={() => setTranspose(Math.max(-5, transpose - 1))}
            >
              <Text className="text-white font-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg">{transpose > 0 ? `+${transpose}` : transpose}</Text>
            <TouchableOpacity
              className="bg-neutral-900 rounded-lg px-4 py-2"
              onPress={() => setTranspose(Math.min(5, transpose + 1))}
            >
              <Text className="text-white font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sections */}
        {sections.length > 0 && (
          <View className="py-3 border-b border-neutral-800">
            <Text className="text-neutral-400 text-sm mb-2">Sections</Text>
            {sections.map((section: SongSection) => (
              <View key={section.id} className="mb-2">
                <TouchableOpacity
                  className="flex-row items-center justify-between bg-neutral-900 rounded-xl px-4 py-3"
                  onPress={() => toggleSection(section.id)}
                >
                  <Text className="text-white font-medium">
                    {section.customLabel || section.label}
                  </Text>
                  {expandedSections.has(section.id) ? (
                    <ChevronUp size={16} color="#737373" />
                  ) : (
                    <ChevronDown size={16} color="#737373" />
                  )}
                </TouchableOpacity>
                {expandedSections.has(section.id) && section.notes && (
                  <View className="bg-neutral-900/50 rounded-b-xl px-4 py-2 mt-1">
                    <Text className="text-neutral-400 text-sm">{section.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Lyrics with chords */}
        <View className="py-4">
          <ChordDisplay lines={lines} transpose={transpose} />
        </View>
      </ScrollView>
    </View>
  )
}
