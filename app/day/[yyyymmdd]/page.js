import Link from 'next/link'
import { getDayData } from '@/lib/services/data-service'

export default async function DayPage({ params }) {
  const { yyyymmdd } = await params
  const day = yyyymmdd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  
  const data = await getDayData(day)
  const sum = data.reduce((acc, cur) => acc + cur.amount, 0)

  return (
    <>
      <h1>Day { day }</h1>
      <p>Ammount: {sum}</p>
      <Link href='/calendar/days'>← Back to calendar</Link>
    </>
  )
}
