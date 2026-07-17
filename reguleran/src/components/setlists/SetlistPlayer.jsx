import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ChordDisplay from '../songs/ChordDisplay'
import TransposeSlider from '../songs/TransposeSlider'
import { Button } from '../ui/Button'

export default function SetlistPlayer({ songs }) {
  const [index, setIndex] = useState(0)
  const [transpose, setTranspose] = useState(0)
  const current = songs[index]

  if (!current || songs.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-900 dark:text-white">{current.title}</span>
          {current.artist && <span>— {current.artist}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="secondary" icon={ChevronLeft} disabled={index === 0} onClick={() => { setIndex(index - 1); setTranspose(0) }} />
          <span className="text-xs text-neutral-400 px-2">{index + 1}/{songs.length}</span>
          <Button size="sm" variant="secondary" icon={ChevronRight} disabled={index >= songs.length - 1} onClick={() => { setIndex(index + 1); setTranspose(0) }} />
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <TransposeSlider value={transpose} onChange={setTranspose} />
      </div>
      <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
        <ChordDisplay lyrics={current.lyrics} transpose={transpose} sections={current.sections || []} />
      </div>
    </div>
  )
}
