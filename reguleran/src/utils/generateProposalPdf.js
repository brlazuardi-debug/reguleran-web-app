import { pdf } from '@react-pdf/renderer'
import ProposalPDFDocument from '../components/proposals/ProposalPDFDocument'

export async function generateProposalPdf(proposal, bandProfile) {
  const doc = pdf(ProposalPDFDocument({ proposal, bandProfile }))
  const blob = await doc.toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `proposal-${proposal.venueName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
