import s from '@/app/_styles/_components/PopupHeader.module.css'

export default function PopupHeader({ closeClass }) {
  return (
    <div className={s.header}>
      <div className={`${s.closeIcon} ${closeClass}`}></div>
    </div>
  )
}