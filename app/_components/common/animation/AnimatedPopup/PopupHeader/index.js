import s from './styles.module.css'

export default function PopupHeader({ closeClass }) {
  return (
    <div className={s.header}>
      <div className={`${s.closeIcon} ${closeClass}`} />
    </div>
  )
}