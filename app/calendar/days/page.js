import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { Day } from '@/app/_components/Day'

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()
  const settings = await getUserSettings()

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
      {grouped.reverse().map(day => <Day key={day.date} day={day} settings={settings} />)}
    </>
  )
}
