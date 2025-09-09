'use client'

import { useState, useEffect } from 'react'
import { getDayData } from '@/lib/services/data-service'
import { Button } from '@/app/_components/ui/Button'
import { DayExpense } from '@/app/_components/DayExpense'
import { getDayCache, setDayCache } from '@/lib/cache/dayCache'
import s from '@/app/_styles/_components/DayInfo.module.css'

export const DayInfo = ({ day, selectedCategories, categories }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  // TO-DO change update trigger and use optimistic state 
  // to remove an expense
  const total = day.amount.RSD

  useEffect(() => {
    const cachedData = getDayCache(day.date)
    if (cachedData) {
      setData(cachedData)
      return
    }

    setLoading(true)
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await getDayData(day.date, { signal: controller.signal })
        setDayCache(day.date, res)
        setData(res)
      } catch (err) {
        // TO-DO handle error case
        if (err.name === 'AbortError') return
        console.error('Error fetching day data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => controller.abort()
  }, [day.date, total])

  if (loading) return (
    <div>...Loading</div>
  )

  if (!data) return (
    <div>Day not found</div>
  )

  return (
    <div className={s.wrap}>
      <ul>
        {data?.map(day => (
          <DayExpense
            key={day.id}
            day={day}
            color={categories[day.category]}
            isSelected={selectedCategories.includes(day.category)}
          />
        ))}
      </ul>
      <div className={s.button}>
        <Button.Large>+ add new +</Button.Large>
      </div>
    </div>
  )
}
