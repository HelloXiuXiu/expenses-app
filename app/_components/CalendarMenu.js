'use client'

import React, { useState } from 'react'
import { SelectCategoriesPopup } from '@/app/_components/SelectCategoriesPopup'
import s from '@/app/_styles/_components/CalendarMenu.module.css'

export const CalendarMenu = ({ sumWeek, sumMonth, selectedCategories, onSetSelectedCategories, allCategories }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  const categoriesLenth = Object.keys(allCategories).length
  const selectedLength = selectedCategories ? selectedCategories.split(',').length : 0

  function openPopUp(e) {
    setIsCategoriesOpen(true)
    window.addEventListener('click', closePopUp, { once: true, capture: true })
  }

  function closePopUp(e) {
    const isButton = e.target.closest('.categories-popup-button')
    const isOption = e.target.closest('.categories-popup-option')
    if (!isButton && !isOption) e.stopPropagation()
    if (e.target.closest('.categories-popup-box') && !isButton) {
      window.addEventListener('click', closePopUp, { once: true, capture: true })
      return
    }
    if (isButton) e.target.click()
    setIsCategoriesOpen(false)
  }

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
            <div
              className={s.categories + ' categories-popup-trig'}
              style={{ opacity: isCategoriesOpen ? '0.5' : '1'}}
              onClick={openPopUp}
            >
              {selectedLength}/{categoriesLenth} categories
            </div>
            {isCategoriesOpen && (
              <SelectCategoriesPopup
                selectedCategories={selectedCategories}
                onSetSelectedCategories={onSetSelectedCategories}
                allCategories={allCategories}
              />
            )}
        </div>
      ) : (
        <div className={s.openTrig} onClick={() => setIsOpen(true)}>[ open stats ]</div>  
      )}
    </div>
  )
}
