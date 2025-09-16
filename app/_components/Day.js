'use client'

import { useState, useEffect, useCallback } from 'react'
import { DayInfo } from '@/app/_components/DayInfo'
import s from '@/app/_styles/_components/Day.module.css'

// TO-DO display other currensies
export const Day = ({ data, settings, selectedCategories,  }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false) // hide all 0 days
  const [optimisticData, setOptimisticData] = useState(data)
  const [deletedIds, setDeletedIds] = useState([])

  const maxCategories = data.categories?.length > 50 ? 49 : data.categories?.length
  const totalAmount = optimisticData?.amount[settings.currency] ? +optimisticData.amount[settings.currency].toFixed(2) : 0

  useEffect(() => {
    // TO-DO update only when an expense added
    // data.amount > optimisticData.amount wont work if some items was deleted
    if (data.amount > optimisticData.amount) {
      setOptimisticData(state => ({
        ...state,
        amount: data.amount,
        // all_expenses: data.all_expenses
      }))
    }
  }, [data])

  useEffect(() => {
    if (!isOpen) setIsCollapsed(!totalAmount)
  }, [totalAmount])

  function handleDayClick(e) {
    if (!isOpen) {
      // TO-DO check if there are other currencies
      if (totalAmount) setIsOpen(true)
      return
    }

    if (!e.target.closest('button')) {
      handleClose() // reuse here and on overlay
    }
  }

  function handleClose() {
    setIsOpen(false)
    // TO-DO check if there are other currencies
    if (!totalAmount) setIsCollapsed(true)
  }

  const deleteExpense = useCallback((id) => {
    setOptimisticData(data => {
      const cur = data.all_expenses.find((item) => item.id === id)
      if (!cur) return data

      const newData = structuredClone(data)
      newData.amount[cur.currency] =  data.amount[cur.currency] - cur.amount
      newData.all_expenses = data.all_expenses.filter(item => item !== cur)
      newData.categories = [...new Set(newData.all_expenses.map(a => a.category))]
      setDeletedIds(arr => [...arr, id])

      return newData
    })
  }, [setOptimisticData])

  if (isCollapsed) return null

  return (
    <>
      <div className={s.dayWrap} style={{ zIndex: isOpen ? 2 : 0 }} onClick={handleDayClick}>
        <div className={`${s.day} ${isOpen ? s.open : ''}`}> 
          <div className={s.date}>{optimisticData.date.split('-').slice(-2).reverse().join('/')}</div>
          <div className={s.amountWrap}>
            <div className={s.amount}>{totalAmount}</div>
            <div className={s.currency}>{settings.currency}</div>
          </div>
          <div className={s.riteSide}>
            {getWeekday(optimisticData.date)}
            <div className={s.categories}>
              {optimisticData.categories?.slice(0, maxCategories).map(category => (
                <div
                  key={category}
                  className={s.category}
                  style={{
                    backgroundColor: settings.categories[category] ||
                    settings.deleted_categories[category]
                  }}
                ></div>
              ))}
              <div className={s.categotyCount}>
                {optimisticData.categories?.length > maxCategories + 1 && '...'}
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <DayInfo
            data={optimisticData.all_expenses}
            selectedCategories={selectedCategories}
            categories={{...settings.categories, ...settings.deleted_categories}}
            onDeleteExpense={deleteExpense}
          />
        )}
      </div>
      {isOpen && <div className={s.overlay} onClick={handleClose}></div>}
    </>
  )
}

export const DayTodayEmpty = ({ settings }) => {
  // TO-DO: stabilise the output of toLocaleDateString, as it can be different
  // between implementations
  // TO-DO: call this function only in the browser, as it can be different for the server
  const today = new Date().toLocaleDateString('en-GB')

  return (
    <div className={`${s.day} ${s.dayWrap}`}>
      <div className={s.date}>{today.split('/').slice(0, 2).join('/')}</div>
      <div className={s.amountWrap}>
        <div className={s.amount}>0</div>
        <div className={s.currency}>{settings.currency}</div>
      </div>
      <div className={s.riteSide}>
        {getWeekday(new Date().toLocaleDateString('en-US'))}
      </div>
    </div>
  )
}

export const DayEmpty = ({ day }) => {
  return (
    <div className={`${s.day} ${s.dayWrap}`} style={{ opacity: '0.1', pointerEvents: 'none' }}>
      <div className={s.date}>{day.split('-').slice(-2).reverse().join('/')}</div>
      <div className={s.amountWrap}></div>
      <div className={s.riteSide}>
        {getWeekday(day)}
      </div>
    </div>
  )
}

function getWeekday(yyyyddmm) {
  return new Date(yyyyddmm).toLocaleDateString('en-GB', { weekday: 'long' })
}
