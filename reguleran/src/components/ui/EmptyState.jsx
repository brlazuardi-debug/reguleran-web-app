function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center mb-4">
          <Icon size={26} className="text-neutral-400 dark:text-[#8e9192]" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
