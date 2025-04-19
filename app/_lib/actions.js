'use server'
import { getSupabaseAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function signInAction(provider) {
  try {
    const auth = await getSupabaseAuth()
    const { data, error } = await auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
      }
    })

    if (error) throw error
    return { errorMessage: null, url: data.url }

  } catch (error) {
    return { errorMessage: 'error logging in' }
  }
}

export async function signOutAction() {
  try {
    const auth = await getSupabaseAuth()
    const { error } = await auth.signOut()

    if (error) throw error
    return { errorMessage: null }

  } catch (error) {
    return { errorMessage: 'error signing out' }
  }
}
