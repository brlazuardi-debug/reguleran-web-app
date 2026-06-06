const variants = {
  default: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  children,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-lg
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-emerald-500' :
          variant === 'danger' ? 'bg-rose-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'primary' ? 'bg-primary-500' :
          'bg-stone-400'
        }`} />
      )}
      {children}
    </span>
  )
}

export { Badge }
