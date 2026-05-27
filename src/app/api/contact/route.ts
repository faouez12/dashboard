import { NextRequest, NextResponse } from 'next/server'
import { addMessage, ContactMessage } from '@/lib/db'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_NRnVNuLx_LigAFxvENm5DDXjt2CzGPh9L')

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

    // Send email dispatch
    try {
      const emailSubject = `Shahine Contact: ${name} - ${topic || 'General Inquiry'}`
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #112a3a; border-radius: 12px; background-color: #020617; color: #f8fafc;">
            <div style="text-align: center; border-bottom: 2px solid #00f5ff; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #00f5ff; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 20px;">New Transmission Received</h2>
                <p style="color: #94a3b8; font-size: 11px; margin: 5px 0 0 0; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">Telemetry node: contact-form</p>
            </div>
            
            <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
                <p style="margin: 8px 0;"><strong style="color: #00f5ff;">From:</strong> ${name} (&lt;${email}&gt;)</p>
                <p style="margin: 8px 0;"><strong style="color: #00f5ff;">Topic:</strong> ${topic || 'General Inquiry'}</p>
                <p style="margin: 8px 0;"><strong style="color: #00f5ff;">Type:</strong> ${(type || 'other').toUpperCase()}</p>
                ${date ? `<p style="margin: 8px 0;"><strong style="color: #00f5ff;">Date of Event:</strong> ${date}</p>` : ''}
                ${runners ? `<p style="margin: 8px 0;"><strong style="color: #00f5ff;">Runners Count:</strong> ${runners}</p>` : ''}
            </div>

            ${eventDetails ? `
            <div style="background: #0f172a; padding: 15px; border-left: 4px solid #00f5ff; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px;">Event Details:</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; white-space: pre-wrap; color: #cbd5e1;">${eventDetails}</p>
            </div>
            ` : ''}

            <div style="background: #0f172a; padding: 15px; border-left: 4px solid #f43f5e; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; font-weight: bold; color: #f43f5e; text-transform: uppercase; letter-spacing: 1px;">Message:</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; white-space: pre-wrap; color: #cbd5e1;">${message}</p>
            </div>

            <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px; font-size: 11px; color: #64748b; font-family: monospace;">
                <p style="margin: 0;">This transmission was routed securely via SHAHINE PHOTOGRAPHY</p>
                <p style="margin: 5px 0 0 0; color: #00f5ff; font-weight: bold;">https://shahinephotography.com</p>
            </div>
        </div>
      `

      const { data, error } = await resend.emails.send({
        from: 'Shahine Photography <onboarding@resend.dev>',
        to: ['shahinephotography@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
      })

      if (error) {
        console.error('❌ Resend API Error:', error)
        return NextResponse.json({ 
          success: false, 
          error: error.message, 
          details: error 
        }, { status: 400 })
      }

      console.log('✅ Email notification dispatched successfully:', data)
    } catch (emailErr: any) {
      console.error('[RESEND_EMAIL_ERROR]', emailErr)
      return NextResponse.json({ 
        success: false, 
        error: 'Email connection exception', 
        details: emailErr.message 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Message saved and email sent successfully.' })
  } catch (err: any) {
    console.error('[CONTACT_API_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
