const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const FLAT_TO_SHARP = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
}

function noteToIndex(note) {
  const normalized = FLAT_TO_SHARP[note] || note
  return NOTES.indexOf(normalized)
}

function indexToNote(index) {
  return NOTES[((index % 12) + 12) % 12]
}

export function transposeNote(note, semitones) {
  const idx = noteToIndex(note)
  if (idx === -1) return note
  return indexToNote(idx + semitones)
}

export function transposeChord(chord, semitones) {
  if (!chord) return chord
  const slashMatch = chord.match(/^(.*)\/([A-G][#b]?)$/)
  if (slashMatch) {
    const main = transposeChord(slashMatch[1], semitones)
    const bass = transposeNote(slashMatch[2], semitones)
    return `${main}/${bass}`
  }
  const match = chord.match(/^([A-G])([#b])?(.*)$/)
  if (!match) return chord
  const [, root, accidental, rest] = match
  const note = root + (accidental || '')
  const transposed = transposeNote(note, semitones)
  return transposed + rest
}

export function transposeLyrics(lyrics, semitones) {
  if (!lyrics) return ''
  return lyrics.replace(/\[([^\]]+)\]/g, (match, chord) => {
    return `[${transposeChord(chord.trim(), semitones)}]`
  })
}

export function parseChordLine(line) {
  const chords = []
  const regex = /\[([^\]]+)\]/g
  let match
  while ((match = regex.exec(line)) !== null) {
    chords.push({ chord: match[1], index: match.index })
  }
  return chords
}

export function stripChordNotation(text) {
  if (!text) return ''
  return text.replace(/\[([^\]]+)\]/g, '').trim()
}

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
