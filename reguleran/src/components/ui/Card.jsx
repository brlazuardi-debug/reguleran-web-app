const variants = {
  default: 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm',
  ghost: 'bg-transparent border-transparent',
  surface: 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800',
  glass: 'bg-white/70 dark:bg-white/5 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-lg',
  gradient: 'bg-white dark:bg-neutral-900 border-transparent shadow-sm',
}

function Card({
  variant = 'default',
  hover = false,
  padding = true,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl border
        ${padding ? 'p-5 sm:p-6' : ''}
        transition-all duration-300
        ${variants[variant]}
        ${hover ? 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer' : ''}
        ${variant === 'gradient' ? "bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950" : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
