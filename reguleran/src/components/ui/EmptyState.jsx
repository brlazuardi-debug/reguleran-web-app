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
        <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
          <Icon size={32} className="text-stone-400 dark:text-stone-500" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
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
