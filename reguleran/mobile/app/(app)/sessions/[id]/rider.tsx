import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Plus, X, FileText, Share, Save } from 'lucide-react-native'
import { useApi } from '../../../../hooks/useApi'
import type { EventDocument, SoundNeeds, InstrumentNeed, BudgetItem, InstrumentRole } from '../../../../types'

interface MicRequirement {
  type: string
  qty: number
}

interface BudgetLine {
  id: string
  category: string
  description: string
  qty: number
  unitPrice: number
  subtotal: number
}

const ROLE_OPTIONS: InstrumentRole[] = ['guitar', 'bass', 'keyboard', 'drums', 'vocal']
const ROLE_LABELS: Record<InstrumentRole, string> = { guitar: 'Gitar', bass: 'Bass', keyboard: 'Keyboard', drums: 'Drum', vocal: 'Vokal' }
const PRESET_ITEMS: Record<InstrumentRole, string[]> = {
  guitar: ['Ampli 50W', 'DI Box', 'Gitar Cadangan', 'Tuner', 'Kabel Jack'],
  bass: ['Ampli Bass 100W', 'DI Box', 'Bass Cadangan', 'Tuner', 'Kabel Jack'],
  keyboard: ['Keyboard Stand', 'Ampli Keyboard', 'Kabel Power', 'Kabel Audio', 'Kursi'],
  drums: ['Drum Kit Lengkap', 'Kursi Drum', 'Cymbal Stand', 'Hi-hat Stand', 'Kick Pedal'],
  vocal: ['Mic Stand', 'Pop Filter', 'Monitor Kecil', 'Kabel XLR'],
}
const BUDGET_CATEGORIES = ['Transport', 'Konsumsi', 'Sewa Alat', 'Fee Player', 'Dokumentasi', 'Lainnya']

export default function RiderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { execute, loading } = useApi<EventDocument>()
  const [doc, setDoc] = useState<EventDocument | null>(null)
  const [docId, setDocId] = useState<string | null>(null)
  const [channels, setChannels] = useState('')
  const [monitors, setMonitors] = useState('')
  const [mics, setMics] = useState<MicRequirement[]>([])
  const [soundNotes, setSoundNotes] = useState('')
  const [instruments, setInstruments] = useState<InstrumentNeed[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetLine[]>([])
  const [budgetNotes, setBudgetNotes] = useState('')
  const [stageLayoutNotes, setStageLayoutNotes] = useState('')
  const [soundcheckTime, setSoundcheckTime] = useState('')
  const [powerNeeds, setPowerNeeds] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchDoc() }, [id])

  const budgetTotal = budgetItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)

  async function fetchDoc() {
    const list = await execute(`/eventDocuments?sessionId=${id}`)
    if (list && Array.isArray(list) && list.length > 0) {
      const d = list[0]
      setDoc(d)
      setDocId(d.id)
      const sn: SoundNeeds = d.soundNeeds || {}
      setChannels(sn.channels ? String(sn.channels) : '')
      setMonitors(sn.monitors ? String(sn.monitors) : '')
      setMics(sn.mics || [])
      setSoundNotes(sn.notes || '')
      setInstruments(d.instrumentNeeds || [])
      setBudgetItems((d.budgetItems || []).map((b: BudgetItem) => ({ ...b })))
      setBudgetNotes(d.budgetNotes || '')
      setStageLayoutNotes(d.stageLayoutNotes || '')
      setSoundcheckTime(d.soundcheckTime || '')
      setPowerNeeds(d.powerNeeds || '')
    }
  }

  async function saveDoc() {
    setSaving(true)
    const body = {
      soundNeeds: { channels: channels ? Number(channels) : null, monitors: monitors ? Number(monitors) : null, mics, notes: soundNotes || null },
      instrumentNeeds: instruments,
      stageLayoutNotes: stageLayoutNotes || null,
      soundcheckTime: soundcheckTime || null,
      powerNeeds: powerNeeds || null,
      budgetItems,
      budgetTotal,
      budgetNotes: budgetNotes || null,
      sessionId: id,
    }
    let created: EventDocument | null = null
    if (docId) {
      created = await execute(`/eventDocuments/${docId}`, { method: 'PUT', body })
    } else {
      created = await execute('/eventDocuments', { method: 'POST', body })
      if (created) {
        setDoc(created)
        setDocId(created.id)
      }
    }
    setSaving(false)
    if (!created) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan rider')
    } else {
      Alert.alert('Berhasil', 'Rider disimpan')
    }
  }

  async function handleGeneratePdf() {
    if (!docId) {
      Alert.alert('Simpan dulu', 'Simpan rider dulu sebelum generate PDF')
      return
    }
    const data = await execute(`/eventDocuments/${docId}/generate-pdf`, { method: 'POST' })
    if (data && (data as any).pdfUrl) {
      setDoc({ ...doc!, pdfUrl: (data as any).pdfUrl })
      Linking.openURL((data as any).pdfUrl)
    }
  }

  function addMic() { setMics([...mics, { type: '', qty: 1 }]) }
  function toggleRole(role: InstrumentRole) {
    if (instruments.some((i) => i.role === role)) {
      setInstruments(instruments.filter((i) => i.role !== role))
    } else {
      setInstruments([...instruments, { role, items: [], notes: '' }])
    }
  }
  function toggleItem(idx: number, item: string) {
    const updated = instruments.map((inst, i) => {
      if (i !== idx) return inst
      const items = inst.items.includes(item) ? inst.items.filter((x) => x !== item) : [...inst.items, item]
      return { ...inst, items }
    })
    setInstruments(updated)
  }
  function addBudgetLine() { setBudgetItems([...budgetItems, { id: Date.now().toString(), category: BUDGET_CATEGORIES[0], description: '', qty: 1, unitPrice: 0, subtotal: 0 }]) }

  const inputCls = 'bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm'
  const labelCls = 'text-white font-semibold text-base mb-3'

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
            <Text className={labelCls}>Sound System</Text>
            <View className="flex-row gap-2 mb-2">
              <TextInput className={`${inputCls} flex-1`} placeholder="Jumlah Channel" placeholderTextColor="#525252" keyboardType="numeric" value={channels} onChangeText={setChannels} />
              <TextInput className={`${inputCls} flex-1`} placeholder="Jumlah Monitor" placeholderTextColor="#525252" keyboardType="numeric" value={monitors} onChangeText={setMonitors} />
            </View>

            <Text className="text-neutral-400 text-sm mt-2 mb-2">Microphone</Text>
            {mics.map((m, i) => (
              <View key={i} className="flex-row items-center gap-2 mb-2">
                <TextInput className={`${inputCls} flex-1`} placeholder="SM58 Dynamic" placeholderTextColor="#525252" value={m.type} onChangeText={(v) => { const s = [...mics]; s[i].type = v; setMics(s) }} />
                <TextInput className="w-14 text-center" placeholder="Qty" placeholderTextColor="#525252" keyboardType="numeric" value={String(m.qty)} onChangeText={(v) => { const s = [...mics]; s[i].qty = Number(v) || 1; setMics(s) }} />
                <TouchableOpacity className="pt-2" onPress={() => setMics(mics.filter((_, j) => j !== i))}>
                  <X size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center gap-1 mb-4" onPress={addMic}>
              <Plus size={16} color="#3b82f6" />
              <Text className="text-blue-400 text-sm">Tambah mic</Text>
            </TouchableOpacity>

            <TextInput className={`${inputCls} h-20 mb-6`} placeholder="Catatan sound..." placeholderTextColor="#525252" multiline value={soundNotes} onChangeText={setSoundNotes} textAlignVertical="top" />

            <Text className={labelCls}>Instrument</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {ROLE_OPTIONS.map((role) => {
                const active = instruments.some((i) => i.role === role)
                return (
                  <TouchableOpacity
                    key={role}
                    className={`px-4 py-2 rounded-xl ${active ? 'bg-white' : 'bg-neutral-800'}`}
                    onPress={() => toggleRole(role)}
                  >
                    <Text className={`text-sm font-medium ${active ? 'text-black' : 'text-neutral-400'}`}>
                      {active ? `✓ ${ROLE_LABELS[role]}` : `+ ${ROLE_LABELS[role]}`}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {instruments.map((inst, idx) => (
              <View key={inst.role} className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-semibold text-sm capitalize">{ROLE_LABELS[inst.role]}</Text>
                  <TouchableOpacity onPress={() => toggleRole(inst.role)}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-1.5 mb-2">
                  {PRESET_ITEMS[inst.role].map((item) => (
                    <TouchableOpacity
                      key={item}
                      className={`px-2.5 py-1 rounded-lg ${inst.items.includes(item) ? 'bg-white' : 'bg-neutral-800'}`}
                      onPress={() => toggleItem(idx, item)}
                    >
                      <Text className={`text-xs font-medium ${inst.items.includes(item) ? 'text-black' : 'text-neutral-400'}`}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput className={`${inputCls} mt-1`} placeholder="Catatan kebutuhan khusus..." placeholderTextColor="#525252" value={inst.notes || ''} onChangeText={(v) => { const s = [...instruments]; s[idx] = { ...s[idx], notes: v }; setInstruments(s) }} />
              </View>
            ))}
            {instruments.length === 0 && (
              <Text className="text-neutral-500 text-sm mb-4">Pilih instrumen untuk menambah kebutuhan alat.</Text>
            )}

            <Text className={labelCls}>Stage & Jadwal</Text>
            <TextInput className={`${inputCls} h-20 mb-2`} placeholder="Catatan layout panggung..." placeholderTextColor="#525252" multiline value={stageLayoutNotes} onChangeText={setStageLayoutNotes} textAlignVertical="top" />
            <TextInput className={`${inputCls} mb-2`} placeholder="Jam soundcheck (mis: 13:00)" placeholderTextColor="#525252" value={soundcheckTime} onChangeText={setSoundcheckTime} />
            <TextInput className={`${inputCls} mb-6`} placeholder="Kebutuhan listrik/power..." placeholderTextColor="#525252" value={powerNeeds} onChangeText={setPowerNeeds} />

            <Text className={labelCls}>RAB (Budget)</Text>
            {budgetItems.map((b, i) => (
              <View key={b.id} className="mb-2">
                <View className="flex-row items-center gap-2">
                  <TextInput className={`${inputCls} flex-[2]`} placeholder="Deskripsi" placeholderTextColor="#525252" value={b.description} onChangeText={(v) => { const s = [...budgetItems]; s[i] = { ...s[i], description: v }; setBudgetItems(s) }} />
                  <TouchableOpacity className="pt-2" onPress={() => setBudgetItems(budgetItems.filter((_, j) => j !== i))}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="flex-1">
                    <TextInput className={`${inputCls}`} placeholder="Kategori" placeholderTextColor="#525252" value={b.category} onChangeText={(v) => { const s = [...budgetItems]; s[i] = { ...s[i], category: v }; setBudgetItems(s) }} />
                  </View>
                  <TextInput className="w-12 text-center" placeholder="Qty" placeholderTextColor="#525252" keyboardType="numeric" value={String(b.qty)} onChangeText={(v) => {
                    const s = [...budgetItems]
                    const qty = Number(v) || 0
                    s[i] = { ...s[i], qty, subtotal: qty * (s[i].unitPrice || 0) }
                    setBudgetItems(s)
                  }} />
                  <TextInput className="w-20 text-right" placeholder="Harga" placeholderTextColor="#525252" keyboardType="numeric" value={String(b.unitPrice)} onChangeText={(v) => {
                    const s = [...budgetItems]
                    const unitPrice = Number(v) || 0
                    s[i] = { ...s[i], unitPrice, subtotal: (s[i].qty || 0) * unitPrice }
                    setBudgetItems(s)
                  }} />
                </View>
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center gap-1 mb-4" onPress={addBudgetLine}>
              <Plus size={16} color="#3b82f6" />
              <Text className="text-blue-400 text-sm">Tambah baris budget</Text>
            </TouchableOpacity>
            <View className="flex-row justify-between bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 mb-2">
              <Text className="text-white font-semibold text-sm">Total</Text>
              <Text className="text-white font-semibold text-sm">Rp {budgetTotal.toLocaleString('id-ID')}</Text>
            </View>
            <TextInput className={`${inputCls} h-20 mb-6`} placeholder="Catatan anggaran..." placeholderTextColor="#525252" multiline value={budgetNotes} onChangeText={setBudgetNotes} textAlignVertical="top" />

            <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-white rounded-xl py-4 mb-3" onPress={saveDoc}>
              <Save size={18} color="#000" />
              <Text className="text-black font-semibold">{docId ? 'Update Rider' : 'Buat Rider'}</Text>
            </TouchableOpacity>

            {docId && (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 bg-neutral-800 rounded-xl py-4 mb-3"
                onPress={handleGeneratePdf}
              >
                <FileText size={18} color="#fff" />
                <Text className="text-white font-semibold">Generate PDF</Text>
              </TouchableOpacity>
            )}

            {doc?.pdfUrl && (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl py-4 mb-8"
                onPress={() => Linking.openURL(doc.pdfUrl!)}
              >
                <Share size={18} color="#3b82f6" />
                <Text className="text-blue-400 text-sm">Buka PDF</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}
