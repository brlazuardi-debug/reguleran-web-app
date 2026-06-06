const variants = {
  default: 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800',
  ghost: 'bg-transparent border-transparent',
  surface: 'bg-surface-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800',
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
        rounded-xl border
        ${padding ? 'p-4 sm:p-5' : ''}
        transition-all duration-200
        ${variants[variant]}
        ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
