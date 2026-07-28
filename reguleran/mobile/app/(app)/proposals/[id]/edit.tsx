import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { useApi } from '../../../../hooks/useApi'
import { useProposalStore } from '../../../../stores/useProposalStore'
import type { Proposal, ProposalStatus } from '../../../../types'

export default function EditProposalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute } = useApi<Proposal>()
  const { proposals, updateProposal } = useProposalStore()
  const proposal = proposals.find((p) => p.id === id)

  const [venueName, setVenueName] = useState(proposal?.venueName || '')
  const [venueContact, setVenueContact] = useState(proposal?.venueContact || '')
  const [proposedDate, setProposedDate] = useState(proposal?.proposedDate || '')
  const [proposedTime, setProposedTime] = useState(proposal?.proposedTime || '')
  const [performanceFormat, setPerformanceFormat] = useState(proposal?.performanceFormat || '')
  const [rateOffered, setRateOffered] = useState(proposal?.rateOffered?.toString() || '')
  const [rateNotes, setRateNotes] = useState(proposal?.rateNotes || '')
  const [status, setStatus] = useState<ProposalStatus>(proposal?.status || 'draft')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!proposal) router.back()
  }, [proposal])

  const inputClass = 'bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm'

  async function handleSubmit() {
    if (!venueName.trim()) {
      Alert.alert('Lengkapi data', 'Nama venue wajib diisi')
      return
    }
    setSubmitting(true)
    const data = await execute(`/proposals/${id}`, {
      method: 'PUT',
      body: {
        venueName,
        venueContact: venueContact || null,
        proposedDate: proposedDate || null,
        proposedTime: proposedTime || null,
        performanceFormat: performanceFormat || null,
        rateOffered: rateOffered ? Number(rateOffered) : null,
        rateNotes: rateNotes || null,
        status,
      },
    })
    setSubmitting(false)
    if (data) {
      updateProposal(id, data)
      router.back()
    }
  }

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ title: 'Edit Proposal' }} />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-white font-semibold text-base mb-3">Venue & Kontak</Text>
        <TextInput className={inputClass} placeholder="Nama venue" placeholderTextColor="#525252" value={venueName} onChangeText={setVenueName} />
        <TextInput className={`${inputClass} mt-3`} placeholder="Kontak venue" placeholderTextColor="#525252" value={venueContact} onChangeText={setVenueContact} />

        <Text className="text-white font-semibold text-base mb-3 mt-6">Tanggal & Waktu</Text>
        <View className="flex-row gap-3">
          <TextInput className={`flex-1 ${inputClass}`} placeholder="YYYY-MM-DD" placeholderTextColor="#525252" value={proposedDate} onChangeText={setProposedDate} />
          <TextInput className={`flex-1 ${inputClass}`} placeholder="HH:MM" placeholderTextColor="#525252" value={proposedTime} onChangeText={setProposedTime} />
        </View>

        <Text className="text-white font-semibold text-base mb-3 mt-6">Penampilan & Rate</Text>
        <TextInput className={inputClass} placeholder="Format penampilan" placeholderTextColor="#525252" value={performanceFormat} onChangeText={setPerformanceFormat} />
        <TextInput className={`${inputClass} mt-3`} placeholder="Rate (Rp)" placeholderTextColor="#525252" keyboardType="numeric" value={rateOffered} onChangeText={setRateOffered} />
        <TextInput className={`${inputClass} mt-3`} placeholder="Catatan rate" placeholderTextColor="#525252" value={rateNotes} onChangeText={setRateNotes} />

        <Text className="text-white font-semibold text-base mb-3 mt-6">Status</Text>
        <View className="flex-row flex-wrap gap-2">
          {(['draft', 'sent', 'accepted', 'rejected'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              className={`px-4 py-3 rounded-xl border ${status === s ? 'bg-white border-white' : 'border-neutral-700'}`}
              onPress={() => setStatus(s)}
            >
              <Text className={status === s ? 'text-black font-semibold' : 'text-neutral-400'}>
                {s === 'draft' ? 'Draft' : s === 'sent' ? 'Terkirim' : s === 'accepted' ? 'Diterima' : 'Ditolak'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`bg-white rounded-xl py-4 items-center mt-8 mb-8 ${submitting ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text className="text-black font-semibold text-base">Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
