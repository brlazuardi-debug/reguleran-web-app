const variants = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-white/[0.06] dark:border dark:border-white/[0.08] dark:text-neutral-300',
  primary: 'bg-neutral-200 text-neutral-800 dark:bg-white/[0.10] dark:border dark:border-white/[0.15] dark:text-white',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:border dark:border-emerald-500/20 dark:text-emerald-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:border dark:border-red-500/20 dark:text-red-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:border dark:border-amber-500/20 dark:text-amber-400',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px] rounded',
  md: 'px-2 py-0.5 text-xs rounded-md',
  lg: 'px-2.5 py-1 text-sm rounded-md',
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
        inline-flex items-center gap-1 font-mono font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
      )}
      {children}
    </span>
  )
}

export { Badge }
