'use client'

import { useEffect, useRef } from 'react'
import PopupHeader from '@/app/_components/PopupHeader'
import s from '@/app/_styles/_components/animation/AnimatedPopup.module.css'

/*
  popupClass - popup wrapper
  closeClass - any elem inside a popup that triggers close (all <a> also trigger close by default)
  clickableClass - elem outside that can be clicked while popup is open
*/

const popupClass = 'animated-popup-box'

export const AnimatedPopup = ({
  maxHeight = 1000,
  width = 300,
  clickableClass,
  closeClass = 'animated-popup-close-trigger',
  onSetIsOpen,
  styles = {},
  children,
}) => {
  const isEventStartedInside = useRef(false)

  useEffect(() => {
    // make it close on click outside
    window.addEventListener('click', closePopup, { once: true, capture: true })
    // prevent text select from triggering closing
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('click', closePopup, { once: true, capture: true })
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  function handleMouseDown(e) {
    isEventStartedInside.current = e.target.closest(`.${popupClass}`)
  }

  function closePopup(e) {
    const isInsidePopup = e.target.closest(`.${popupClass}`)
    const isCloseIcon = e.target.closest(`.${closeClass}`)
    const isClickable = clickableClass ? e.target.closest(`.${clickableClass}`) : null
    const isLink = e.target.closest('a')

    if ((isInsidePopup || isEventStartedInside.current) && !isCloseIcon && !isLink) {
      window.addEventListener('click', closePopup, { once: true, capture: true })
    } else {
      if (!isCloseIcon && !isLink) e.preventDefault()
      if (!isClickable) e.stopPropagation()

      const modal = document.querySelector(`.${popupClass}`)
      modal.classList.add(s.popupBoxClose)
      modal.addEventListener('animationend', () => onSetIsOpen(false), { once: true })
    }

    isEventStartedInside.current = false
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
