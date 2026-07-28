import { useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { useApi } from '../../../hooks/useApi'
import type { Proposal } from '../../../types'

export default function NewProposalScreen() {
  const router = useRouter()
  const { execute, loading } = useApi<Proposal>()
  const [venueName, setVenueName] = useState('')
  const [venueContact, setVenueContact] = useState('')
  const [proposedDate, setProposedDate] = useState('')
  const [proposedTime, setProposedTime] = useState('')
  const [performanceFormat, setPerformanceFormat] = useState('')
  const [rateOffered, setRateOffered] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const inputClass = 'bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm'

  async function handleSubmit() {
    if (!venueName.trim()) {
      Alert.alert('Lengkapi data', 'Nama venue wajib diisi')
      return
    }
    setSubmitting(true)
    const data = await execute('/proposals', {
      method: 'POST',
      body: {
        venueName,
        venueContact: venueContact || null,
        proposedDate: proposedDate || null,
        proposedTime: proposedTime || null,
        performanceFormat: performanceFormat || null,
        rateOffered: rateOffered ? Number(rateOffered) : null,
        status: 'draft',
      },
    })
    setSubmitting(false)
    if (data) {
      router.replace('/(app)/proposals')
    }
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ title: 'Proposal Baru' }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-white font-semibold text-base mb-3">Informasi Venue</Text>
        <View className="space-y-3">
          <TextInput
            className={inputClass}
            placeholder="Nama venue"
            placeholderTextColor="#525252"
            value={venueName}
            onChangeText={setVenueName}
          />
          <TextInput
            className={inputClass}
            placeholder="Kontak venue (opsional)"
            placeholderTextColor="#525252"
            value={venueContact}
            onChangeText={setVenueContact}
          />
        </View>

        <Text className="text-white font-semibold text-base mb-3 mt-6">Tanggal & Waktu</Text>
        <View className="flex-row gap-3">
          <TextInput
            className={`flex-1 ${inputClass}`}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#525252"
            value={proposedDate}
            onChangeText={setProposedDate}
          />
          <TextInput
            className={`flex-1 ${inputClass}`}
            placeholder="HH:MM"
            placeholderTextColor="#525252"
            value={proposedTime}
            onChangeText={setProposedTime}
          />
        </View>

        <Text className="text-white font-semibold text-base mb-3 mt-6">Penampilan</Text>
        <TextInput
          className={inputClass}
          placeholder="Format penampilan (opsional)"
          placeholderTextColor="#525252"
          value={performanceFormat}
          onChangeText={setPerformanceFormat}
        />
        <TextInput
          className={`${inputClass} mt-3`}
          placeholder="Rate (Rp)"
          placeholderTextColor="#525252"
          keyboardType="numeric"
          value={rateOffered}
          onChangeText={setRateOffered}
        />

        <TouchableOpacity
          className={`bg-white rounded-xl py-4 items-center mt-8 ${submitting ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text className="text-black font-semibold text-base">
            {submitting ? 'Menyimpan...' : 'Buat Proposal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
