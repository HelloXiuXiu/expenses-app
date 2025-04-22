import Link from 'next/link'
import { getDays } from '@/lib/services/data-service'
import s from '@/app/_styles/_pages/calendarDaysPage.module.css'

export default async function CalendarDaysPage() {
  const data = await getDays()

  return (
    <>
      <h1>
        Days Calendar
      </h1>
      {data.map(day => (
        <Link className={s.day} key={day.id} href={`/day/${day.date.replaceAll('-','')}`}>
          <div>Day: {day.date}</div>
          <div>Category: {day.category}</div>
          <div>Amount: {day.amount}</div>
          {day.comment && <div>Comment: {day.comment}</div>}
        </Link>
      ))}
    </>
  )
}
