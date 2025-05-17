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
      localStorage.removeItem('selectedCategories')
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

