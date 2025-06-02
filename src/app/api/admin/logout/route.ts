import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
} 