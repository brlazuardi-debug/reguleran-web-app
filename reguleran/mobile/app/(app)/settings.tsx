import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import { useRoleStore, ROLE_OPTIONS } from '../../stores/useRoleStore'
import type { InstrumentRole } from '../../types'

const ROLE_LABELS: Record<InstrumentRole, string> = {
  guitar: '🎸 Gitar',
  bass: '🎸 Bass',
  keyboard: '🎹 Keyboard',
  drums: '🥁 Drum',
  vocal: '🎤 Vokal',
}

export default function SettingsScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { role, setRole } = useRoleStore()

  async function handleLogout() {
    await signOut()
    router.replace('/(auth)/login')
  }

  function handleRoleSelect(newRole: InstrumentRole) {
    setRole(newRole)
  }

  return (
    <View className="flex-1 bg-neutral-950">
      {/* Role */}
      <View className="px-4 py-6 border-b border-neutral-800 mt-4">
        <Text className="text-white font-semibold text-base mb-3">Instrument Role</Text>
        <View className="flex-row flex-wrap gap-2">
          {ROLE_OPTIONS.map((r) => (
            <TouchableOpacity
              key={r}
              className={`rounded-xl px-4 py-3 border ${role === r ? 'bg-white border-white' : 'border-neutral-700'}`}
              onPress={() => handleRoleSelect(r)}
            >
              <Text className={role === r ? 'text-black font-semibold' : 'text-neutral-400'}>
                {ROLE_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View className="px-4 pt-6">
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 py-4 bg-neutral-900 rounded-xl"
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 font-medium">Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
