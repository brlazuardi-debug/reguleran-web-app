export type InstrumentRole = 'guitar' | 'bass' | 'keyboard' | 'drums' | 'vocal'

export interface UserProfile {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  instrumentRole: InstrumentRole | null
  onboardingDone: boolean
  createdAt: string
  updatedAt: string
}

export type SectionLabel =
  | 'intro' | 'verse' | 'chorus' | 'bridge'
  | 'ending' | 'outro' | 'interlude' | 'pre-chorus'

export interface RoleNotes {
  guitar?: { chordVoicing?: string; tabReference?: string; notes?: string }
  bass?: { tabReference?: string; notes?: string }
  keyboard?: { chordVoicing?: string; notes?: string }
  drums?: { pattern?: string; dynamics?: 'soft' | 'medium' | 'loud'; notes?: string }
  vocal?: { harmony?: string; breathMarks?: number[]; notes?: string }
}

export interface SongSection {
  id: string
  label: SectionLabel
  customLabel?: string
  startLine: number
  endLine?: number
  chords?: string[]
  notes?: string
  roleNotes?: RoleNotes
}

export interface Song {
  id: string
  userId: string
  title: string
  artist: string | null
  key: string | null
  bpm: number | null
  timeSignature: string
  lyrics: string | null
  isPublic: boolean
  sections: SongSection[]
  audioStoragePath: string | null
  createdAt: string
  updatedAt: string
}

export interface SetlistSong {
  songId: string
  transpose: number
  order: number
}

export interface Setlist {
  id: string
  userId: string
  name: string
  description: string | null
  songs: SetlistSong[]
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  name: string
  day: string | null
  time: string | null
  location: {
    venue?: string
    address?: string
    contactPerson?: string
    phone?: string
    locationNotes?: string
    lat?: number
    lng?: number
  }
  active: boolean
  setlistId: string | null
  createdAt: string
  updatedAt: string
}

export interface SocialLinks {
  instagram?: string
  youtube?: string
  tiktok?: string
}

export interface BandProfile {
  id: string
  userId: string
  bandName: string
  tagline: string | null
  description: string | null
  logoUrl: string | null
  photoUrls: string[]
  genres: string[]
  memberCount: number | null
  contactName: string | null
  contactPhone: string | null
  contactEmail: string | null
  socialLinks: SocialLinks
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  name: string
  quote: string
}

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Proposal {
  id: string
  userId: string
  bandProfileId: string | null
  venueName: string
  venueContact: string | null
  proposedDate: string | null
  proposedTime: string | null
  performanceFormat: string | null
  rateOffered: number | null
  rateNotes: string | null
  featuredSetlistId: string | null
  testimonials: Testimonial[]
  status: ProposalStatus
  pdfUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface MicRequirement {
  type: string
  qty: number
}

export interface SoundNeeds {
  channels?: number
  monitors?: number
  mics?: MicRequirement[]
  notes?: string
}

export interface InstrumentNeed {
  role: InstrumentRole
  items: string[]
  notes?: string
}

export interface BudgetItem {
  id: string
  category: string
  description: string
  qty: number
  unitPrice: number
  subtotal: number
}

export interface EventDocument {
  id: string
  userId: string
  sessionId: string | null
  soundNeeds: SoundNeeds
  instrumentNeeds: InstrumentNeed[]
  stageLayoutNotes: string | null
  stageLayoutImage: string | null
  soundcheckTime: string | null
  powerNeeds: string | null
  budgetItems: BudgetItem[]
  budgetTotal: number
  budgetNotes: string | null
  pdfUrl: string | null
  createdAt: string
  updatedAt: string
}
