import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useProposalStore from '../stores/useProposalStore'
import useSetlistStore from '../stores/setlistStore'
import useBandProfileStore from '../stores/useBandProfileStore'
import ProposalForm from '../components/proposals/ProposalForm'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'

export default function ProposalEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const { proposals, subscribe: subProposals, addProposal, updateProposal } = useProposalStore()
  const { setlists, subscribe: subSetlists } = useSetlistStore()
  const { profile, subscribe: subProfile } = useBandProfileStore()
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsub1 = subProposals()
    const unsub2 = subSetlists()
    const unsub3 = subProfile()
    return () => { unsub1?.(); unsub2?.(); unsub3?.() }
  }, [subProposals, subSetlists, subProfile])

  const proposal = isNew ? null : proposals.find((p) => p.id === id)
  if (!isNew && !proposal) return <Spinner className="min-h-[60vh]" size="lg" />

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (isNew) {
        const newId = await addProposal(data)
        toast({ type: 'success', message: 'Proposal dibuat' })
        navigate(`/app/proposals/${newId}`)
      } else {
        await updateProposal(id, data)
        toast({ type: 'success', message: 'Proposal diperbarui' })
        navigate(`/app/proposals/${id}`)
      }
    } catch (err) {
      toast({ type: 'error', message: 'Gagal: ' + err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(isNew ? '/app/proposals' : `/app/proposals/${id}`)}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-1"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">
        {isNew ? 'Proposal Baru' : 'Edit Proposal'}
      </h1>

      <Card>
        <ProposalForm
          initial={proposal}
          setlists={setlists}
          bandProfile={profile}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isNew ? '/app/proposals' : `/app/proposals/${id}`)}
          submitting={submitting}
        />
      </Card>
    </div>
  )
}
