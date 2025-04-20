'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { signInAction } from '@/app/_lib/actions'
import s from '@/app/_styles/_components/SignInButton.module.css'

function SignInButton({ style }) {
  const [isPending, startTransition] = useTransition()

  function handleLogin(provider) {
    startTransition(async () => {
      const { errorMessage, url } = await signInAction(provider)
      if (!errorMessage && url) {
        // router leads to CORS error that does not affect the auth flow though (at least on localhost)
        // it happenes because server tries to fetch() from this url (github.com) instead of just going there
        // router.push(url)
        window.location.href = url
      } else {
        console.log(errorMessage)
      }
    })
  }

  return (
    <button
      className={s.button}
      disabled={isPending}
      onClick={() => handleLogin('github')}
    >
       <Image
        src="/static/github.svg"
        width={24}
        height={24}
        alt='Github logo'
       />
      <span>{isPending ? '...logging in' : 'Signin with GitHub'}</span>
    </button>
  )
}

export default SignInButton
