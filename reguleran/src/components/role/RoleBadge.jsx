import { Music, Guitar, Piano, Drum, Mic2 } from 'lucide-react'
import { Badge } from '../ui/Badge'

const ROLE_MAP = {
  guitar: { icon: Guitar, label: 'Gitaris' },
  bass: { icon: Music, label: 'Bassist' },
  keyboard: { icon: Piano, label: 'Keyboardist' },
  drums: { icon: Drum, label: 'Drummer' },
  vocal: { icon: Mic2, label: 'Vokalis' },
}

export default function RoleBadge({ role, size = 'sm', ...props }) {
  const config = ROLE_MAP[role]
  if (!config) return null
  const Icon = config.icon
  return (
    <Badge variant="default" size={size} {...props}>
      <Icon size={size === 'sm' ? 12 : 14} className="inline mr-1" />
      {config.label}
    </Badge>
  )
}
