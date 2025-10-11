import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SignInButton from '@/app/_components/SignInButton'
import s from '@/app/_styles/_pages/login.module.css'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.user) redirect('/')

  return (
    <div className={s.page}>
      <h1>LOGIN</h1>
      <SignInButton />
    </div>
  )
}
