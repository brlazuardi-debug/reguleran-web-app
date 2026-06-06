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
        <label htmlFor={inputId} className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={16} className="text-stone-400 dark:text-stone-500" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-sm
            text-stone-900 placeholder:text-stone-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
            dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500
            dark:focus:ring-primary-400/20
            ${error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-700'
              : 'border-stone-300 dark:border-stone-700'
            }
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-stone-400 dark:text-stone-500">{helperText}</p>
      )}
    </div>
  )
})

export { Input }
