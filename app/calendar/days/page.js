import Link from 'next/link'
import { getAllExpenses } from '@/lib/services/data-service'
import s from '@/app/_styles/_pages/calendarDaysPage.module.css'

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()

  const grouped = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          amount: {}
        }
      }

      if (!acc[item.date].amount[item.currency]) {
        acc[item.date].amount[item.currency] = 0
      }

      acc[item.date].amount[item.currency] += item.amount

      return acc
    }, {})
  )

  return (
    <>
      <h1>
        Days Calendar
      </h1>
      {grouped.map(day => (
        <Link className={s.day} key={day.date} href={`/day/${day.date.replaceAll('-','')}`}>
          <div>Day: {day.date}</div>
          <div>Money spent:</div>
          {Object.keys(day.amount).map(currency => (
            <div key={currency}>
              {day.amount[currency]} {currency}
            </div>
          ))}
        </Link>
      ))}
    </>
  )
}
