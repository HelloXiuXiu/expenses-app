export function formatNumericVal(str) {
  return str
    .replace(',', '.')
    .replace(/[^0-9.]|(?<=[.].*)[.]/g, '') // remove all not digits, and extra . or ,
    .replace(/^(\d+)([.]?)(\d{0,2}).*$/, '$1$2$3') // allow only digits after .
}

export function isValidAmount(str) {
  const formatedNum = +formatNumericVal(str)
  return !Number.isNaN(formatedNum) && formatedNum !== 0
}

export function isFuture(str) {
  const [y, m, d] = str.split('-')
  const year = +y, month = +m, day = +d
  // could be Invalid Date, validate first
  const dt = new Date(year, month - 1, day)

  const today = new Date()
  today.setHours(0,0,0,0)
  const dtMidnight = new Date(dt)
  dtMidnight.setHours(0,0,0,0)

  return dtMidnight <= today
}

export function isValidDate(str) {
  if (Number.isNaN(Date.parse(str))) return false

  // must be YYYY-M-D or YYYY-MM-DD
  const pattern = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!pattern) return false

  const [y, m, d] = str.split('-')
  const year = +y, month = +m, day = +d

  // must be a valid day
  const dt = new Date(year, month - 1, day)
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day
  ) return false

  return true
}

export function validateNewExpense(expense) {
  if (!isValidAmount(expense.amount.toString())) {
    throw new Error('Invalid amount')
  }
  if (!expense.category || typeof expense.category !== 'string') {
    // TO-DO check if this category exist for that user ? (check in db)
    throw new Error('Category is required')
  }
  if (!expense.date || !isValidDate(expense.date)) {
    throw new Error('Invalid date')
  }

  return true
}