import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea({
  label,
  error,
  helperText,
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
      <textarea
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm
          text-stone-900 placeholder:text-stone-400
          transition-all duration-200 resize-y min-h-[80px]
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
          dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500
          dark:focus:ring-primary-400/20
          ${error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-700'
            : 'border-stone-300 dark:border-stone-700'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-stone-400 dark:text-stone-500">{helperText}</p>
      )}
    </div>
  )
})

export { Textarea }
