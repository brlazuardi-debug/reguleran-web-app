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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60" />
      <div
        className={`
          relative w-full ${sizes[size]} bg-white dark:bg-stone-900
          rounded-2xl shadow-2xl animate-scale-in
          border border-stone-200 dark:border-stone-800
          max-h-[85vh] flex flex-col
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-stone-100 dark:border-stone-800">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-6 py-4 flex-1 scrollbar-custom">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export { Modal }
