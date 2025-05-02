'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOutAction } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/SignInButton.module.css'

function SignInButton({ style = {} }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      document.cookie = 'selectedCategories=all; path=/calendar/days; SameSite=Lax; Max-Age=0'
      const { errorMessage } = await signOutAction()
      if (!errorMessage) {
        router.push('/login')
      } else {
        console.log(errorMessage)
      }
    })
  }

  return (
    <button className={s.button} style={style} onClick={handleSignOut} disabled={isPending} >
      <span>{isPending ? '...signing out' : 'Sign Out'}</span>
    </button>
  )
}

export default SignInButton

