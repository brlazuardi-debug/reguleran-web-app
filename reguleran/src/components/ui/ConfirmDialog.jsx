import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin?',
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  loading = false,
  variant = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-neutral-600 dark:text-neutral-400" />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
          {message}
        </p>
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

export { ConfirmDialog }
