import Link from 'next/link'
import { getDayData } from '@/lib/services/data-service'
import { DeleteExpense } from '@/app/_components/DeleteExpense'

export default async function DayPage({ params }) {
  const { yyyymmdd } = await params
  const day = yyyymmdd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  const data = await getDayData(day)

  let sum =  {}

  data.forEach(item => {
    if (!sum[item.currency]) {
      sum[item.currency] = item.amount
    } else {
      sum[item.currency] += item.amount
    }
  })

  return (
    <>
      <h1>Day { day }</h1>
      <br />
      <div>
        <b>Total:</b>
        <br />
        {Object.keys(sum).map(currency => (
          <p key={currency}>{sum[currency]} {currency}</p>
        ))}
      </div>
      <br />
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <DeleteExpense id={item.id} />
            <p><b>Amount: {item.amount} {item.currency}</b></p>
            <p style={{ color: item.category_color}} >Category: {item.category}</p>
            {item.description && <p>Description: {item.description}</p>}
            <br />
          </li>
        ))}
      </ul>
      <Link href='/calendar/days'>← Back to calendar</Link>
    </>
  )
}
