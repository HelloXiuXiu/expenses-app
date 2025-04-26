import Link from 'next/link'
import { getUser } from '@/lib/auth'
import UserAvatar from '@/app/_components/UserAvatar'
import SignInButton from '@/app/_components/SignInButton'
import s from '@/app/_styles/_components/Header.module.css'

export default async function Header() {
  const user = await getUser()

  return (
    <header className={s.header}>
      <Link href='/calendar/days'>Calendar/Days</Link>
      {/* <Link href='/calendar/months'>Calendar/Months</Link> */}
      {/* <Link href='/day/000000'>Day 0000-00-00</Link>*/}
      {/* <Link href='/day/20250319'>Day 2025-03-19</Link> */}
      {/* <Link href='/chart'>Chart</Link> */}
      <Link href='/new' className={s.addButton}>
        <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M12 2V23' stroke='currentColor' strokeWidth='2'/>
          <path d='M1.5 12.5L22.5 12.5' stroke='currentColor' strokeWidth='2'/>
        </svg>
      </Link>
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
