'use client'

import { useEffect } from 'react'
import PopupHeader from '@/app/_components/PopupHeader'
import s from '@/app/_styles/_components/AnimatedPopup.module.css'

const popupClass = 'animated-popup-box'
const closeClass = 'animated-popup-close-icon'

export const AnimatedPopup = ({
  maxHeight = 1000,
  width = 300,
  clickableClass,
  onSetIsOpen,
  styles = {},
  children,
}) => {
  useEffect(() => {
    // make it close on click outside
    window.addEventListener('click', closePopup, { once: true, capture: true })
  }, [])

  function closePopup(e) {
    const isInsidePopup = e.target.closest(`.${popupClass}`)
    const isCloseIcon = e.target.closest(`.${closeClass}`)
    const isClickable = clickableClass ? e.target.closest(`.${clickableClass}`) : null

    if (isInsidePopup && !isCloseIcon) {
      window.addEventListener('click', closePopup, { once: true, capture: true })
    } else {
      e.preventDefault()
      if (!isClickable) e.stopPropagation()

      const modal = document.querySelector(`.${popupClass}`)
      modal.classList.add(s.popupBoxClose)
      modal.addEventListener('animationend', () => onSetIsOpen(false), { once: true })
    }
  }

  return (
    <div
      className={`${s.popupBox} ${popupClass}`}
      style={{
        '--popup-width': `${width}px`,
        '--popup-max-height': `${maxHeight}px`,
        ...styles,
      }}
    >
      <PopupHeader closeClass={closeClass} />
      {children}
    </div>
  )
}
