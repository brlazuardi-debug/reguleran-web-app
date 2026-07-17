const SECTION_STYLES = {
  intro: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  verse: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300',
  chorus: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200',
  bridge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  ending: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300',
  outro: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  interlude: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300',
}

const SECTION_LABELS = {
  intro: 'Intro',
  verse: 'Verse',
  chorus: 'Chorus',
  bridge: 'Bridge',
  ending: 'Ending',
  outro: 'Outro',
  interlude: 'Interlude',
}

export default function SongSectionBadge({ label, customLabel, size = 'sm' }) {
  const style = SECTION_STYLES[label] || SECTION_STYLES.verse
  const displayLabel = customLabel || SECTION_LABELS[label] || label
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md uppercase tracking-wider ${style} ${sizeClasses}`}
    >
      {displayLabel}
    </span>
  )
}

export { SECTION_LABELS, SECTION_STYLES }
