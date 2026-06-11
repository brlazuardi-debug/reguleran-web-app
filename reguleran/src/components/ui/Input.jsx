import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={16} className="text-neutral-400 dark:text-neutral-500" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-sm
            text-neutral-900 placeholder:text-neutral-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500
            dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500
            dark:focus:ring-neutral-400/20
            ${error
              ? 'border-neutral-400 focus:border-neutral-600 focus:ring-neutral-600/30 dark:border-neutral-600'
              : 'border-neutral-300 dark:border-neutral-700'
            }
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">{helperText}</p>
      )}
    </div>
  )
})

export { Input }
