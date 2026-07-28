import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { useApi } from '../../../../hooks/useApi'
import { useSongStore } from '../../../../stores/useSongStore'
import Input from '../../../../components/ui/Input'
import Button from '../../../../components/ui/Button'
import type { Song } from '../../../../types'

export default function EditSongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<Song>()
  const { selectedSong, updateSong } = useSongStore()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [bpm, setBpm] = useState('')
  const [lyrics, setLyrics] = useState('')

  useEffect(() => {
    if (selectedSong) {
      setTitle(selectedSong.title)
      setArtist(selectedSong.artist || '')
      setKey(selectedSong.key || '')
      setBpm(selectedSong.bpm?.toString() || '')
      setLyrics(selectedSong.lyrics || '')
    }
  }, [selectedSong])

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Judul lagu wajib diisi')
      return
    }
    const data = await execute(`/songs/${id}`, {
      method: 'PUT',
      body: {
        title: title.trim(),
        artist: artist.trim() || null,
        key: key.trim() || null,
        bpm: bpm ? parseInt(bpm, 10) : null,
        lyrics: lyrics || null,
      },
    })
    if (data) {
      updateSong(id, data)
      router.back()
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Edit Lagu', headerTintColor: '#fff' }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Input label="Judul *" value={title} onChangeText={setTitle} />
        <Input label="Artis" value={artist} onChangeText={setArtist} />
        <Input label="Nada Dasar" value={key} onChangeText={setKey} />
        <Input label="BPM" value={bpm} onChangeText={setBpm} keyboardType="number-pad" />
        <Input label="Lirik" value={lyrics} onChangeText={setLyrics} multiline />

        <View className="pb-8 pt-4">
          <Button title="Simpan" onPress={handleSave} loading={loading} disabled={!title.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
