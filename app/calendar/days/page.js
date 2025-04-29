import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { Day, DayEmpty, DayTodayEmpty } from '@/app/_components/Day'

const EMPTY_DAYS_NUM = 3

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

  return (
    <>
      {grouped.map(day => <Day key={day.date} day={day} settings={settings} />)}
      {!isToday(grouped[grouped.length - 1].date) && <DayTodayEmpty day={getToday()} settings={settings} />}
      {emptyDays.map(day => <DayEmpty key={day + 1} day={day} />)}
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
