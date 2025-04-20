import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getUser() {
  const auth = await getSupabaseAuth()
  const userData = await auth.getUser()
  const user = userData.data.user

  return user
}

export async function getSession() {
  const auth = await getSupabaseAuth()
  const sessionData = await auth.getSession()
  const session = sessionData.data

  return session.session
}

export async function getSupabaseAuth() {
  const cookieStore = await cookies()

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )

  return supabaseClient.auth
}