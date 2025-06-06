import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { getUserSettings } from '@/lib/services/data-service'
import UserAvatar from '@/app/_components/UserAvatar'
import SignInButton from '@/app/_components/SignInButton'
import NewExpense from '@/app/_components/NewExpense'
import s from '@/app/_styles/_components/Header.module.css'

export default async function Header() {
  const user = await getUser()
  const settings = await getUserSettings()

  return (
    <header className={s.header}>
      <Link href='/calendar/days'>Calendar/Days</Link>
      {/* <Link href='/calendar/months'>Calendar/Months</Link> */}
      {/* <Link href='/day/000000'>Day 0000-00-00</Link>*/}
      {/* <Link href='/day/20250319'>Day 2025-03-19</Link> */}
      {/* <Link href='/chart'>Chart</Link> */}
      <NewExpense settings={settings} />
      <div>
      {user ? (
        <UserAvatar user={user} />
        ) : (
        <Link href='/login'>Login</Link>
      )}
      </div>
    </header>
  )
}
