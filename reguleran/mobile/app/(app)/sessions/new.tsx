import { useState } from 'react'
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { useApi } from '../../../hooks/useApi'
import { useSessionStore } from '../../../stores/useSessionStore'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import type { Session } from '../../../types'

export default function NewSessionScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Session>()
  const { addSession } = useSessionStore()
  const [name, setName] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Validation', 'Nama jadwal wajib diisi')
      return
    }
    const data = await execute('/sessions', {
      method: 'POST',
      body: {
        name: name.trim(),
        day: day.trim() || null,
        time: time.trim() || null,
        location: {
          venue: venue.trim() || undefined,
          address: address.trim() || undefined,
        },
        active: true,
        setlistId: null,
      },
    })
    if (data) {
      addSession(data)
      router.back()
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Tambah Jadwal', headerTintColor: '#fff' }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Input label="Nama *" value={name} onChangeText={setName} placeholder="Latihan Mingguan" />
        <Input label="Hari" value={day} onChangeText={setDay} placeholder="Senin, Selasa, ..." />
        <Input label="Jam" value={time} onChangeText={setTime} placeholder="19:00" />
        <Input label="Tempat" value={venue} onChangeText={setVenue} placeholder="Studio Musik" />
        <Input label="Alamat" value={address} onChangeText={setAddress} placeholder="Jl. Contoh No. 123" />

        <View className="pb-8 pt-4">
          <Button title="Simpan" onPress={handleSave} loading={loading} disabled={!name.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
