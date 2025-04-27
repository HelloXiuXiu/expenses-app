import Link from 'next/link'
import s from '@/app/_styles/_components/Day.module.css'

export const Day = ({ day, settings }) => {
  return (
    <Link className={s.day + ' day'} href={`/day/${day.date.replaceAll('-','')}`}>
      <div className={s.date}>{day.date.split('-').slice(-2).reverse().join('/')}</div>
      <div className={s.amountWrap}>
        <div className={s.amount}>{day.amount[settings.currency]}</div>
      </div>
      <div className={s.currency}>{settings.currency}</div>
      <div className={s.riteSide}>
        Monday
        <div className={s.categories}>
          {day.categories.map(category => (
            <div
              key={category}
              className={s.category}
              style={{ backgroundColor: settings.categories[category] || settings.deleted_categories[category] }}
            ></div>
          ))}
        </div>
      </div>
      {/* Object.keys(day.amount).map(currency => (
        <div key={currency}>
          {day.amount[currency]} {currency}
        </div>
      )) */}
    </Link>
  )
}