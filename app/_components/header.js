import Link from 'next/link'
import s from '@/app/_styles/_components/header.module.css'

export default function Header() {
  return (
    <header className={s.header}>
      <Link href='/calendar/days'>Calendar/Days</Link>
      <Link href='/calendar/months'>Calendar/Months</Link>
      <Link href='/day/000000'>Day 0000-00-00</Link>
      <Link href='/day/20250319'>Day 2025-03-19</Link>
      <Link href='/chart'>Chart</Link>
      <Link href='/account'>Account</Link>
      <Link href='/account/settings'>Settings</Link>
    </header>
  )
}
