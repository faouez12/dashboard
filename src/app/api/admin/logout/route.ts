import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(url)
  response.cookies.delete('shahine_admin_token')
  return response
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('shahine_admin_token')
  return response
}
