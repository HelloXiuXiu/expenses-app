'use client'

import { useState } from 'react'
import { DayInfo } from '@/app/_components/DayInfo'
import s from '@/app/_styles/_components/Day.module.css'

export const Day = ({ day, settings, selectedCategories }) => {
  const [isOpen, setIsOpen] = useState(false)
  const maxCategories = day.categories?.length > 50 ? 49 : day.categories?.length

  function handleDayClick(e) {
    if (!isOpen) {
      setIsOpen(true)
      return
    }

    if (!e.target.closest('button')) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className={s.dayWrap} style={{ zIndex: isOpen ? 2 : 0 }} onClick={handleDayClick}>
        <div className={`${s.day} ${isOpen ? s.open : ''}`}> 
          <div className={s.date}>{day.date.split('-').slice(-2).reverse().join('/')}</div>
          <div className={s.amountWrap}>
            <div className={s.amount}>{+day.amount[settings.currency].toFixed(2)}</div>
            <div className={s.currency}>{settings.currency}</div>
          </div>
          <div className={s.riteSide}>
            {getWeekday(day.date)}
            <div className={s.categories}>
              {day.categories?.slice(0, maxCategories).map(category => (
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
                {day.categories?.length > maxCategories + 1 && '...'}
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <DayInfo day={day} selectedCategories={selectedCategories} categories={{...settings.categories, ...settings.deleted_categories}} />
        )}
      </div>
      {isOpen && <div className={s.overlay} onClick={() => setIsOpen(false)}></div>}
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
        <div className={s.currency}>rsd</div>
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
