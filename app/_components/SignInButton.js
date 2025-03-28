import Image from 'next/image'
import { signInFunction } from '@/app/_lib/actions'
import s from '@/app/_styles/_components/SignInButton.module.css'

function SignInButton() {
  return (
    <form action={signInFunction}>
      <button className={s.button}>
         <Image
          src="/static/google.svg"
          width={24}
          height={24}
          alt='Google logo'
        />
        <span>Continue with Google</span>
      </button>
    </form>
  )
}

export default SignInButton
