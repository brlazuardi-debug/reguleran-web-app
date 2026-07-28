import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, Download, Upload, MapPin, DollarSign, User } from 'lucide-react'
import useProposalStore from '../stores/useProposalStore'
import useBandProfileStore from '../stores/useBandProfileStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import { generateProposalPdf } from '../utils/generateProposalPdf'

const STATUS_BADGE = {
  draft: { variant: 'default', label: 'Draft' },
  sent: { variant: 'primary', label: 'Terkirim' },
  accepted: { variant: 'success', label: 'Diterima' },
  rejected: { variant: 'danger', label: 'Ditolak' },
}

export default function ProposalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { proposals, subscribe: subProposals, deleteProposal, updateProposal } = useProposalStore()
  const { profile, subscribe: subProfile } = useBandProfileStore()
  const [showDelete, setShowDelete] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subProposals()
    const unsub2 = subProfile()
    return () => { unsub1?.(); unsub2?.() }
  }, [subProposals, subProfile])

  const proposal = proposals.find((p) => p.id === id)
  if (!proposal) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleDelete = async () => {
    try {
      await deleteProposal(id)
      toast({ type: 'success', message: 'Proposal dihapus' })
      navigate('/app/proposals')
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    }
  }

  const generatePdf = async () => {
    setGenerating(true)
    try {
      const API = import.meta.env.VITE_API_URL || '/api'
      const token = await window.Clerk?.session?.getToken()
      const res = await fetch(`${API}/proposals/${id}/generate-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Gagal generate PDF')
      const { pdfUrl } = await res.json()
      await updateProposal(id, { pdfUrl })
      toast({ type: 'success', message: 'PDF tersimpan di cloud' })
      window.open(pdfUrl, '_blank')
    } catch (err) {
      toast({ type: 'error', message: err.message })
    } finally {
      setGenerating(false)
    }
  }

  const downloadPdf = async () => {
    try {
      await generateProposalPdf(proposal, profile)
      toast({ type: 'success', message: 'PDF berhasil didownload' })
    } catch (err) {
      toast({ type: 'error', message: 'Gagal download PDF: ' + err.message })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/app/proposals')}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{proposal.venueName}</h1>
              <Badge variant={STATUS_BADGE[proposal.status]?.variant} size="sm">{STATUS_BADGE[proposal.status]?.label}</Badge>
            </div>
            {proposal.proposedDate && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{proposal.proposedDate}{proposal.proposedTime ? ` | ${proposal.proposedTime}` : ''}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" icon={Download} onClick={downloadPdf} disabled={!proposal.pdfUrl}>
              {proposal.pdfUrl ? 'Buka PDF' : 'Belum Ada PDF'}
            </Button>
            <Button variant="secondary" size="sm" icon={Upload} onClick={generatePdf} loading={generating}>
              Generate PDF
            </Button>
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => navigate(`/app/proposals/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDelete(true)}>
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Detail Proposal</h3>
          <div className="space-y-3">
            <DetailRow icon={MapPin} label="Venue" value={proposal.venueName} />
            {proposal.venueContact && <DetailRow icon={User} label="Kontak Venue" value={proposal.venueContact} />}
            {proposal.performanceFormat && <DetailRow label="Format" value={proposal.performanceFormat} />}
            {proposal.rateOffered && (
              <DetailRow icon={DollarSign} label="Rate" value={`Rp ${Number(proposal.rateOffered).toLocaleString('id-ID')}`} />
            )}
            {proposal.rateNotes && <DetailRow label="Catatan Rate" value={proposal.rateNotes} />}
          </div>
        </Card>

        {proposal.testimonials?.length > 0 && (
          <Card>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Testimoni</h3>
            <div className="space-y-3">
              {proposal.testimonials.map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">"{t.quote}"</p>
                  <p className="text-xs text-neutral-400 mt-1">— {t.name}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {profile && (
        <Card>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Profil Band Tersambung</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{profile.bandName}</p>
        </Card>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Proposal"
        message={`Hapus proposal untuk venue "${proposal.venueName}"?`}
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-neutral-600 dark:text-neutral-400" />
        </div>
      )}
      <div>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs">{label}</p>
        <p className="font-medium text-neutral-900 dark:text-white">{value || '—'}</p>
      </div>
    </div>
  )
}
