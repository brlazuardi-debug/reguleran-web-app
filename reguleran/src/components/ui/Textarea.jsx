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
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm
          text-neutral-900 placeholder:text-neutral-400
          transition-all duration-200 resize-y min-h-[80px]
          focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500
          dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500
          dark:focus:ring-neutral-400/20
          ${error
            ? 'border-neutral-400 focus:border-neutral-600 focus:ring-neutral-600/30 dark:border-neutral-600'
            : 'border-neutral-300 dark:border-neutral-700'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">{helperText}</p>
      )}
    </div>
  )
})

export { Textarea }
