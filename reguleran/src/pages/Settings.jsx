import { useState } from 'react'
import { Bell, Sparkles, Music, Sun, Moon, Languages } from 'lucide-react'
import { requestNotificationPermission } from '../services/notification'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Select } from '../components/ui/Select'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../i18n/useTranslation'
import useRoleStore, { ROLE_OPTIONS } from '../stores/roleStore'

export default function Settings() {
  const { role, setRole } = useRoleStore()
  const { theme, toggle } = useTheme()
  const { t, language, setLanguage } = useTranslation()
  const [notifStatus, setNotifStatus] = useState(Notification.permission)

  const ROLE_LABELS = {
    guitar: t('roles.guitar'),
    bass: t('roles.bass'),
    keyboard: t('roles.keyboard'),
    drums: t('roles.drums'),
    vocal: t('roles.vocal'),
  }

  const handleNotification = async () => {
    const result = await requestNotificationPermission()
    setNotifStatus(result)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
        <Sparkles size={16} />
        <span className="text-xs font-medium uppercase tracking-wider">{t('settings.title')}</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white mb-1">{t('settings.title')}</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">{t('settings.subtitle')}</p>

      <div className="grid gap-5">
        {/* Instrument Role Preference */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Music size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">{t('settings.instrumentRole')}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t('settings.instrumentDesc')}
              </p>
              <Select
                label={t('settings.instrumentRole')}
                value={role || ''}
                onChange={(e) => setRole(e.target.value || null)}
                options={[
                  { value: '', label: language === 'id' ? 'Tidak ada (default)' : 'None (default)' },
                  ...ROLE_OPTIONS.map(r => ({ value: r, label: ROLE_LABELS[r] })),
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Theme Settings (Dual Mode) */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              {theme === 'dark' ? (
                <Moon size={20} className="text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Sun size={20} className="text-neutral-600 dark:text-neutral-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">{t('settings.theme')}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t('settings.themeDesc')}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant={theme === 'light' ? 'primary' : 'secondary'}
                  size="sm"
                  icon={Sun}
                  onClick={() => theme !== 'light' && toggle()}
                >
                  {t('settings.lightMode')}
                </Button>
                <Button
                  variant={theme === 'dark' ? 'primary' : 'secondary'}
                  size="sm"
                  icon={Moon}
                  onClick={() => theme !== 'dark' && toggle()}
                >
                  {t('settings.darkMode')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Language Selection (Dwibahasa ID & EN) */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Languages size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">{t('settings.language')}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t('settings.languageDesc')}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant={language === 'id' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setLanguage('id')}
                >
                  🇮🇩 Bahasa Indonesia
                </Button>
                <Button
                  variant={language === 'en' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  🇬🇧 English (US)
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Bell size={20} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">{t('settings.notifications')}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t('settings.notificationsDesc')}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant={notifStatus === 'granted' ? 'success' : notifStatus === 'denied' ? 'danger' : 'warning'} size="sm" dot>
                    {notifStatus === 'granted' ? (language === 'id' ? 'Aktif' : 'Active') : notifStatus === 'denied' ? (language === 'id' ? 'Diblokir' : 'Blocked') : (language === 'id' ? 'Belum diaktifkan' : 'Not enabled')}
                  </Badge>
                </div>
                <Button variant="secondary" size="sm" onClick={handleNotification}>
                  {notifStatus === 'granted' ? (language === 'id' ? 'Aktif' : 'Active') : notifStatus === 'denied' ? (language === 'id' ? 'Diblokir' : 'Blocked') : (language === 'id' ? 'Aktifkan' : 'Enable')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
