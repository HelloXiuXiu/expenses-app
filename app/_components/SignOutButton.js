import { signOutFunction } from '@/app/_lib/actions'
import s from '@/app/_styles/_components/SignOutButton.module.css'

function SignOutButton() {
  return (
    <form action={signOutFunction}>
      <button className={s.button}>
        <span>Sign Out</span>
      </button>
    </form>
  )
}

export default SignOutButton
