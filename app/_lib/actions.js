'use server'

import { signIn, signOut } from './auth.js'

export async function signInFunction() {
  await signIn('google', { redirectTo: '/calendar/days'})
}

export async function signOutFunction() {
  await signOut({ redirectTo: '/'})
}