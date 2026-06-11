import { forwardRef } from 'react'

const variants = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:active:bg-neutral-400',
  secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
  outline: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
  ghost: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800',
  danger: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300',
  gradient: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

const Button = forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out
        active:scale-[0.97]
        disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={16} strokeWidth={2} />
      ) : null}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon size={16} strokeWidth={2} />
      ) : null}
    </button>
  )
})

export { Button }
