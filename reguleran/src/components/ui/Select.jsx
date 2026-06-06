import { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label,
  error,
  options = [],
  placeholder,
  className = '',
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm
          text-stone-900
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
          dark:bg-stone-900 dark:text-stone-100
          dark:focus:ring-primary-400/20
          ${error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-700'
            : 'border-stone-300 dark:border-stone-700'
          }
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={value} value={value}>{label}</option>
        })}
      </select>
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  )
})

export { Select }
