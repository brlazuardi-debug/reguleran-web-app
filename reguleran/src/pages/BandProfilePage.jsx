import { useEffect, useState } from 'react'
import { Users, Upload, Trash2 } from 'lucide-react'
import useBandProfileStore from '../stores/useBandProfileStore'
import BandProfileForm from '../components/proposals/BandProfileForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function BandProfilePage() {
  const { profile, loading, subscribe, upsertProfile, deleteProfile } = useBandProfileStore()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await upsertProfile(data)
      setEditing(false)
      toast({ type: 'success', message: 'Profil band disimpan' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProfile()
      setShowDelete(false)
      toast({ type: 'success', message: 'Profil band dihapus' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    }
  }

  if (loading && !profile) return <Spinner className="min-h-[60vh]" size="lg" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
          <Users size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Profil</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Profil Band</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Profil ini dipakai di proposal booking. Satu akun = satu profil.
        </p>
      </div>

      {!profile && !editing ? (
        <Card variant="glass">
          <EmptyState
            icon={Users}
            title="Belum ada profil band"
            description="Buat profil band dulu sebelum membuat proposal"
            action={
              <Button icon={Upload} onClick={() => setEditing(true)}>
                Buat Profil Band
              </Button>
            }
          />
        </Card>
      ) : editing ? (
        <Card>
          <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">
            {profile ? 'Edit Profil Band' : 'Profil Band Baru'}
          </h2>
          <BandProfileForm
            initial={profile}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(false)}
            submitting={submitting}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{profile.bandName}</h2>
                {profile.tagline && <p className="text-sm text-neutral-500 dark:text-neutral-400">{profile.tagline}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>Hapus</Button>
              </div>
            </div>

            {profile.description && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 whitespace-pre-wrap">{profile.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.genres?.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {g}
                </span>
              ))}
            </div>

            {profile.memberCount && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Anggota: {profile.memberCount} orang</p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Kontak</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {profile.contactName && (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Nama</p>
                  <p className="text-neutral-900 dark:text-white">{profile.contactName}</p>
                </div>
              )}
              {profile.contactPhone && (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Telepon</p>
                  <p className="text-neutral-900 dark:text-white">{profile.contactPhone}</p>
                </div>
              )}
              {profile.contactEmail && (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Email</p>
                  <p className="text-neutral-900 dark:text-white">{profile.contactEmail}</p>
                </div>
              )}
            </div>
          </Card>

          {profile.socialLinks && (profile.socialLinks.instagram || profile.socialLinks.youtube || profile.socialLinks.tiktok) && (
            <Card>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Media Sosial</h3>
              <div className="space-y-2 text-sm">
                {profile.socialLinks.instagram && <p><span className="text-neutral-500">IG:</span> {profile.socialLinks.instagram}</p>}
                {profile.socialLinks.youtube && <p><span className="text-neutral-500">YT:</span> {profile.socialLinks.youtube}</p>}
                {profile.socialLinks.tiktok && <p><span className="text-neutral-500">TT:</span> {profile.socialLinks.tiktok}</p>}
              </div>
            </Card>
          )}

          <ConfirmDialog
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={handleDelete}
            title="Hapus Profil Band"
            message={`Hapus profil "${profile.bandName}"? Profil yang sudah dipakai di proposal tidak akan terpengaruh.`}
          />
        </div>
      )}
    </div>
  )
}
