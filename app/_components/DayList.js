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

  const filteredData = data.map(day => {
    const categories = Object.keys(day.category_sums)
    const amounts = Object.entries(day.category_sums).reduce((totals, [category, currenciesObj]) => {

      if (!selectedCategories.includes(category)) return totals

      for (const [currency, amount] of Object.entries(currenciesObj)) {
        totals[currency] = (totals[currency] || 0) + amount
      }
      return totals
    }, {})

    return {
      date: day.date,
      amount: amounts,
      categories,
      all_expenses: []
    }
  })

  const emptyDays = getNextDays(EMPTY_DAYS_NUM)
  const weekSum = getWeekSum(filteredData, settings.currency)
  const monthSum = getMonthSum(filteredData, settings.currency)

  const noCategories = (!selectedCategories && !showDeleted) || !filteredData.length

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
      {!isToday(filteredData[0]?.date) && <DayTodayEmpty settings={settings} />}
      {filteredData.map(day => (
        <Day key={day.date} day={day} settings={settings} selectedCategories={selectedCategories} />
      ))}
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
  // TO-DO make more reliable comparison
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
