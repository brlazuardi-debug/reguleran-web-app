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
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
          <Icon size={32} className="text-neutral-400 dark:text-neutral-500" />
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
