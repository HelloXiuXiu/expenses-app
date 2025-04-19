import { getUser } from '@/lib/auth'
import SignInButton from '@/app/_components/SignInButton'
import SignOutButton from '@/app/_components/SignOutButton'
import s from '@/app/_styles/_pages/homepage.module.css'

export default async function LoginPage() {
  const user = await getUser()

  return (
    <div className={s.page}>
      <h1>LOGIN</h1>
      {user ? <SignOutButton /> : <SignInButton />}
    </div>
  )
}
