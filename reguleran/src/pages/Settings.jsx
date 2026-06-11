import { useState } from 'react'
import { Bell, Database, CheckCircle, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react'
import { isConfigured } from '../services/firebase'
import { requestNotificationPermission } from '../services/notification'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export default function Settings() {
  const configured = isConfigured()
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
              <Database size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Firebase Configuration</h2>
              {configured ? (
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Firebase terkonfigurasi</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">Firebase belum dikonfigurasi</span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Copy file <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs">.env.example</code> ke <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs">.env</code> 
                    dan isi dengan kredensial Firebase project kamu.
                  </p>
                  <details className="text-sm group">
                    <summary className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300 cursor-pointer hover:underline font-medium">
                      Cara mendapatkan Firebase config
                      <ExternalLink size={14} />
                    </summary>
                    <ol className="mt-3 ml-4 space-y-1.5 list-decimal text-sm text-neutral-600 dark:text-neutral-400">
                      <li>Buka{' '}
                        <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-300 hover:underline">Firebase Console</a>
                      </li>
                      <li>Buat project baru (atau pilih yang sudah ada)</li>
                      <li>Enable Authentication (Email/Password)</li>
                      <li>Buat Firestore Database</li>
                      <li>Register Web App untuk mendapatkan config</li>
                      <li>Enable Cloud Messaging (optional untuk notifikasi)</li>
                    </ol>
                  </details>
                </div>
              )}
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
