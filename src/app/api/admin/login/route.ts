import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'ok'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8小时

export async function POST(request: Request) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: '未配置管理员密码' }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
} 