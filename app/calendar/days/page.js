import { cookies } from 'next/headers'
import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { Day, DayEmpty, DayTodayEmpty } from '@/app/_components/Day'
import { CalendarMenu } from '@/app/_components/CalendarMenu'

const EMPTY_DAYS_NUM = 2

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()
  const settings = await getUserSettings()
  const emptyDays = getNextDays(EMPTY_DAYS_NUM)

  const cookieStore = await cookies()
  const cookiesCategories = cookieStore.get('selectedCategories')?.value?.replaceAll('_', ' ')
  const selectedCategories = cookiesCategories === 'all'
    ? Object.keys(settings.categories).join(',')
    : cookiesCategories

  const grouped = Object.values(
    data.reduce((acc, item) => {

      if (selectedCategories?.includes(item.category)) {
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
      }

      return acc
    }, {})
  )

  const weekSum = getWeekSum(grouped, settings.currency)
  const monthSum = getMonthSum(grouped, settings.currency)

  return (
    <>
      <CalendarMenu
        sumWeek={weekSum}
        sumMonth={monthSum}
        selectedCategories={selectedCategories}
        allCategories={settings.categories}
      />
      {emptyDays.reverse().map(day => <DayEmpty key={day + 1} day={day} />)}
      {!isToday(grouped[0]?.date) && <DayTodayEmpty day={getToday()} settings={settings} />}
      {grouped.map(day => <Day key={day.date} day={day} settings={settings} />)}
      {/*
        TO-DO check if there is no categories at all
        or user unselect them all
      */}
      {!selectedCategories && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>[ no categories selected ]</div>
      )}
    </>
  )
}

function getNextDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toLocaleDateString('en-CA')
  })
}

function isToday(date) {
  if (!date) return true
  return new Date().toLocaleDateString('en-CA') === date
}

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function getWeekSum(data, currency) {
  if (!data.length) return 0

  const start = new Date()
  const n = start.getDay() || 7
  const end = new Date(start - (n - 1) * 86400000).toLocaleDateString('en-CA')

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < end) break
    sum += (data[i].amount[currency] || 0)
  }

  return sum.toFixed(2)
}

function getMonthSum(data, currency) {
    if (!data.length) return 0

  const start = new Date()
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1)
    .toLocaleDateString('en-CA')

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < monthStart) break
    sum += (data[i].amount[currency] || 0)
  }

  return sum.toFixed(2)
}
