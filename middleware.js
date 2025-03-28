import { NextResponse } from 'next/server'
import { auth } from '@/app/_lib/auth'

export const middleware = async (request) => {
  const session = await auth()

  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',]
}