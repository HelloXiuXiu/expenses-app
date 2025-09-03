'use client'

import { useState, useEffect } from 'react'
import { SelectCategoriesPopup } from '@/app/_components/SelectCategoriesPopup'
import { AnimatedPopup } from '@/app/_components/animation/AnimatedPopup'
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
              <span className={s.line}></span>
              <span className={s.line}></span>
              <span className={s.line}></span>
            </div>
            <div className={s.sums}>
              <div style={{display: 'inline' }}>
                <span className={s.sum}>{formatNumber(+sumWeek)}</span>
                <span className={s.sumLabel}>[ week ]</span>
              </div>
              <div style={{display: 'inline' }}>
                <span className={s.sum}>{formatNumber(+sumMonth)}</span>
                <span className={s.sumLabel}>[ month ]</span>
              </div>
            </div>
          </div>
          <div className={`${s.closeTrig} clickable`} onClick={() => setIsOpen(false)}>[ close ]</div>
          <div
            className={s.categories}
            style={{ opacity: isCategoriesOpen ? '0.5' : '1'}}
            onClick={() => setIsCategoriesOpen(true)}
          >
            {selectedLength}/{categoriesLenth} categories
          </div>
        </div>

        {isCategoriesOpen && (
          <AnimatedPopup
            maxHeight={1000}
            width={300}
            clickableClass='clickable'
            onSetIsOpen={setIsCategoriesOpen}
            styles={{ top: menuHeight + 40 + 20 + 'px', right: '20px' }}
          >
            <SelectCategoriesPopup
              selectedCategories={selectedCategories}
              onSetSelectedCategories={onSetSelectedCategories}
              allCategories={allCategories}
              showDeleted={showDeleted}
              setShowDeleted={setShowDeleted}
            />
          </AnimatedPopup>
        )}
      </div>
    </>
  )
}

function formatNumber(num) {
  if (num < 10000) return num.toFixed(2)
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}
