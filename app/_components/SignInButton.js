'use client'

import { useTransition } from 'react'
import { signInAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/ui/Button'

function SignInButton() {
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
    <Button.Large
      disabled={isPending}
      onClick={() => handleLogin('github')}
      style={{ maxWidth: '200px', display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}
    > 
      <img
        src="/static/github.svg"
        width={24}
        height={24}
        alt='Github logo'
       />
      <span>{isPending ? '...logging in' : 'Signin with GitHub'}</span>
    </Button.Large>
  )
}

export default SignInButton
