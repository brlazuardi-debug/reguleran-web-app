function Toggle({ checked, onChange, label, id }) {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={toggleId} className="inline-flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          id={toggleId}
          type="checkbox"
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-10 h-6 rounded-full transition-all duration-200
          ${checked
            ? 'bg-primary-600 dark:bg-primary-500'
            : 'bg-stone-300 dark:bg-stone-700'
          }
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/30
        `}>
          <div className={`
            w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200
            absolute top-1 left-1
            ${checked ? 'translate-x-4' : ''}
          `} />
        </div>
      </div>
      {label && (
        <span className="text-sm text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}

export { Toggle }
