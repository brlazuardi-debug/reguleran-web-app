# Design System & Specification: Reguleran (Minimalist Studio Edition)

> **Theme Concept:** Minimalist Studio — Inspired by Linear, Vercel, and modern audio hardware (Ableton/Teenage Engineering). Ultra-crisp micro-borders, deep obsidian backgrounds, high-contrast typography, and purposeful electric accents.

---

## 1. Visual Foundations & Tokens

### 1.1 Color Palette

#### Dark Mode (Primary Stage Canvas)
- **Base Background:** `#08090A` (Deepest Obsidian)
- **Sub-surface / Sidebar:** `#0D0F12` (Elevated Charcoal)
- **Card / Surface Container:** `#13161B` (Studio Surface)
- **Elevated Hover / Popover:** `#1B1F26` (Active Element)
- **Micro-Border / Hairline:** `rgba(255, 255, 255, 0.08)` (1px crisp border)
- **Active Border / Focus:** `rgba(255, 255, 255, 0.20)`

#### Light Mode (Studio Daylight Canvas)
- **Base Background:** `#F8F9FA`
- **Sub-surface / Sidebar:** `#F0F2F5`
- **Card / Surface Container:** `#FFFFFF`
- **Micro-Border / Hairline:** `rgba(0, 0, 0, 0.08)`

#### Brand & Accent Hierarchy
- **Brand Accent (Electric Indigo):** `#6366F1` (Hover: `#4F46E5`, Muted: `rgba(99, 102, 241, 0.15)`)
- **Live Stage / Active Signal (Signal Cyan):** `#00F5FF` (Live playback, active chord markers)
- **Success / Confirmed (Studio Emerald):** `#10B981` (Muted: `rgba(16, 185, 129, 0.12)`)
- **Warning / Pending (Amber Gold):** `#F59E0B` (Muted: `rgba(245, 158, 11, 0.12)`)
- **Danger / Delete (Studio Crimson):** `#EF4444` (Muted: `rgba(239, 68, 68, 0.12)`)

#### Typography Colors
- **Text Primary:** `#F3F4F6` (Dark) / `#111827` (Light)
- **Text Secondary:** `#9CA3AF` (Dark) / `#4B5563` (Light)
- **Text Muted:** `#6B7280` (Dark) / `#9CA3AF` (Light)
- **Chord Highlight:** `#38BDF8` (Sky 400) or `#A78BFA` (Purple 400)

---

### 1.2 Typography System

- **Primary Sans:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Monospace / Chords & Numeric:** `JetBrains Mono`, `Fira Code`, `monospace`
- **Display / Brand Header:** `Plus Jakarta Sans` or `Inter` (Font-weight 600/700 with `-0.03em` letter-spacing)

| Token | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `display-2xl` | 36px | 700 | 44px | -0.03em | Landing Hero, Stage Title |
| `display-xl` | 28px | 600 | 36px | -0.02em | Page Header, Key Numbers |
| `heading-lg` | 20px | 600 | 28px | -0.015em | Section Titles, Modal Headers |
| `heading-md` | 16px | 600 | 24px | -0.01em | Card Titles, Drawer Labels |
| `body-md` | 14px | 400/500 | 20px | 0 | Standard Body Text, Table Cells |
| `body-sm` | 12px | 400/500 | 16px | +0.01em | Metadata, Timestamps, Subtitles |
| `chord-text` | 15px / 18px (Stage) | 700 (Mono) | 24px | +0.02em | Chords above lyrics |
| `badge-xs` | 11px | 600 (Mono) | 14px | +0.04em | Key badges, BPM chips, Roles |

---

### 1.3 Layout & Elevation Tokens

- **Border Radius:**
  - `radius-sm`: `6px` (Badges, Key tags, Tooltips)
  - `radius-md`: `10px` (Inputs, Buttons, Dropdowns)
  - `radius-lg`: `14px` (Cards, Panels, Modals)
  - `radius-full`: `9999px` (Pills, Avatars, Floating Playbar)
- **Shadows & Glassmorphism:**
  - `shadow-studio`: `0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)`
  - `glass-panel`: `background: rgba(19, 22, 27, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08)`
  - `glow-accent`: `box-shadow: 0 0 20px rgba(99, 102, 241, 0.25)`

---

## 2. Global Navigation & Layout Architecture

### 2.1 Desktop Layout (Sidebar + Header + Canvas)
- **Sidebar (Collapsible 240px -> 64px):**
  - **Top:** Minimalist Reguleran Monogram + Band Workspace Switcher dropdown.
  - **Quick Search:** `⌘K` Command Bar trigger.
  - **Main Nav Group:**
    - `Dashboard` (Overview & Gig Countdown)
    - `Lagu & Chord` (Song Database, Transpose, Audio)
    - `Setlist` (Live Setlist Builder & Player)
    - `Sesi & Jadwal` (Rehearsals, Gigs, ICS Sync)
    - `Proposal Manggung` (Booking Documents & PDF)
    - `Rider & RAB` (Stage Plot, Sound Needs, Budget)
  - **Secondary Nav Group:**
    - `Band Profile` (EPK & Media)
    - `Pitchlist` (Tone.js Pitch Shifter)
    - `Public Library` (Shared Community Chords)
  - **Footer:** Active Instrument Role Badge selector (`🎸 Gitaris` / `🥁 Drummer` / etc.) + User Profile Avatar + Dark/Light toggle.
- **Top Command Bar:**
  - Dynamic Breadcrumbs (`Setlist / Acoustic Weekend / Live Stage Player`).
  - Active Session Status Pill.
  - Quick Action button (`+ Buat Baru`).

### 2.2 Mobile Layout (Top App Bar + Floating Bottom Dock)
- **Top Header:** Hamburger menu trigger + Page Title + Active Role Chip.
- **Bottom Floating Dock (4 items + FAB):**
  - `Dashboard` | `Lagu` | `[+] FAB (Quick Action)` | `Setlist` | `Sesi`
- **Slide-out Drawer:** Access to Band Profile, Proposal PDF, Pitchlist, Settings, & Account Logout.

---

## 3. Screen-by-Screen UI Specifications

### 3.1 Landing Page (`/`)
- **Hero Section:**
  - Tagline: *"The Live Band Operating System."*
  - Interactive Floating Preview: Real-time Chord Sheet widget with playable transpose toggle (`-2` | `0` | `+3`).
  - Dual CTAs: `Mulai Sekarang (Gratis)` (Linear gradient button) + `Lihat Demo Stage Player`.
- **Bento Grid Features:**
  - Card 1: **Smart Chord Sheet & Transpose** (Live interactive transpose simulator).
  - Card 2: **Live Stage Mode** (Distraction-free dark mode for high-glare environments).
  - Card 3: **One-Click Proposal & Technical Rider** (Automated PDF generation).
  - Card 4: **Audio Pitch Shifter** (Tone.js powered rehearsal assistant).
- **Social Proof & Stats Bar:** Counter ticker (500+ Lagu, 200+ Musisi Aktif).

---

### 3.2 Dashboard (`/app`)
- **Hero Status Banner:**
  - "Upcoming Gig" Countdown Card (e.g. *"Live at Hard Rock Cafe — 2 Hari Lagi"*).
  - Quick Action Buttons: `Mulai Stage Player`, `Buka Rider Teknis`, `Buat Setlist Baru`.
- **Stat Matrix (3-Column Minimal Grid):**
  - Total Lagu (with newly added badge).
  - Setlist Siap Main.
  - Sesi Aktif Bulan Ini.
- **Two-Column Activity Hub:**
  - **Left (60%):** Upcoming Sessions list with venue badge, setlist link, and ICS export icon.
  - **Right (40%):** Active Role Quick-Settings panel (switch instrument view on the fly: Gitar, Bas, Keyboard, Drum, Vokal) + Quick Pitch Shifter shortcut.

---

### 3.3 Song Library & Chord Sheet (`/app/songs` & `/app/songs/:id`)
- **Song Library View:**
  - **Filter & Search Bar:** Real-time search by Title, Artist, Key (`Am`, `G`, `E`), BPM, and Tags.
  - **Display Switcher:** Table View (Compact data-dense) / Card View (Visual with key tags).
  - **Quick Key Transpose Badge:** Hover to see transposed key immediately.
- **Song Detail & Interactive Chord Viewer:**
  - **Top Floating Control Deck:**
    - Key Transposer: Stepper buttons (`-` `Original: G` `+` `Current: Bb`).
    - Instrument Role Filter Tabs: `Semua`, `Gitar`, `Bass`, `Keys`, `Drum`, `Vokal`.
    - Stage Mode Toggle (`⛶ Fullscreen Stage`).
    - Audio Player / Backing Track bar (Cloudinary audio with pitch-shift toggle).
  - **Chord Sheet Container:**
    - Dual-line layout: Monospace colored chords positioned exactly above lyrics.
    - Section Markers: `[INTRO]`, `[VERSE 1]`, `[CHORUS]`, `[SOLO]`, `[OUTRO]` styled as studio hardware tags.
    - Instrument-specific memo callouts (e.g., Drum note: *"Ganti beat 4/4 half-time di bar ke-8"*).

---

### 3.4 Setlist Manager & Live Stage Player (`/app/setlists`)
- **Setlist Builder (`/app/setlists/:id/edit`):**
  - Split view: Left = Song Picker catalog; Right = Drag-and-drop ordered set list.
  - Song Item Row: Duration calculation, Per-song Key override, Transition note tag (*"Langsung masuk tanpa jeda"*).
  - Total Setlist Duration accumulator (e.g., `45 Menit — 10 Lagu`).
- **Live Stage Player (`/app/setlists/:id/player`):**
  - **Ultra-High Contrast Dark Mode:** Ambient black `#000000` background.
  - **Floating Stage Header:** Current Song `[03 / 10] - Separuh Nafas (Dewa 19)` with giant current key indicator.
  - **Auto-Scroll Engine:** Configurable speed slider (`1x`, `1.5x`, `2x`) with Pause/Resume spacebar trigger.
  - **Bottom Dock:** `[◀ Lagu Sebelumnya]` | `Transpose [- / +]` | `[Lagu Berikutnya ▶]`.

---

### 3.5 Sessions & Calendar Hub (`/app/sessions` & `/app/schedule`)
- **Calendar & Timeline Hybrid View:**
  - Month calendar view with color-coded dots (Rehearsal = Indigo, Regular Gig = Emerald, Special Event = Amber).
  - Timeline Cards: Venue address, Google Maps direct link, Setlist attached, Member RSVP badges.
- **Session Editor:**
  - Date & Time pickers, Recurrence frequency (Sekali / Mingguan), Location autocomplete, Setlist selector.
  - Quick Link to generate Technical Rider & RAB for this session.

---

### 3.6 Technical Rider & RAB Hub (`/app/sessions/:id/event-document`)
- **Interactive Technical Rider Editor:**
  - **Sound Needs Form:** Channel list matrix (Channel #, Instrument/Source, Mic/DI, Stand, Monitor Mix).
  - **Instrument Needs:** Categorized checkboxes per instrument role.
- **RAB (Rencana Anggaran Biaya) Budget Table:**
  - Line item budget calculator: Honorarium Personil, Transport/Akomodasi, Sewa Alat, Fee Management.
  - Auto-computed Total Budget, Net Profit, and Split Per Person.
- **Export Action:** Instant server-side PDF render with branded band letterhead.

---

### 3.7 Booking Proposal Builder & PDF Preview (`/app/proposals`)
- **Proposal List View:**
  - Status pipeline: `Draft` ➔ `Terkirim` ➔ `Disetujui` ➔ `Selesai`.
  - Target Venue & Proposed Rate preview.
- **Proposal Editor (Step Wizard):**
  - Step 1: Venue & Client Info (PIC, Event Name, Date).
  - Step 2: Band Package & Repertoire (Attach highlight setlists).
  - Step 3: Rate Card & Payment Terms (Down payment %, Bank account).
  - Step 4: Client Testimonials & Social Proof.
- **Live PDF Preview Deck:**
  - High-res PDF viewer canvas on the right side.
  - Actions: `Download PDF`, `Copy Shareable Web Link`, `Kirim via WhatsApp`.

---

### 3.8 Band Profile & EPK (`/app/band-profile`)
- **Visual EPK (Electronic Press Kit) Builder:**
  - Cover Banner & Band Avatar (Cloudinary upload with instant crop).
  - Bio & Musical Genre Pills (Pop, Rock, Jazz, Top 40, Acoustic).
  - Band Lineup Grid: Photo, Name, Instrument Role, Instagram handle.
  - Repertoire Highlights & Booking Contact card.

---

### 3.9 Audio Pitch Shifter & Pitchlist (`/app/pitchlist`)
- **Tone.js Pitch Shifter Workstation:**
  - Waveform audio visualizer.
  - Semi-tone pitch slider: `-6 semitones` to `+6 semitones` with zero-latency preview.
  - Playback speed multiplier (`0.75x`, `1.0x`, `1.25x`) for learning fast solos.
  - Loop marker handles (A-B repeat loop for tricky song sections).

---

### 3.10 Settings & Active Role Management (`/app/settings`)
- **Role Preferences:**
  - Choose default instrument view (Gitaris, Bassist, Keyboardist, Drummer, Vokalis).
  - Chord notation system: Standard (`C - D - Em`) vs Roman Numerals (`I - II - iii`) vs Solfeggio (`Do - Re - Mi`).
- **Appearance & Stage Mode:**
  - Dark / Light / OLED Pure Black mode.
  - Keep Screen Awake toggle (Wake Lock API for live performances).

---

## 4. Key UI Components & Interactions

### 4.1 Button Hierarchy
- **Primary:** `bg-white text-black dark:bg-neutral-100 dark:text-neutral-950 font-medium hover:bg-neutral-200 shadow-sm rounded-lg px-4 py-2 text-sm`
- **Secondary / Studio Outline:** `bg-transparent border border-white/10 hover:bg-white/5 text-neutral-200 rounded-lg px-4 py-2 text-sm`
- **Ghost:** `text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-1.5 text-sm`
- **Accent Action:** `bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 shadow-md`

### 4.2 Form Controls & Inputs
- **Text Input:** `bg-[#13161B] border border-white/10 focus:border-indigo-500 text-neutral-200 placeholder-neutral-500 rounded-lg px-3 py-2 text-sm transition-colors`
- **Chord Badge:** `inline-flex items-center px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-xs font-semibold`
- **Role Chip:** `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800/80 border border-neutral-700 text-neutral-300`

---

## 5. Micro-Interactions & Animation Guidelines

- **Transitions:** Snappy `150ms - 200ms cubic-bezier(0.16, 1, 0.3, 1)` for all hovers and tab switches.
- **Chord Transpose Animation:** Smooth 120ms crossfade when transposing keys (no layout jump).
- **Drag-and-Drop Feedback:** 4px scale-up and subtle drop shadow `0 10px 25px rgba(0,0,0,0.5)` when dragging songs in Setlist builder.
- **Stage Mode Transitions:** Seamless fullscreen transition with fading ambient UI controls on idle.
