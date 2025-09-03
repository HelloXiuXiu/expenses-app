'use client'

import { useState, useEffect } from 'react'
import { getDayData } from '@/lib/services/data-service'
import { Button } from '@/app/_components/ui/Button'
import { DayExpense } from '@/app/_components/DayExpense'
import s from '@/app/_styles/_components/DayInfo.module.css'

export const DayInfo = ({ day, categories }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController()
    const date = day.date

    const fetchData = async () => {
      try {
        const res = await getDayData(day.date, { signal: controller.signal });
        setData(res);
      } catch (err) {
        if (err.name === "AbortError") return
        console.error("Error fetching day data:", err)
      } finally {
        setLoading(false);
      }
    };

    fetchData()

    return () => controller.abort()
  }, [day.date])

  let sum =  {}

  data?.forEach(item => {
    if (!sum[item.currency]) {
      sum[item.currency] = item.amount
    } else {
      sum[item.currency] += item.amount
    }
  })

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
          <DayExpense day={day} categories={categories} key={day.id} />
        ))}
      </ul>
      <div className={s.button}>
        <Button.Large>+ add new +</Button.Large>
      </div>
    </div>
  )
}


