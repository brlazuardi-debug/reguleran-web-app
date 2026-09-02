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
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider bg-white/[0.08] border border-white/[0.12] text-white"
      {...props}
    >
      <Icon size={size === 'sm' ? 11 : 13} className="text-white/80" />
      {config.label}
    </span>
  )
}
