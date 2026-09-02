const variants = {
  default: 'bg-white dark:bg-[#13161B] border-neutral-200 dark:border-white/[0.08] shadow-sm',
  ghost: 'bg-transparent border-transparent',
  surface: 'bg-neutral-50 dark:bg-[#191c21] border-neutral-200 dark:border-white/[0.08]',
  glass: 'bg-white/70 dark:bg-[#13161B]/80 backdrop-blur-xl border-neutral-200/50 dark:border-white/[0.08] shadow-lg',
  gradient: 'bg-white dark:bg-[#13161B] border-neutral-200 dark:border-white/[0.08] shadow-sm',
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
        ${padding ? 'p-5 sm:p-6' : ''}
        transition-all duration-200
        ${variants[variant]}
        ${hover ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-white/[0.20] cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
