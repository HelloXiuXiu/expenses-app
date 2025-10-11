import s from '@/app/_styles/_components/ui/Loader.module.css'

export function Loader() {
  return (
    <div className={s.loaderWrap}>
      <div className={s.loader}></div>
    </div>
  )
}
