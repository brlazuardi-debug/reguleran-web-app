export default function TabViewer({ tabText, title }) {
  if (!tabText) return null

  const lines = tabText.split('\n')

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{title}</p>
      )}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 overflow-x-auto">
        <pre className="font-mono text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">{line}</div>
          ))}
        </pre>
      </div>
    </div>
  )
}
