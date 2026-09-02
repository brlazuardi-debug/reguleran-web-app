import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Stack } from 'expo-router'
import { Camera } from 'lucide-react-native'
import { useApi } from '../../hooks/useApi'
import { useBandProfileStore } from '../../stores/useBandProfileStore'
import type { BandProfile } from '../../types'

export default function BandProfileScreen() {
  const { execute, loading } = useApi<BandProfile>()
  const { profile, setProfile } = useBandProfileStore()
  const [editing, setEditing] = useState(false)
  const [bandName, setBandName] = useState('')
  const [description, setDescription] = useState('')
  const [genres, setGenres] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProfile() }, [])

  useEffect(() => {
    if (profile && !editing) {
      setBandName(profile.bandName || '')
      setGenres(profile.genres?.join(', ') || '')
      setDescription(profile.description || '')
      setContactName(profile.contactName || '')
      setContactPhone(profile.contactPhone || '')
      setContactEmail(profile.contactEmail || '')
    }
  }, [profile, editing])

  async function fetchProfile() {
    const data = await execute('/bandProfiles')
    if (data) setProfile(data)
  }

  async function handleSave() {
    setSaving(true)
    const data = await execute('/bandProfiles', {
      method: 'POST',
      body: {
        bandName,
        genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
        description,
        contactName,
        contactPhone,
        contactEmail,
      },
    })
    setSaving(false)
    if (data) {
      setProfile(data)
      setEditing(false)
    }
  }

  const inputClass = 'bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm'

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{
        title: 'Profil Band',
        headerRight: () => (
          <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
            <Text className={`font-semibold text-sm ${saving ? 'text-neutral-500' : editing ? 'text-green-400' : 'text-blue-400'}`}>
              {saving ? 'Menyimpan...' : editing ? 'Simpan' : 'Edit'}
            </Text>
          </TouchableOpacity>
        ),
      }} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-6">
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-neutral-800 items-center justify-center mb-3">
              {profile?.logoUrl ? (
                <Image source={{ uri: profile.logoUrl }} className="w-24 h-24 rounded-full" />
              ) : (
                <Camera size={32} color="#525252" />
              )}
            </View>
            {editing ? (
              <Text className="text-neutral-500 text-xs">Logo via web app — upload di halaman web</Text>
            ) : null}
          </View>

          <Text className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Informasi Band</Text>
          {editing ? (
            <View className="space-y-3">
              <TextInput className={inputClass} placeholder="Nama band" placeholderTextColor="#525252" value={bandName} onChangeText={setBandName} />
              <TextInput className={inputClass} placeholder="Genre (pisahkan dengan koma)" placeholderTextColor="#525252" value={genres} onChangeText={setGenres} />
              <TextInput className={`${inputClass} h-24`} placeholder="Deskripsi" placeholderTextColor="#525252" multiline value={description} onChangeText={setDescription} textAlignVertical="top" />
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-1">{profile?.bandName || '—'}</Text>
              {profile?.genres && profile.genres.length > 0 && <Text className="text-neutral-400 mb-0.5">{profile.genres.join(', ')}</Text>}
              {profile?.description && <Text className="text-neutral-400 text-sm mt-3 leading-5">{profile.description}</Text>}
            </View>
          )}

          <Text className="text-neutral-400 text-xs uppercase tracking-wider mb-2 mt-4">Kontak</Text>
          {editing ? (
            <View className="space-y-3">
              <TextInput className={inputClass} placeholder="Nama kontak" placeholderTextColor="#525252" value={contactName} onChangeText={setContactName} />
              <TextInput className={inputClass} placeholder="No. telepon" placeholderTextColor="#525252" keyboardType="phone-pad" value={contactPhone} onChangeText={setContactPhone} />
              <TextInput className={inputClass} placeholder="Email" placeholderTextColor="#525252" keyboardType="email-address" value={contactEmail} onChangeText={setContactEmail} />
            </View>
          ) : (
            <View className="mb-8">
              {profile?.contactName && <Text className="text-white mb-0.5">{profile.contactName}</Text>}
              {profile?.contactPhone && <Text className="text-neutral-400 mb-0.5">{profile.contactPhone}</Text>}
              {profile?.contactEmail && <Text className="text-neutral-400">{profile.contactEmail}</Text>}
              {!profile?.contactName && !profile?.contactPhone && !profile?.contactEmail && (
                <Text className="text-neutral-500 italic">Belum ada kontak</Text>
              )}
            </View>
          )}

          {editing && (
            <TouchableOpacity
              className="bg-neutral-800 rounded-xl py-3 items-center mb-8"
              onPress={() => setEditing(false)}
            >
              <Text className="text-neutral-400 text-sm">Batal</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  )
}
