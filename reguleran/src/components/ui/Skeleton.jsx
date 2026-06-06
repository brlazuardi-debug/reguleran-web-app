function Skeleton({ className = '', variant = 'text' }) {
  const base = 'bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800 bg-[length:200%_100%] animate-shimmer rounded-lg'

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
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-5">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

export { Skeleton, SkeletonCard }
