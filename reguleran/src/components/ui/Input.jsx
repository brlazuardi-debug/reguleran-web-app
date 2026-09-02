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
        <label htmlFor={inputId} className="block text-xs font-mono font-medium text-neutral-700 dark:text-[#c4c7ca] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={16} className="text-neutral-400 dark:text-[#8e9192]" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border bg-white px-3.5 py-2 text-sm
            text-neutral-900 placeholder:text-neutral-400
            transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30
            dark:bg-[#13161B] dark:text-white dark:placeholder:text-[#8e9192]
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-neutral-300 dark:border-white/[0.08]'
            }
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-mono">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-neutral-400 dark:text-[#8e9192] font-mono">{helperText}</p>
      )}
    </div>
  )
})

export { Input }
