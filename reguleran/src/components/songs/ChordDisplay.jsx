import { transposeLyrics } from '../../utils/transpose'

export default function ChordDisplay({ lyrics, transpose = 0 }) {
  if (!lyrics) {
    return <p className="text-stone-400 dark:text-stone-500 italic">Tidak ada lirik</p>
  }

  const transposedLyrics = transposeLyrics(lyrics, transpose)
  const lines = transposedLyrics.split('\n')

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        const chordSpans = line.split(/(\[[^\]]+\])/g)

        return (
          <div key={i} className="mb-1">
            <div className="flex flex-wrap">
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
