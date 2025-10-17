import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { getUserSettings } from '@/lib/services/data-service'
import UserAvatar from './UserAvatar'
import SignInButton from './SignInButton'
import NewExpense from './NewExpense'
import s from './styles.module.css'

export default async function Header() {
  const user = await getUser()
  const settings = await getUserSettings()

  return (
    <header className={s.header}>
      <Link href="/calendar" className={s.headerLink}>Calendar/Days</Link>
      {/* <Link href='/chart'>Chart</Link> */}
      <NewExpense settings={settings} />
      <div>
        {user ? <UserAvatar user={user} /> : <Link href="/login">Login</Link>}
      </div>
    </header>
  )
}
