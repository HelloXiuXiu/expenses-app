'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAuth, getSession } from '@/lib/auth'
import { updateUserSettings } from '@/lib/services/data-service'

export async function signInAction(provider) {
  try {
    const auth = await getSupabaseAuth()
    const { data, error } = await auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
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

export async function updateSettingsAction(formData) {
  try {
    // TO-DO forbid editing other columns
    // TO-DO forbid editing other columns
    // TO-DO forbid editing other columns

    // TO-DO validate data here
    const res = await updateUserSettings(formData)

    revalidatePath('/account/settings')

    return res
  } catch (error) {
    console.log(error)
    return { error: 'error updating settings' }
  }
}
