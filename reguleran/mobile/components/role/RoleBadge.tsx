import { View, Text } from 'react-native'
import type { InstrumentRole } from '../../types'

const ROLE_COLORS: Record<InstrumentRole, string> = {
  guitar: '#3b82f6',
  bass: '#a855f7',
  keyboard: '#22c55e',
  drums: '#ef4444',
  vocal: '#f59e0b',
}

const ROLE_LABELS: Record<InstrumentRole, string> = {
  guitar: 'Gitar',
  bass: 'Bass',
  keyboard: 'Keyboard',
  drums: 'Drum',
  vocal: 'Vokal',
}

interface RoleBadgeProps {
  role: InstrumentRole
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <View
      className="rounded-lg px-2.5 py-1"
      style={{ backgroundColor: ROLE_COLORS[role] + '20', borderColor: ROLE_COLORS[role], borderWidth: 1 }}
    >
      <Text style={{ color: ROLE_COLORS[role] }} className="text-xs font-semibold">
        {ROLE_LABELS[role]}
      </Text>
    </View>
  )
}
