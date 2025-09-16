'use client'

import { Button } from '@/app/_components/ui/Button'
import { DayExpense } from '@/app/_components/DayExpense'
import s from '@/app/_styles/_components/DayInfo.module.css'

export const DayInfo = ({ data, selectedCategories, categories, onDeleteExpense }) => {
  // TO-DO fix this
  if (!data) return null

  return (
    <div className={s.wrap}>
      <ul>
        {data?.map(day => (
          <DayExpense
            key={`expense-${day.id}`}
            day={day}
            color={categories[day.category]}
            isSelected={selectedCategories.includes(day.category)}
            onDeleteExpense={onDeleteExpense}
          />
        ))}
      </ul>
      <div className={s.button}>
        <Button.Large>+ add new +</Button.Large>
      </div>
    </div>
  )
}
