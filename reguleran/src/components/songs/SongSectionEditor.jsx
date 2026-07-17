import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Tabs } from '../ui/Tabs'
import SongSectionBadge from './SongSectionBadge'
import { ROLE_OPTIONS } from '../../stores/roleStore'

const LABEL_OPTIONS = ['intro', 'verse', 'chorus', 'bridge', 'ending', 'outro', 'interlude']

const ROLE_TABS = ROLE_OPTIONS.map((r) => ({
  value: r,
  label: { guitar: 'Gitar', bass: 'Bass', keyboard: 'Keyboard', drums: 'Drum', vocal: 'Vokal' }[r],
}))

const DYNAMICS_OPTIONS = ['soft', 'medium', 'loud']

let nextId = 1

function createSection(startLine = 0) {
  return {
    id: String(nextId++),
    label: 'verse',
    startLine,
    customLabel: '',
    notes: '',
    roleNotes: {},
  }
}

function RoleTabContent({ roleKey, roleNotes, onChange }) {
  const update = (field, value) => {
    onChange({ ...roleNotes, [field]: value })
  }

  if (roleKey === 'drums') {
    return (
      <div className="space-y-2">
        <Input label="Pattern" value={roleNotes.pattern || ''} onChange={(e) => update('pattern', e.target.value)} placeholder="Misal: kick on 1 & 3, snare on 2 & 4" />
        <Select label="Dinamika" value={roleNotes.dynamics || ''} onChange={(e) => update('dynamics', e.target.value || undefined)} options={[{ value: '', label: '—' }, ...DYNAMICS_OPTIONS]} />
        <Textarea label="Catatan" value={roleNotes.notes || ''} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Catatan khusus drummer" />
      </div>
    )
  }

  if (roleKey === 'guitar' || roleKey === 'keyboard') {
    return (
      <div className="space-y-2">
        <Input label="Chord Voicing" value={roleNotes.chordVoicing || ''} onChange={(e) => update('chordVoicing', e.target.value)} placeholder="Misal: open position, barre di fret V" />
        <Textarea label="Catatan" value={roleNotes.notes || ''} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Catatan khusus" />
        {roleKey === 'guitar' && (
          <Input label="Referensi Tab" value={roleNotes.tabReference || ''} onChange={(e) => update('tabReference', e.target.value)} placeholder="Link atau nama file tab" />
        )}
      </div>
    )
  }

  if (roleKey === 'bass') {
    return (
      <div className="space-y-2">
        <Textarea label="Catatan" value={roleNotes.notes || ''} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Root notes, pattern, dll" />
        <Input label="Referensi Tab" value={roleNotes.tabReference || ''} onChange={(e) => update('tabReference', e.target.value)} placeholder="Link atau nama file tab" />
      </div>
    )
  }

  if (roleKey === 'vocal') {
    return (
      <div className="space-y-2">
        <Input label="Harmoni" value={roleNotes.harmony || ''} onChange={(e) => update('harmony', e.target.value)} placeholder="Misal: harmony 3rd di chorus" />
        <Input label="Tanda Napas (baris ke-)" value={roleNotes.breathMarks?.join(', ') || ''} onChange={(e) => update('breathMarks', e.target.value ? e.target.value.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n)) : [])} placeholder="0, 4, 8" />
        <Textarea label="Catatan" value={roleNotes.notes || ''} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Catatan khusus vokalis" />
      </div>
    )
  }

  return null
}

export default function SongSectionEditor({ lyrics = '', sections = [], onChange }) {
  const lineCount = lyrics ? lyrics.split('\n').length : 0

  const handleChange = (id, field, value) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    onChange(updated)
  }

  const handleRoleNotesChange = (id, roleNotes) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, roleNotes } : s))
    onChange(updated)
  }

  const handleRemove = (id) => {
    onChange(sections.filter((s) => s.id !== id))
  }

  const handleAdd = () => {
    const lastLine = sections.length > 0
      ? Math.min(sections[sections.length - 1].startLine + 1, Math.max(0, lineCount - 1))
      : 0
    onChange([...sections, createSection(lastLine)])
  }

  const sorted = [...sections].sort((a, b) => a.startLine - b.startLine)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Bagian Lagu
        </h3>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {lineCount} baris lirik
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
          Belum ada bagian. Tambahkan Intro, Verse, Chorus, dll.
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onFieldChange={(field, value) => handleChange(section.id, field, value)}
              onRoleNotesChange={(rn) => handleRoleNotesChange(section.id, rn)}
              onRemove={() => handleRemove(section.id)}
              lineCount={lineCount}
            />
          ))}
        </div>
      )}

      <Button variant="secondary" size="sm" icon={Plus} onClick={handleAdd}>
        Tambah Bagian
      </Button>
    </div>
  )
}

function SectionCard({ section, onFieldChange, onRoleNotesChange, onRemove, lineCount }) {
  const [expanded, setExpanded] = useState(false)
  const [roleTab, setRoleTab] = useState(ROLE_OPTIONS[0])

  const roleNotes = section.roleNotes || {}

  return (
    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="flex items-start gap-2 p-3">
        <div className="w-16 shrink-0">
          <Input
            label="Baris ke-"
            type="number"
            min={0}
            max={Math.max(0, lineCount - 1)}
            value={section.startLine}
            onChange={(e) => onFieldChange('startLine', parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Label"
                value={section.label}
                onChange={(e) => onFieldChange('label', e.target.value)}
                options={LABEL_OPTIONS}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Custom"
                value={section.customLabel}
                onChange={(e) => onFieldChange('customLabel', e.target.value)}
                placeholder="Verse 2"
              />
            </div>
          </div>
        </div>
        <div className="pt-5 shrink-0 flex flex-col items-center gap-1">
          <SongSectionBadge label={section.label} customLabel={section.customLabel} />
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="pt-3">
            <Tabs items={ROLE_TABS} active={roleTab} onChange={setRoleTab} />
          </div>
          <div className="mt-3">
            <RoleTabContent
              roleKey={roleTab}
              roleNotes={roleNotes[roleTab] || {}}
              onChange={(updated) => onRoleNotesChange({ ...roleNotes, [roleTab]: updated })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
