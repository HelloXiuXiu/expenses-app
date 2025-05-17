'use client'

import { useState, useEffect } from 'react'
import { Day, DayEmpty, DayTodayEmpty } from '@/app/_components/Day'
import { CalendarMenu } from '@/app/_components/CalendarMenu'

const EMPTY_DAYS_NUM = 2

export const DayList = ({ data, settings }) => {
  const [selectedCategories, setSelectedCategories] = useState(null)
  const [showDeleted, setShowDeleted] = useState(true)

  useEffect(() => {
    // get categories from local storage or set and use all user's categories
    const lsCategories = localStorage.getItem('selectedCategories')
    if (!lsCategories) {
      localStorage.setItem('selectedCategories', Object.keys(settings.categories).join(','))
    }
    setSelectedCategories(lsCategories || Object.keys(settings.categories).join(','))
  }, [])

  if (selectedCategories === null) return null

  const groupedSelected =  Object.values(
    data.reduce((acc, item) => {
      if (
        selectedCategories?.includes(item.category) ||
        (settings.deleted_categories[item.category] && showDeleted)
        ) {
        if (!acc[item.date]) {
          acc[item.date] = {
            date: item.date,
            amount: {},
            categories: []
          }
        }

        if (!acc[item.date].amount[item.currency]) {
          acc[item.date].amount[item.currency] = 0
        }

        acc[item.date].amount[item.currency] += item.amount
        if (!acc[item.date].categories.includes(item.category)) {
          acc[item.date].categories.push(item.category)
        }
      }

      return acc
    }, {})
  )

  const emptyDays = getNextDays(EMPTY_DAYS_NUM)
  const weekSum = getWeekSum(groupedSelected, settings.currency)
  const monthSum = getMonthSum(groupedSelected, settings.currency)

  const noCategories = (!selectedCategories && !showDeleted) || !groupedSelected.length

  return (
    <>
      <CalendarMenu
        sumWeek={weekSum}
        sumMonth={monthSum}
        selectedCategories={selectedCategories}
        onSetSelectedCategories={setSelectedCategories}
        allCategories={settings.categories}
        showDeleted={showDeleted}
        setShowDeleted={setShowDeleted}
      />
      {emptyDays.reverse().map(day => <DayEmpty key={day + 1} day={day} />)}
      {!isToday(groupedSelected[0]?.date) && <DayTodayEmpty settings={settings} />}
      {groupedSelected.map(day => <Day key={day.date} day={day} settings={settings} />)}
      {noCategories && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>[ no categories selected ]</div>
      )}
    </>
  )
}

function getNextDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toLocaleDateString('en-CA')
  })
}

function isToday(date) {
  if (!date) return true
  return new Date().toLocaleDateString('en-CA') === date
}

function getWeekSum(data, currency) {
  if (!data.length) return 0

  const start = new Date()
  const n = start.getDay() || 7
  const end = new Date(start - (n - 1) * 86400000).toLocaleDateString('en-CA')

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < end) break
    sum += (data[i].amount[currency] || 0)
  }

  return sum.toFixed(2)
}

function getMonthSum(data, currency) {
    if (!data.length) return 0

  const start = new Date()
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1)
    .toLocaleDateString('en-CA')

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < monthStart) break
    sum += (data[i].amount[currency] || 0)
  }

  return sum.toFixed(2)
}
