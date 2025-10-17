import { forwardRef } from 'react'
import s from './styles.module.css'

const icons = {
  error: '/static/errorIcon.svg',
  success: '/static/successIcon.svg'
}

/*
  toast can be invoked via toaster.js in utils
  type (optional): error, success (add an icon before text)
  position: topCenter, bottomRight
*/

export const Toast = forwardRef(function Toast({ text, icon, type, position = 'topCenter' }, ref) {
  return (
    <div className={`${s.toastWrap} ${s[position]}`}>
      <div ref={ref} className={s.toastInnerWrap}>
        {icon && <div class={s.toastIcon}>{icon}</div>}
        {!icon && icons[type] && <img className={s.toastIcon} src={icons[type]} alt={`${type}-icon`} />}
        <div className={s.toastText}>{text}</div>
      </div>
    </div>
  )
})
