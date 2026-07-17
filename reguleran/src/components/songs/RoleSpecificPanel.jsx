import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useActiveRole } from '../../hooks/useActiveRole'
import useViewPreferencesStore from '../../stores/viewPreferencesStore'
import TabViewer from '../tabs/TabViewer'
const ROLE_LABELS = {
  guitar: 'Gitar',
  bass: 'Bass',
  keyboard: 'Keyboard',
  drums: 'Drum',
  vocal: 'Vokal',
}

function RoleNotesContent({ roleKey, roleNotes }) {
  if (!roleNotes) return null

  const items = []

  if (roleKey === 'drums') {
    if (roleNotes.pattern) items.push({ label: 'Pattern', value: roleNotes.pattern })
    if (roleNotes.dynamics) items.push({ label: 'Dinamika', value: roleNotes.dynamics })
  }
  if (roleKey === 'guitar' || roleKey === 'keyboard') {
    if (roleNotes.chordVoicing) items.push({ label: 'Voicing', value: roleNotes.chordVoicing })
  }
  if (roleKey === 'vocal') {
    if (roleNotes.harmony) items.push({ label: 'Harmoni', value: roleNotes.harmony })
    if (roleNotes.breathMarks?.length) {
      items.push({ label: 'Napas di baris', value: roleNotes.breathMarks.join(', ') })
    }
  }
  if (roleKey === 'guitar' || roleKey === 'bass') {
    if (roleNotes.tabReference) items.push({ label: 'Tab', value: roleNotes.tabReference })
  }
  if (roleNotes.notes) items.push({ label: 'Catatan', value: roleNotes.notes })

  if (items.length === 0) return null

  return (
    <div className="space-y-1.5 mt-2">
      {items.map((item) => {
        if (item.label === 'Tab') {
          return <TabViewer key={item.label} tabText={item.value} title={item.label} />
        }
        return (
          <div key={item.label} className="text-xs">
            <span className="font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {item.label}:
            </span>{' '}
            <span className="text-neutral-700 dark:text-neutral-300">{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function RoleSpecificPanel({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const activeRole = useActiveRole()
  const { showAllRoles } = useViewPreferencesStore()

  if (!section.roleNotes) return null

  const rolesToShow = showAllRoles
    ? Object.keys(section.roleNotes).filter((k) => section.roleNotes[k])
    : activeRole && section.roleNotes[activeRole]
      ? [activeRole]
      : []

  if (rolesToShow.length === 0) return null

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          Catatan Peran
        </span>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          ({rolesToShow.map((r) => ROLE_LABELS[r]).join(', ')})
        </span>
      </button>
      {open && (
        <div className="px-3 py-2 space-y-2">
          {rolesToShow.map((roleKey) => (
            <div key={roleKey}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {ROLE_LABELS[roleKey]}
                </span>
                <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <RoleNotesContent roleKey={roleKey} roleNotes={section.roleNotes[roleKey]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
