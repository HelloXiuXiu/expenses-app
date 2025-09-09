'use client'

const TTL = 24 * 60 * 60 * 1000 // 1 day in ms

// TO-DO handle update form other device (webSockets / Supabase Realtime updates)
export function setDayCache(day, data) {
  const item = {
    data,
    expiry: Date.now() + TTL,
  }

  try {
    sessionStorage.setItem(`day-${day}`, JSON.stringify(item))
  } catch (err) {
    console.warn('sessionStorage quota exceeded:', err)
  }
}

export function getDayCache(day) {
  const raw = sessionStorage.getItem(`day-${day}`)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed.expiry > Date.now()) {
      return parsed.data
    } else {
      sessionStorage.removeItem(`day-${day}`)
    }
  } catch {
    sessionStorage.removeItem(`day-${day}`)
  }

  return null
}

export function removeExpenseFromDayCache(id, day) {
  const curData = getDayCache(day)
  if (!curData) return

  const updatedData = curData.filter(item => item.id !== id)
  setDayCache(day, updatedData)
}

export function clearDayCache(day) {
  sessionStorage.removeItem(`day-${day}`)
}

export function clearAllDaysCache() {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith('day-'))
    .forEach((key) => sessionStorage.removeItem(key))
}
