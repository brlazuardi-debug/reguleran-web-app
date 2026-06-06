export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  return `${h}:${m}`
}

export function getNextDateForDay(dayName, time) {
  const DAY_MAP = { Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 }
  const targetDay = DAY_MAP[dayName]
  if (targetDay === undefined) return null

  const now = new Date()
  const today = now.getDay()
  let diff = targetDay - today
  if (diff < 0) diff += 7

  const next = new Date(now)
  next.setDate(next.getDate() + diff)

  if (time) {
    const [h, m] = time.split(':').map(Number)
    next.setHours(h, m, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 7)
  }

  return next
}
