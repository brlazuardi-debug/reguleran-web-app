/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'

const ToastContext = createContext(undefined)

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
  error: 'bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
  info: 'bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
}

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, message }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(t => {
          const Icon = icons[t.type] || icons.info
          return (
            <div
              key={t.id}
              className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
                animate-slide-up
                ${colors[t.type]}
              `}
            >
              <Icon size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
