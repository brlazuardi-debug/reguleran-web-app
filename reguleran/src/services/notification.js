export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications')
    return null
  }
  return await Notification.requestPermission()
}

export function scheduleBrowserNotification(title, body, triggerTime) {
  const delay = triggerTime.getTime() - Date.now()
  if (delay <= 0) return

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' })
    }
  }, delay)
}

export function scheduleSessionReminder(session) {
  if (!session?.day || !session?.time) return

  const nextDate = getNextDateForDay(session.day, session.time)
  if (!nextDate) return

  const reminderTime = new Date(nextDate.getTime() - 60 * 60 * 1000)
  scheduleBrowserNotification(
    'Reminder: ' + session.name,
    `Sesi dimulai dalam 1 jam di ${session.location?.venue || 'TBD'}`,
    reminderTime
  )
}

function getNextDateForDay(dayName, time) {
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
