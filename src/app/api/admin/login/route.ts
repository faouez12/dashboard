import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD || 'Shahine2026!'

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect administrator password.' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(
      process.env.ADMIN_SECRET || 'shahine_super_secret_key_2026_xyz_abc123'
    )

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    const response = NextResponse.json({ success: true, redirect: '/admin/dashboard' })

    response.cookies.set('shahine_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (err: any) {
    console.error('[LOGIN_API_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
