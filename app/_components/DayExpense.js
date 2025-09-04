'use client'

import { DeleteExpense } from '@/app/_components/DeleteExpense'
import s from '@/app/_styles/_components/DayExpense.module.css'

export const DayExpense = ({ day, categories, selectedCategories }) => {
  const isSelected = selectedCategories.includes(day.category)
  return (
    <div className={s.wrap} style={{ opacity: isSelected ? 1 : 0.25 }} >
      <div className={s.dot} style={{ backgroundColor: categories[day.category] }}></div>
      <div>
        <p className={s.amount}>{day.amount}</p>
        <p className={s.descr}>
          <span>{day.category}</span>
          {day.description && <span>{' '}({day.description})</span>}
        </p>
      </div>
      <div className={s.constrols}>
        <DeleteExpense id={day.id} />
        <DeleteExpense id={day.id} />
      </div>
    </div>
  )
}
