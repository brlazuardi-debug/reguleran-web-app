import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin?',
  confirmText = 'Ya, hapus',
  cancelText = 'Batal',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">{title}</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">{message}</p>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

export { ConfirmDialog }
