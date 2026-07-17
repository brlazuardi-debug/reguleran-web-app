import { useState } from 'react'
import { Bell, Sparkles, Music } from 'lucide-react'
import { requestNotificationPermission } from '../services/notification'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Select } from '../components/ui/Select'
import useRoleStore, { ROLE_OPTIONS } from '../stores/roleStore'

const ROLE_LABELS = {
  guitar: 'Gitaris',
  bass: 'Bassist',
  keyboard: 'Keyboardist',
  drums: 'Drummer',
  vocal: 'Vokalis',
}

export default function Settings() {
  const { role, setRole } = useRoleStore()
  const [notifStatus, setNotifStatus] = useState(Notification.permission)

  const handleNotification = async () => {
    const result = await requestNotificationPermission()
    setNotifStatus(result)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
        <Sparkles size={16} />
        <span className="text-xs font-medium uppercase tracking-wider">Pengaturan</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white mb-1">Pengaturan</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Konfigurasi aplikasi</p>

      <div className="grid gap-5">
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Music size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Peran Instrumen</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Pilih peran utama kamu. Tampilan lagu akan disesuaikan.
              </p>
              <Select
                label="Peran"
                value={role || ''}
                onChange={(e) => setRole(e.target.value || null)}
                options={[
                  { value: '', label: 'Tidak ada (default)' },
                  ...ROLE_OPTIONS.map(r => ({ value: r, label: ROLE_LABELS[r] })),
                ]}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Bell size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Notifikasi</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Notifikasi Browser</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Mendapatkan pengingat sebelum sesi dimulai</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleNotification}>
                  {notifStatus === 'granted' ? 'Aktif' : notifStatus === 'denied' ? 'Diblokir' : 'Aktifkan'}
                </Button>
              </div>
              <div className="mt-3">
                <Badge variant={notifStatus === 'granted' ? 'success' : notifStatus === 'denied' ? 'danger' : 'warning'} size="sm" dot>
                  {notifStatus === 'granted' ? 'Aktif' : notifStatus === 'denied' ? 'Diblokir' : 'Belum diaktifkan'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
