import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Plus, X, FileText, Share } from 'lucide-react-native'
import { useApi } from '../../../../hooks/useApi'
import type { EventDocument } from '../../../../types'

interface SoundNeed {
  id: string
  item: string
  quantity: number
  notes: string
}

interface InstrumentNeed {
  id: string
  instrument: string
  qty: number
  providedBy: 'band' | 'venue'
  notes: string
}

interface BudgetLine {
  id: string
  description: string
  amount: number
  notes: string
}

export default function RiderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { execute, loading } = useApi<EventDocument>()
  const [doc, setDoc] = useState<EventDocument | null>(null)
  const [docId, setDocId] = useState<string | null>(null)
  const [soundNeeds, setSoundNeeds] = useState<SoundNeed[]>([])
  const [instruments, setInstruments] = useState<InstrumentNeed[]>([])
  const [budget, setBudget] = useState<BudgetLine[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchDoc() }, [id])

  async function fetchDoc() {
    const list = await execute(`/event-documents?sessionId=${id}`)
    if (list && Array.isArray(list) && list.length > 0) {
      const d = list[0]
      setDoc(d)
      setDocId(d.id)
      setNotes(d.notes || '')
      setSoundNeeds(d.soundNeeds || [])
      setInstruments(d.instrumentNeeds || [])
      setBudget(d.budget || [])
    }
  }

  async function saveDoc() {
    setSaving(true)
    if (docId) {
      await execute(`/event-documents/${docId}`, {
        method: 'PUT',
        body: { soundNeeds, instrumentNeeds: instruments, budget, notes, sessionId: id },
      })
    } else {
      const created = await execute('/event-documents', {
        method: 'POST',
        body: { soundNeeds, instrumentNeeds: instruments, budget, notes, sessionId: id },
      })
      if (created) {
        setDoc(created)
        setDocId(created.id)
      }
    }
    setSaving(false)
  }

  async function handleGeneratePdf() {
    if (!docId) {
      Alert.alert('Simpan dulu', 'Simpan rider dulu sebelum generate PDF')
      return
    }
    const data = await execute(`/event-documents/${docId}/generate-pdf`, { method: 'POST' })
    if (data && (data as any).pdfUrl) {
      setDoc({ ...doc!, pdfUrl: (data as any).pdfUrl })
      Linking.openURL((data as any).pdfUrl)
    }
  }

  function addSoundNeed() { setSoundNeeds([...soundNeeds, { id: Date.now().toString(), item: '', quantity: 1, notes: '' }]) }
  function addInstrument() { setInstruments([...instruments, { id: Date.now().toString(), instrument: '', qty: 1, providedBy: 'venue', notes: '' }]) }
  function addBudgetLine() { setBudget([...budget, { id: Date.now().toString(), description: '', amount: 0, notes: '' }]) }

  const btnSave = 'bg-white rounded-xl py-4 items-center mt-6'

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen options={{
        title: 'Rider & RAB',
        headerRight: () => (
          <TouchableOpacity onPress={saveDoc} disabled={saving}>
            <Text className={`font-semibold text-sm ${saving ? 'text-neutral-500' : 'text-blue-400'}`}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Text>
          </TouchableOpacity>
        ),
      }} />

      <ScrollView className="flex-1 px-4 pt-4">
        {loading ? (
          <ActivityIndicator color="#fff" className="pt-20" />
        ) : (
          <>
            <Text className="text-white font-semibold text-base mb-3">Sound System</Text>
            {soundNeeds.map((sn, i) => (
              <View key={sn.id} className="flex-row items-start gap-2 mb-2">
                <TextInput className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Item" placeholderTextColor="#525252" value={sn.item} onChangeText={(v) => { const s = [...soundNeeds]; s[i].item = v; setSoundNeeds(s) }} />
                <TextInput className="w-14 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm text-center" placeholder="Qty" placeholderTextColor="#525252" keyboardType="numeric" value={sn.quantity.toString()} onChangeText={(v) => { const s = [...soundNeeds]; s[i].quantity = Number(v) || 0; setSoundNeeds(s) }} />
                {soundNeeds.length > 1 && (
                  <TouchableOpacity className="pt-2" onPress={() => setSoundNeeds(soundNeeds.filter((_, j) => j !== i))}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center gap-1 mb-6" onPress={addSoundNeed}>
              <Plus size={16} color="#3b82f6" />
              <Text className="text-blue-400 text-sm">Tambah item sound</Text>
            </TouchableOpacity>

            <Text className="text-white font-semibold text-base mb-3">Instrument</Text>
            {instruments.map((inst, i) => (
              <View key={inst.id} className="mb-2">
                <View className="flex-row items-start gap-2">
                  <TextInput className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Instrument" placeholderTextColor="#525252" value={inst.instrument} onChangeText={(v) => { const s = [...instruments]; s[i].instrument = v; setInstruments(s) }} />
                  <TextInput className="w-14 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm text-center" placeholder="Qty" placeholderTextColor="#525252" keyboardType="numeric" value={inst.qty.toString()} onChangeText={(v) => { const s = [...instruments]; s[i].qty = Number(v) || 0; setInstruments(s) }} />
                  {instruments.length > 1 && (
                    <TouchableOpacity className="pt-2" onPress={() => setInstruments(instruments.filter((_, j) => j !== i))}>
                      <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
                <View className="flex-row mt-1">
                  {(['band', 'venue'] as const).map((p) => (
                    <TouchableOpacity key={p} className={`px-3 py-1.5 rounded-lg mr-2 ${inst.providedBy === p ? 'bg-white' : 'bg-neutral-800'}`} onPress={() => { const s = [...instruments]; s[i].providedBy = p; setInstruments(s) }}>
                      <Text className={`text-xs font-medium ${inst.providedBy === p ? 'text-black' : 'text-neutral-400'}`}>{p === 'band' ? 'Dari Band' : 'Dari Venue'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center gap-1 mb-6" onPress={addInstrument}>
              <Plus size={16} color="#3b82f6" />
              <Text className="text-blue-400 text-sm">Tambah instrument</Text>
            </TouchableOpacity>

            <Text className="text-white font-semibold text-base mb-3">RAB (Budget)</Text>
            {budget.map((b, i) => (
              <View key={b.id} className="flex-row items-start gap-2 mb-2">
                <TextInput className="flex-[2] bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Deskripsi" placeholderTextColor="#525252" value={b.description} onChangeText={(v) => { const s = [...budget]; s[i].description = v; setBudget(s) }} />
                <TextInput className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Rp" placeholderTextColor="#525252" keyboardType="numeric" value={b.amount.toString()} onChangeText={(v) => { const s = [...budget]; s[i].amount = Number(v) || 0; setBudget(s) }} />
                {budget.length > 1 && (
                  <TouchableOpacity className="pt-2" onPress={() => setBudget(budget.filter((_, j) => j !== i))}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center gap-1 mb-6" onPress={addBudgetLine}>
              <Plus size={16} color="#3b82f6" />
              <Text className="text-blue-400 text-sm">Tambah baris budget</Text>
            </TouchableOpacity>

            <Text className="text-white font-semibold text-base mb-3">Catatan</Text>
            <TextInput className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm h-24" placeholder="Catatan rider..." placeholderTextColor="#525252" multiline value={notes} onChangeText={setNotes} textAlignVertical="top" />

            <TouchableOpacity className={`${btnSave} ${docId ? 'bg-neutral-800' : 'bg-white'}`} onPress={saveDoc}>
              <Text className={`font-semibold ${docId ? 'text-white' : 'text-black'}`}>
                {docId ? 'Update Rider' : 'Buat Rider'}
              </Text>
            </TouchableOpacity>

            {docId && (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 bg-neutral-800 rounded-xl py-4 mt-3"
                onPress={handleGeneratePdf}
              >
                <FileText size={18} color="#fff" />
                <Text className="text-white font-semibold">Generate PDF</Text>
              </TouchableOpacity>
            )}

            {doc?.pdfUrl && (
              <TouchableOpacity
                className="mt-3 mb-8 bg-neutral-900 border border-neutral-700 rounded-xl py-4 items-center"
                onPress={() => Linking.openURL(doc.pdfUrl!)}
              >
                <Text className="text-blue-400 text-sm">Buka PDF</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}
