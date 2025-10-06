import s from '@/app/_styles/_components/ui/Toast.module.css'

const icons = {
  error: '/static/errorIcon.svg',
  success: '/static/successIcon.svg',
}

// type (optional): error, success
// position: topCenter, bottomRight
export function Toast({ text, icon, type, position = 'topCenter',}) {
  return (
    <div className={s.box}>
      <div className={`${s.toastWrap} ${s[position]}`}>
        {icon && <div class={s.toastIcon}>{icon}</div>}
        {!icon && icons[type] && <img class={s.toastIcon} src={icons[type]} alt={`${type}-icon`} />}
        <div className={s.toastText}>{text}</div>
      </div>
    </div>
  )
}
