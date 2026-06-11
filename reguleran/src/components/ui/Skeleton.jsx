function Skeleton({ className = '', variant = 'text' }) {
  const base = 'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 bg-[length:200%_100%] animate-shimmer rounded-xl'

  if (variant === 'card') {
    return (
      <div className={`${base} h-32 ${className}`} />
    )
  }

  if (variant === 'circle') {
    return (
      <div className={`${base} rounded-full ${className}`} />
    )
  }

  return (
    <div className={`${base} h-4 ${className}`} />
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
      <Skeleton className="h-5 w-2/3 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6">
          <Skeleton className="h-11 w-11 mb-4" />
          <Skeleton className="h-9 w-20 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonStats }
