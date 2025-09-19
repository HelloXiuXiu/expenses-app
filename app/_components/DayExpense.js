'use client'

import { DeleteExpense } from '@/app/_components/DeleteExpense'
import s from '@/app/_styles/_components/DayExpense.module.css'

export const DayExpense = ({ day, color, isSelected, onDeleteExpense }) => {
  return (
    <div className={s.wrap} style={{ opacity: isSelected ? 1 : 0.25 }} >
      <div className={s.dot} style={{ backgroundColor: color }}></div>
      <div>
        <p className={s.amount}>{day.amount}</p>
        <p className={s.descr}>
          <span>{day.category}</span>
          {day.description && <span>{' '}({day.description})</span>}
        </p>
      </div>
      {isSelected && (
        <div className={s.constrols}>
          <DeleteExpense id={day.id} day={day.date} onDelete={onDeleteExpense} />
          <DeleteExpense id={day.id} day={day.date} onDelete={onDeleteExpense} />
        </div>
      )}
    </div>
  )
}
