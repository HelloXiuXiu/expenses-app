import SignInButton from '@/app/_components/SignInButton'
import s from '@/app/_styles/_pages/homepage.module.css'

export default function LoginPage() {
  return (
    <div className={s.page}>
      <h1>LOGIN</h1>
      <SignInButton />
    </div>
  )
}
