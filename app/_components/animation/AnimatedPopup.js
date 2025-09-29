'use client'

import { useEffect, useRef } from 'react'
import PopupHeader from '@/app/_components/PopupHeader'
import s from '@/app/_styles/_components/animation/AnimatedPopup.module.css'

/*
  SET maxHeight to make it WORK (or do not exceed 1000px)

  closeClass - any elem inside a popup that triggers close (all <a> also trigger close by default)
  clickableClass - elem outside that can be clicked while popup is open (any other will be caught and prevented)
*/

export const AnimatedPopup = ({
  maxHeight = 1000,
  width = 300,
  clickableClass,
  closeClass = 'animated-popup-close-trig',
  onSetIsOpen,
  styles = {},
  children,
}) => {
  const popupBox = useRef(null)
  const isEventStartedInside = useRef(false)

  useEffect(() => {
    // make it close on click outside
    window.addEventListener('click', closePopup, { once: true, capture: true })
    // prevent text select from triggering closePopup
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('click', closePopup, { once: true, capture: true })
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  function handleMouseDown(e) {
    isEventStartedInside.current = popupBox.current?.contains(e.target)
  }

  function closePopup(e) {
    if (!popupBox.current) return

    const isInsidePopup = popupBox.current.contains(e.target)
    const isCloseIcon = e.target.closest(`.${closeClass}`)
    const isClickable = clickableClass ? e.target.closest(`.${clickableClass}`) : null
    const isLink = e.target.closest('a')

    if ((isInsidePopup || isEventStartedInside.current) && !isCloseIcon && !isLink) {
      window.addEventListener('click', closePopup, { once: true, capture: true })
    } else {
      if (!isCloseIcon && !isLink) e.preventDefault()
      if (!isClickable) e.stopPropagation()

      popupBox.current.classList.add(s.popupBoxClose)
      popupBox.current.addEventListener('animationend', () => onSetIsOpen(false), { once: true })
    }

    isEventStartedInside.current = false
  }

  return (
    <div
      ref={popupBox}
      className={s.popupBox}
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
