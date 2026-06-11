const DAY_MAP = { Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 }

function toIcsDatetime(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function generateIcsCalendar(sessions, label = 'Reguleran Schedule') {
  const now = new Date()
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Reguleran//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${label}`,
    'X-WR-TIMEZONE:Asia/Jakarta',
  ]

  sessions.forEach((s) => {
    const dayNum = DAY_MAP[s.day]
    if (dayNum === undefined) return

    const [hours, minutes] = (s.time || '19:00').split(':').map(Number)
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
    const diff = dayNum - startDate.getDay()
    startDate.setDate(startDate.getDate() + (diff >= 0 ? diff : diff + 7))
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    const dtstart = toIcsDatetime(startDate)
    const dtend = toIcsDatetime(endDate)
    const uid = `${s.id}-${s.day}-reguleran`

    const loc = s.location || {}
    const locationStr = [loc.venue, loc.address].filter(Boolean).join(', ')
    const descParts = []
    if (loc.contactPerson) descParts.push(`Kontak: ${loc.contactPerson}`)
    if (loc.phone) descParts.push(`Telp: ${loc.phone}`)
    if (loc.locationNotes) descParts.push(`Catatan: ${loc.locationNotes}`)
    const description = descParts.join('\\n')

    ics = ics.concat([
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${s.name}`,
      locationStr ? `LOCATION:${locationStr}` : '',
      description ? `DESCRIPTION:${description}` : '',
      'RRULE:FREQ=WEEKLY;BYDAY=' + ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][dayNum],
      'END:VEVENT',
    ].filter(Boolean))
  })

  ics.push('END:VCALENDAR')
  return ics.join('\r\n')
}

export function downloadIcsFile(content, filename = 'reguleran-schedule.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
