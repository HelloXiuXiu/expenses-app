'use client'

import { Button } from '@/app/_components/common/ui/Button'
import { DayExpense } from '../DayExpense'
import s from './styles.module.css'

export const DayInfo = ({ data, selectedCategories, categories, onDeleteExpense }) => {
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
