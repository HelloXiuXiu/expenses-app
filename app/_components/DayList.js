'use client'

import { useState, useEffect, useMemo } from 'react'
import { Day, DayEmpty } from '@/app/_components/Day'
import { CalendarMenu } from '@/app/_components/CalendarMenu'
import { DATE_FORMAT } from '@/app/_config/config'

const EMPTY_DAYS_NUM = 2

export const DayList = ({ initialData, settings }) => {
  const [selectedCategories, setSelectedCategories] = useState(null)
  const [showDeleted, setShowDeleted] = useState(true)

  // TO-DO move from useEffect to a funtion outside of a component ?
  useEffect(() => {
    // get categories from local storage or set and use all user's categories
    const lsCategories = localStorage.getItem('selectedCategories')
    if (!lsCategories) {
      localStorage.setItem('selectedCategories', Object.keys(settings.categories).join(','))
    }
    setSelectedCategories(lsCategories || Object.keys(settings.categories).join(','))
  }, [])

  if (selectedCategories === null) return null

  // check if any expenses has deleted category
  // TO-DO test with deleted category
  let isSomeDeleted = false

  const filteredData = initialData.map(day => {
      const totals = {}

      for (const [category, currencies] of Object.entries(day.category_sums)) {
        if (
          selectedCategories?.includes(category) ||
          (settings.deleted_categories[category] && showDeleted)
        ) {
          if (settings.deleted_categories[category]) isSomeDeleted = true
          for (const [currency, amount] of Object.entries(currencies)) {
            totals[currency] = (totals[currency] || 0) + amount
          }
        }
      }

      return {
        date: day.date,
        amount: totals,
        categories: Object.keys(day.category_sums),
        // TO-DO create another memoised array for all_expenses to not re-render them for no-reason ?
        all_expenses: day.all_expenses || []
      }
    })

  // TO-DO memo
  const emptyDays = getNextDays(EMPTY_DAYS_NUM)
  const weekSum = getWeekSum(filteredData, settings.currency)
  const monthSum = getMonthSum(filteredData, settings.currency)

  const noCategories = !selectedCategories && !showDeleted || !selectedCategories && !isSomeDeleted

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
      {!isToday(filteredData[0]?.date) && !noCategories && (
        <Day
          key={new Date().toLocaleDateString(DATE_FORMAT)}
          data={() => getEmptyDayData(new Date().toLocaleDateString(DATE_FORMAT))}
          settings={settings}
          selectedCategories={selectedCategories}
        />
      )}
      {noCategories ? (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>[ no categories selected ]</div>
      ) : (
        <>
          {filteredData.length ? filteredData.map(day => (
            <Day
              key={day.date}
              data={day}
              settings={settings}
              selectedCategories={selectedCategories}
            />
            )) : (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>[ no data ]</div>
          )}
        </>
      )}
    </>
  )
}

function getEmptyDayData(date) {
  return {
    date,
    amount: {},
    categories: [],
    all_expenses: []
  }
}

function getNextDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toLocaleDateString(DATE_FORMAT)
  })
}

function isToday(date) {
  if (!date) return true
  return new Date().toLocaleDateString(DATE_FORMAT) === date
}

function getWeekSum(data, currency) {
  if (!data.length) return 0

  const start = new Date()
  const n = start.getDay() || 7
  const end = new Date(start - (n - 1) * 86400000).toLocaleDateString(DATE_FORMAT)

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
    .toLocaleDateString(DATE_FORMAT)

  let sum = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < monthStart) break
    sum += (data[i].amount[currency] || 0)
  }

  return sum.toFixed(2)
}
