import { transposeLyrics } from '../../utils/transpose'
import SongSectionBadge from './SongSectionBadge'

// ponytail: filterByRole hides sections that have no roleNotes for the active role
export default function ChordDisplay({ lyrics, transpose = 0, sections = [], filterByRole = null }) {
  if (!lyrics) {
    return <p className="text-stone-400 dark:text-stone-500 italic">Tidak ada lirik</p>
  }

  const sectionMap = {}
  sections.forEach((s) => {
    sectionMap[s.startLine] = s
  })

  const filteredLines = {}
  if (filterByRole) {
    sections.forEach((s) => {
      if (s.roleNotes?.[filterByRole]) {
        filteredLines[s.startLine] = true
      }
    })
  }

  const transposedLyrics = transposeLyrics(lyrics, transpose)
  const lines = transposedLyrics.split('\n')

  const isSectionHidden = (section) => filterByRole && section && !filteredLines[section.startLine]

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        const section = sectionMap[i]
        if (isSectionHidden(section)) return null
        const chordSpans = line.split(/(\[[^\]]+\])/g)

        return (
          <div key={i}>
            {section && (
              <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                <SongSectionBadge label={section.label} customLabel={section.customLabel} />
                <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>
            )}
            <div className="flex flex-wrap mb-1">
              {chordSpans.map((part, j) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  const chord = part.slice(1, -1)
                  return (
                    <span
                      key={j}
                      className={transpose !== 0 ? 'chord-transposed' : 'chord'}
                    >
                      {chord}{' '}
                    </span>
                  )
                }
                return <span key={j} className="text-stone-600 dark:text-stone-400">{part}</span>
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
