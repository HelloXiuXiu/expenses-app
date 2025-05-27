'use client'

import { useState, useEffect } from 'react'
import { SelectCategoriesPopup } from '@/app/_components/SelectCategoriesPopup'
import s from '@/app/_styles/_components/CalendarMenu.module.css'

export const CalendarMenu = ({
  sumWeek,
  sumMonth,
  selectedCategories,
  onSetSelectedCategories,
  allCategories,
  showDeleted,
  setShowDeleted
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState(0)

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  }, [])

  const categoriesLenth = Object.keys(allCategories).length
  const selectedLength = selectedCategories ? selectedCategories.split(',').length : 0
  // not using sticky as it blocks next.js cache on history.back()
  const menuIndentStyle = isOpen ? { height: menuHeight + 'px' } : {}
  const menuStyle = isOpen ? { maxHeight: menuHeight + 'px', pointerEvents: 'auto' } : {}

  function openCategories(e) {
    setIsCategoriesOpen(true)
    window.addEventListener('click', closeCategories, { once: true, capture: true })
  }

  function closeCategories(e) {
    // to make 'close on click outside' work
    // add .categories-popup-box to popup wrapper
    const isInsidePopup = e.target.closest('.categories-popup-box')

    if (isInsidePopup) {
      window.addEventListener('click', closeCategories, { once: true, capture: true })
    } else {
      e.preventDefault()
      e.stopPropagation()
      setIsCategoriesOpen(false)
    }
  }

  function handleResize() {
    // get an actial menu size to enable smooth animation
    const menu = document.getElementById('menuContent')
    const height = menu?.getBoundingClientRect().height || 40
    setMenuHeight(height)
  }

  return (
    <>
      {!isOpen && (
        <div className={s.openTrig} onClick={() => setIsOpen(true)}>[ open stats ]</div>
      )}

      <div className={s.menuIndent} style={menuIndentStyle}></div>

      <div className={s.menuBox} style={menuStyle}>
        <div id='menuContent' className={s.menuContent}>
          <div className={s.leftContent}>
            <div className={s.layoutToggle}>
              <svg width='21' height='14' viewBox='0 0 21 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M0 1H20.5' stroke='currentColor'/>
                <path d='M0 7H20.5' stroke='currentColor'/>
                <path d='M0 13H20.5' stroke='currentColor'/>
              </svg>
            </div>
            <div className={s.sums}>
              <div style={{display: 'inline' }}>
                <span className={s.sum}>{(+sumWeek).toFixed(2)}</span>
                <span className={s.sumLabel}>[ week ]</span>
              </div>
              <div style={{display: 'inline' }}>
                <span className={s.sum}>{(+sumMonth).toFixed(2)}</span>
                <span className={s.sumLabel}>[ month ]</span>
              </div>
            </div>
          </div>
          <div className={s.closeTrig} onClick={() => setIsOpen(false)}>[ close ]</div>
          <div
            className={s.categories}
            style={{ opacity: isCategoriesOpen ? '0.5' : '1'}}
            onClick={openCategories}
          >
            {selectedLength}/{categoriesLenth} categories
          </div>
        </div>

        {isCategoriesOpen && (
          <div
            className={s.categoriesBox + ' categories-popup-box'}
            style={{ top: menuHeight + 40 + 'px'}}
          >
            <SelectCategoriesPopup
              selectedCategories={selectedCategories}
              onSetSelectedCategories={onSetSelectedCategories}
              allCategories={allCategories}
              showDeleted={showDeleted}
              setShowDeleted={setShowDeleted}
            />
          </div>
        )}
      </div>
    </>
  )
}
