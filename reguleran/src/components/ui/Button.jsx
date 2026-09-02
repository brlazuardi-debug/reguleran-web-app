import { forwardRef } from 'react'

const variants = {
  primary: 'bg-white text-[#08090A] hover:bg-neutral-200 active:bg-neutral-300 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.12)] border border-transparent',
  secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-[#1d2025] dark:text-neutral-100 dark:hover:bg-[#272a2f] dark:border dark:border-white/[0.12]',
  outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 dark:border-white/[0.15] dark:text-neutral-200 dark:hover:bg-white/[0.06] dark:hover:text-white',
  ghost: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/[0.06]',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-500/20 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/20',
  gradient: 'bg-white text-[#08090A] hover:bg-neutral-200 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.12)]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-6 py-2.5 text-base gap-2.5 rounded-xl',
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
