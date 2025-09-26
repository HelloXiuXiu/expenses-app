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

export function isInvalidDate(str) {
  // TO-DO add validation for 2025-09-32, 2025-13-31 etc.
  return Number.isNaN(Date.parse(str))
}

export function validateNewExpense(expense) {
  if (!isValidAmoun(expense.amount)) {
    throw new Error('Invalid amount')
  }
  if (!expense.category || typeof expense.category !== 'string') {
    // TO-DO check if this category exist for that user ? 
    throw new Error('Category is required')
  }
  if (!expense.date || isInvalidDate(expense.date)) {
    throw new Error('Invalid date')
  }

  return true
}