import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => {
        if (e.target === overlayRef.current) onClose?.()
      }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md dark:bg-black/80" />
      <div
        className={`
          relative w-full ${sizes[size]} bg-white dark:bg-[#13161B]
          rounded-xl shadow-2xl animate-scale-in
          border border-neutral-200 dark:border-white/[0.08]
          max-h-[85vh] flex flex-col
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-white/[0.08]">
            <h2 className="text-base font-semibold font-display text-neutral-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-6 py-4 flex-1 scrollbar-custom">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-100 dark:border-white/[0.08] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export { Modal }
