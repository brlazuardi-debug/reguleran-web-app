function Toggle({ checked, onChange, label, disabled = false, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-10 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 peer-checked:bg-neutral-800 dark:peer-checked:bg-neutral-200 transition-colors duration-200" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform duration-200" />
      </div>
      {label && <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>}
    </label>
  )
}

export { Toggle }
