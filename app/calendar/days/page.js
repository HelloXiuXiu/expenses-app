import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { Day, DayEmpty, DayTodayEmpty } from '@/app/_components/Day'
import { CalendarMenu } from '@/app/_components/CalendarMenu'

const EMPTY_DAYS_NUM = 2

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()
  const settings = await getUserSettings()
  const emptyDays = getNextDays(EMPTY_DAYS_NUM)

  const grouped = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          amount: {},
          categories: []
        }
      }

      if (!acc[item.date].amount[item.currency]) {
        acc[item.date].amount[item.currency] = 0
      }

      acc[item.date].amount[item.currency] += item.amount
      if (!acc[item.date].categories.includes(item.category)) {
        acc[item.date].categories.push(item.category)
      }

      return acc
    }, {})
  )

  const weekSum = getWeekSum(grouped, settings.currency)
  const monthSum = getMonthSum(grouped, settings.currency)

  return (
    <>
      <CalendarMenu sumWeek={weekSum} sumMonth={monthSum} categories={settings.categories}/>
      {emptyDays.reverse().map(day => <DayEmpty key={day + 1} day={day} />)}
      {!isToday(grouped[0].date) && <DayTodayEmpty day={getToday()} settings={settings} />}
      {grouped.map(day => <Day key={day.date} day={day} settings={settings} />)}
    </>
  )
}

function getNextDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().split('T')[0]
  })
}

function isToday(date) {
  return new Date().toISOString().split('T')[0] === date
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getWeekSum(data, currency) {
  if (!data.length) return 0

  const start = new Date()
  const n = start.getDay() || 7
  const end = new Date(start - (n - 1) * 86400000).toISOString().split('T')[0]

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    sum += (data[i].amount[currency] || 0)
    if (data[i].date === end) break
  }

  return sum.toFixed(2)
}

function getMonthSum(data, currency) {
    if (!data.length) return 0

  const start = new Date()
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1)
    .toISOString()
    .split('T')[0]

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    sum += (data[i].amount[currency] || 0)
    if (data[i].date === monthStart) break
  }

  return sum.toFixed(2)
}
