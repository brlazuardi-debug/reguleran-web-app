import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Sparkles } from 'lucide-react'
import useProposalStore from '../stores/useProposalStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

const STATUS_BADGE = {
  draft: { variant: 'default', label: 'Draft' },
  sent: { variant: 'primary', label: 'Terkirim' },
  accepted: { variant: 'success', label: 'Diterima' },
  rejected: { variant: 'danger', label: 'Ditolak' },
}

const FILTERS = ['all', 'draft', 'sent', 'accepted', 'rejected']
const FILTER_LABELS = { all: 'Semua', draft: 'Draft', sent: 'Terkirim', accepted: 'Diterima', rejected: 'Ditolak' }

export default function ProposalListPage() {
  const navigate = useNavigate()
  const { proposals, loading, subscribe } = useProposalStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const unsub = subscribe()
    return () => unsub?.()
  }, [subscribe])

  const filtered = filter === 'all' ? proposals : proposals.filter((p) => p.status === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Proposal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-neutral-900 dark:text-white">Proposal Booking</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{proposals.length} proposal</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/app/proposals/new')}>
          Proposal Baru
        </Button>
      </div>

      {proposals.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === f
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={filter === 'all' ? 'Belum ada proposal' : 'Tidak ada proposal'}
          description={filter === 'all' ? 'Buat proposal untuk dikirim ke venue' : `Tidak ada proposal dengan status "${FILTER_LABELS[filter]}"`}
          action={filter === 'all' ? <Button icon={Plus} onClick={() => navigate('/app/proposals/new')}>Proposal Baru</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} hover onClick={() => navigate(`/app/proposals/${p.id}`)}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{p.venueName}</h3>
                <Badge variant={STATUS_BADGE[p.status]?.variant} size="sm" className="shrink-0">
                  {STATUS_BADGE[p.status]?.label}
                </Badge>
              </div>
              {p.proposedDate && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{p.proposedDate}</p>
              )}
              {p.rateOffered && (
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Rp {Number(p.rateOffered).toLocaleString('id-ID')}
                </p>
              )}
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                {new Date(p.createdAt).toLocaleDateString('id-ID')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
