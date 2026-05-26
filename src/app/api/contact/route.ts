import { NextRequest, NextResponse } from 'next/server'
import { addMessage, ContactMessage } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, topic, type, eventDetails, date, runners } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields (name, email, message)' }, { status: 400 })
    }

    const newMessage: ContactMessage = {
      id: `msg-${crypto.randomUUID()}`,
      name,
      email,
      message,
      topic: topic || 'General Inquiry',
      type: type || 'other',
      eventDetails: eventDetails || '',
      date: date || '',
      runners: runners || '',
      created_at: new Date().toISOString(),
    }

    await addMessage(newMessage)
    return NextResponse.json({ success: true, message: 'Message saved successfully.' })
  } catch (err: any) {
    console.error('[CONTACT_API_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
