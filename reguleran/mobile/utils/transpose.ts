// ponytail: copied from src/utils/transpose.js (web app), ported to TS

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
}

export function transposeNote(note: string, semitones: number): string {
  const normalized = FLAT_TO_SHARP[note] || note
  const idx = NOTES.indexOf(normalized)
  if (idx === -1) return note
  return NOTES[(idx + semitones + 12) % 12]
}

export function transposeChord(chord: string, semitones: number): string {
  const slashIdx = chord.indexOf('/')
  if (slashIdx !== -1) {
    const root = chord.slice(0, slashIdx)
    const bass = chord.slice(slashIdx + 1)
    return transposeChord(root, semitones) + '/' + transposeNote(bass, semitones)
  }
  const m = chord.match(/^([A-G])([#b])?(.*)$/)
  if (!m) return chord
  const root = m[1] + (m[2] || '')
  const rest = m[3] || ''
  return transposeNote(root, semitones) + rest
}

export function transposeLyrics(lyrics: string, semitones: number): string {
  return lyrics.replace(/\[([^\]]+)\]/g, (_, chord: string) => {
    return '[' + transposeChord(chord.trim(), semitones) + ']'
  })
}

export function parseChordLine(line: string): { chord: string; index: number }[] {
  const result: { chord: string; index: number }[] = []
  const re = /\[([^\]]+)\]/g
  let m
  while ((m = re.exec(line)) !== null) {
    result.push({ chord: m[1], index: m.index })
  }
  return result
}

export function stripChordNotation(text: string): string {
  return text.replace(/\[[^\]]*\]/g, '')
}

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
