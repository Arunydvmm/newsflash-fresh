// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../lib/db'
import Contact from '../../models/Contact'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const body = await req.json()
  const { name, email, subject, message } = body

  if (!name || !email || !subject || !message)
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })

  if (message.length < 10)
    return NextResponse.json({ error: 'Message too short' }, { status: 400 })

  await connectDB()

  // Save to DB
  const contact = await Contact.create({ name, email, subject, message, ipAddress: ip })

  // Send email to admin
  try {
    await transporter.sendMail({
      from: `"NewsFlash Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `[NewsFlash Contact] ${subject}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <div style="background:#C62828;padding:20px 24px">
            <h2 style="color:white;margin:0;font-size:18px">New Contact Message — NewsFlash</h2>
          </div>
          <div style="padding:24px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666;font-size:13px;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#C62828">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:13px">Subject</td><td style="padding:8px 0;font-weight:600">${subject}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f9f9f9;border-radius:4px;border-left:3px solid #C62828">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#333">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top:16px;font-size:12px;color:#999">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST · IP: ${ip}</p>
            <p style="font-size:12px;color:#999">View in admin panel: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/contacts" style="color:#C62828">/admin/contacts</a></p>
          </div>
        </div>
      `,
    })

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"NewsFlash" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We received your message — NewsFlash`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <div style="background:#1A1A1A;padding:20px 24px">
            <h2 style="color:white;margin:0;font-size:20px">NEWS<span style="color:#C62828">FLASH</span></h2>
          </div>
          <div style="padding:24px">
            <p style="font-size:15px;color:#333">Hi <strong>${name}</strong>,</p>
            <p style="font-size:14px;color:#555;line-height:1.7">Thank you for reaching out to us. We have received your message and our team will get back to you within 24–48 hours.</p>
            <div style="margin:20px 0;padding:16px;background:#f9f9f9;border-radius:4px;border-left:3px solid #C62828">
              <p style="margin:0;font-size:13px;color:#666"><strong>Your message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="font-size:13px;color:#999">If this was not you, please ignore this email.</p>
            <p style="font-size:13px;color:#555">— NewsFlash Editorial Team</p>
          </div>
          <div style="background:#f5f5f5;padding:12px 24px;text-align:center">
            <p style="font-size:11px;color:#999;margin:0">© ${new Date().getFullYear()} NewsFlash Media · <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#C62828">newsflash-v6.onrender.com</a></p>
          </div>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Email send error:', emailErr)
    // Don't fail the request — message is saved in DB
  }

  return NextResponse.json({ success: true, id: String(contact._id) })
}

export async function GET(req: NextRequest) {
  // Admin only — get all contact messages
  const { getAuth } = await import('../../lib/auth')
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const page  = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = 20
  const [messages, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Contact.countDocuments(),
  ])
  return NextResponse.json({ messages, total, page, pages: Math.ceil(total / limit) })
}
