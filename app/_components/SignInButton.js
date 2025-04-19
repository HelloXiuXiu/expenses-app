'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signInAction } from '@/app/_lib/actions'
import s from '@/app/_styles/_components/SignInButton.module.css'

function SignInButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogin(provider) {
    startTransition(async () => {
      const { errorMessage, url } = await signInAction(provider)
      if (!errorMessage && url) {
        router.push(url)
      } else {
        console.log(errorMessage)
      }
    })
  }

  return (
    <form action={() => handleLogin('github')}>
      <button className={s.button} disabled={isPending} >
         {/* <Image
                   src="/static/google.svg"
                   width={24}
                   height={24}
                   alt='Google logo'
                 /> */}
        <span>{isPending ? '...logging in' : 'Signin with GitHub'}</span>
      </button>
    </form>
  )
}

export default SignInButton
