'use client'

import { useTransition } from 'react'
import { signOutAction } from '@/app/_lib/actions'
import s from '@/app/_styles/_components/SignInButton.module.css'

function SignInButton() {
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      const { errorMessage } = await signOutAction()
      if (!errorMessage) {
        console.log('signed out')
      } else {
        console.log(errorMessage)
      }
    })
  }

  return (
    <form action={() => handleSignOut()}>
      <button className={s.button} disabled={isPending} >
        <span>{isPending ? '...signing out' : 'Sign Out'}</span>
      </button>
    </form>
  )
}

export default SignInButton

