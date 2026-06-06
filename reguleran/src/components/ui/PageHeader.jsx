function PageHeader({ title, description, actions, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
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
