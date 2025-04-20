import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request) {
  const cookieStore = await cookies()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerClient(
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
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      NextResponse.redirect(`https://${forwardedHost ? forwardedHost : origin}${next}`)
    }
  }

  // TO-DO create an error page
  // return the user to an error page with instructions
  // return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  return NextResponse.redirect(`${origin}/login`)
}