function Tabs({ items = [], active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl ${className}`}>
      {items.map(item => {
        const value = typeof item === 'string' ? item : item.value
        const label = typeof item === 'string' ? item : item.label
        const Icon = item.icon
        const isActive = active === value

        return (
          <button
            key={value}
            onClick={() => onChange?.(value)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
              transition-all duration-200
              ${isActive
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }
            `}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs }
