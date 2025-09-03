'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOutAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/ui/Button'

function SignOutButton() {
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
    <Button.Large onClick={handleSignOut} disabled={isPending} >
      <span>{isPending ? '...signing out' : 'Sign Out'}</span>
    </Button.Large>
  )
}

export default SignOutButton

