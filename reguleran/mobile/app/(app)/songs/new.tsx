import { useState } from 'react'
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { useApi } from '../../../hooks/useApi'
import { useSongStore } from '../../../stores/useSongStore'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import type { Song } from '../../../types'

export default function NewSongScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Song>()
  const { addSong } = useSongStore()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [bpm, setBpm] = useState('')
  const [lyrics, setLyrics] = useState('')

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Judul lagu wajib diisi')
      return
    }
    const data = await execute('/songs', {
      method: 'POST',
      body: {
        title: title.trim(),
        artist: artist.trim() || null,
        key: key.trim() || null,
        bpm: bpm ? parseInt(bpm, 10) : null,
        timeSignature: '4/4',
        lyrics: lyrics || null,
        isPublic: false,
        sections: [],
        audioStoragePath: null,
      },
    })
    if (data) {
      addSong(data)
      router.back()
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Tambah Lagu', headerTintColor: '#fff' }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Input label="Judul *" value={title} onChangeText={setTitle} placeholder="Judul lagu" />
        <Input label="Artis" value={artist} onChangeText={setArtist} placeholder="Nama artis" />
        <Input label="Nada Dasar" value={key} onChangeText={setKey} placeholder="C, Dm, G, ..." />
        <Input label="BPM" value={bpm} onChangeText={setBpm} placeholder="120" keyboardType="number-pad" />
        <Input
          label="Lirik"
          value={lyrics}
          onChangeText={setLyrics}
          placeholder="Lirik dengan [Chord] di dalam kurung siku..."
          multiline
        />

        <View className="pb-8 pt-4">
          <Button title="Simpan" onPress={handleSave} loading={loading} disabled={!title.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
