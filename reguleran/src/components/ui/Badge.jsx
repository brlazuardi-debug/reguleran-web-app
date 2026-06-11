const variants = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  primary: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
  success: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
  danger: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
  warning: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
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
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
      )}
      {children}
    </span>
  )
}

export { Badge }
