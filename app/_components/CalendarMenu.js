'use client'

import React, { useState } from 'react'
import s from '@/app/_styles/_components/CalendarMenu.module.css'

export const CalendarMenu = ({ sumWeek, sumMonth, categories }) => {
  const [isOpen, setIsOpen ] = useState(false)

  const categoriesLenth = Object.keys(categories).length

  return (
    <div className={s.menuBox} style={{ height: isOpen ? '40px' : '0' }}>
     {isOpen ? (
        <div className={s.menuContent}>
            <div className={s.layoutToggle}>
              <svg width='21' height='14' viewBox='0 0 21 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M0 1H20.5' stroke='currentColor'/>
                <path d='M0 7H20.5' stroke='currentColor'/>
                <path d='M0 13H20.5' stroke='currentColor'/>
              </svg>
            </div>
            <div className={s.sums}>
              <div>
                <span className={s.sum}>{sumWeek}</span> [ week ]
              </div>
              <div>
                <span className={s.sum}>{sumMonth}</span> [ month ]
              </div>
            </div>
            <div className={s.closeTrig} onClick={() => setIsOpen(false)}>[ close ]</div>
            <div className={s.categories}>7/{categoriesLenth} categories</div>
        </div>
      ) : (
        <div className={s.openTrig} onClick={() => setIsOpen(true)}>[ open stats ]</div>  
      )}
    </div>
  )
}
