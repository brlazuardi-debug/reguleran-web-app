function PageHeader({ title, description, actions, badge, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            {badge}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export { PageHeader }
