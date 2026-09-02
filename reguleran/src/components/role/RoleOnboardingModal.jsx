import { Guitar, Music, Piano, Drum, Mic2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import useRoleStore, { ROLE_OPTIONS } from '../../stores/roleStore'

const ROLE_CONFIG = {
  guitar: { icon: Guitar, label: 'Gitaris' },
  bass: { icon: Music, label: 'Bassist' },
  keyboard: { icon: Piano, label: 'Keyboardist' },
  drums: { icon: Drum, label: 'Drummer' },
  vocal: { icon: Mic2, label: 'Vokalis' },
}

export default function RoleOnboardingModal() {
  const { showOnboarding, setRole, skipOnboarding, loading } = useRoleStore()

  return (
    <Modal open={showOnboarding} onClose={skipOnboarding} title="Pilih Peran Anda" size="sm">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
        Pilih peran utama kamu di band/grup. Tampilan chord dan catatan teknis akan disesuaikan secara otomatis.
      </p>
      <div className="space-y-2">
        {ROLE_OPTIONS.map((role) => {
          const config = ROLE_CONFIG[role]
          const Icon = config.icon
          return (
            <button
              key={role}
              onClick={() => setRole(role)}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200 text-left disabled:opacity-50"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {config.label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={skipOnboarding}
          className="w-full text-center text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          Lewati — atur nanti di Pengaturan
        </button>
      </div>
    </Modal>
  )
}
