import s from '@/app/_styles/_components/ui/Button.module.css'

function ButtonBase({
  size = 'large',
  type = 'button',
  onClick,
  disabled,
  style,
  children,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${s.button} ${s[size]}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}

export const Button = {
  Large: (props) => <ButtonBase {...props} size='large' />,
  Middle: (props) => <ButtonBase {...props} size='middle' />,
  Small: (props) => <ButtonBase {...props} size='small' />,
}
