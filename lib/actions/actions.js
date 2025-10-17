'use server'

import { revalidatePath } from 'next/cache'
import { getSession, getSupabaseAuth } from '@/lib/auth'
import { addExpense, deleteExpense, updateUserSettings } from '@/lib/services/data-service'

/* auth */

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

/* expenses */

export async function deleteExpenseAction(id) {
  try {
    const res = await deleteExpense(id)

    return res
  } catch (error) {
    return { error: 'error deleting an expense' }
  }
}

export async function addExpenseAction(formData) {
  try {
    const res = await addExpense(formData)

    revalidatePath('calendar/days')

    return res
  } catch (error) {
    console.error(error)
    return { error: 'error creating a new expense' }
  }
}

/* settings */

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

/* other */

export async function revalidatePage(path) {
  await revalidatePath(path)
}
