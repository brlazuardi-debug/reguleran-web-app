import { useState } from 'react'
import { Bell, Database, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { isConfigured } from '../services/firebase'
import { requestNotificationPermission } from '../services/notification'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/ui/PageHeader'

export default function Settings() {
  const configured = isConfigured()
  const [notifStatus, setNotifStatus] = useState(Notification.permission)

  const handleNotification = async () => {
    const result = await requestNotificationPermission()
    setNotifStatus(result)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi aplikasi"
      />

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Database size={20} className="text-stone-600 dark:text-stone-400" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">Firebase Configuration</h2>
          </div>
        </div>

        {configured ? (
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Firebase terkonfigurasi</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Firebase belum dikonfigurasi</span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Copy file <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-xs">.env.example</code> ke <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-xs">.env</code> 
              dan isi dengan kredensial Firebase project kamu.
            </p>
            <details className="text-sm group">
              <summary className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 cursor-pointer hover:underline font-medium">
                Cara mendapatkan Firebase config
                <ExternalLink size={14} />
              </summary>
              <ol className="mt-3 ml-4 space-y-1.5 list-decimal text-sm text-stone-600 dark:text-stone-400">
                <li>Buka{' '}
                  <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" 
                     className="text-primary-600 dark:text-primary-400 hover:underline">
                    Firebase Console
                  </a>
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
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Bell size={20} className="text-stone-600 dark:text-stone-400" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">Notifikasi</h2>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Notifikasi Browser</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Mendapatkan pengingat sebelum sesi dimulai</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleNotification}>
            {notifStatus === 'granted' ? 'Aktif' : notifStatus === 'denied' ? 'Diblokir' : 'Aktifkan'}
          </Button>
        </div>
        <div className="mt-3">
          <Badge
            variant={notifStatus === 'granted' ? 'success' : notifStatus === 'denied' ? 'danger' : 'warning'}
            size="sm"
            dot
          >
            {notifStatus === 'granted' ? 'Aktif' : notifStatus === 'denied' ? 'Diblokir' : 'Belum diaktifkan'}
          </Badge>
        </div>
      </Card>
    </div>
  )
}
