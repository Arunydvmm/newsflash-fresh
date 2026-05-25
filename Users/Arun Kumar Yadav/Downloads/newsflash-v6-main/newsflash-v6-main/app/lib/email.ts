// @ts-nocheck
import nodemailer from 'nodemailer'

const ADMIN_EMAIL = process.env.GMAIL_USER || '65arunyadav65@gmail.com'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const transporter = createTransporter()

  // Email to admin
  await transporter.sendMail({
    from:    `"NewsFlash Contact" <${process.env.GMAIL_USER}>`,
    to:      ADMIN_EMAIL,
    subject: `[Contact] ${data.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <div style="background:#C62828;padding:16px 24px;border-radius:6px 6px 0 0;">
          <h2 style="color:white;margin:0;font-size:20px;">New Contact Message — NewsFlash</h2>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 6px 6px;border:1px solid #e0e0e0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#555;width:100px;">Name:</td><td style="padding:8px 0;color:#1a1a1a;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td><td style="padding:8px 0;color:#1a1a1a;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Subject:</td><td style="padding:8px 0;color:#1a1a1a;">${data.subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0;" />
          <h3 style="color:#555;font-size:14px;margin-bottom:8px;">Message:</h3>
          <p style="color:#1a1a1a;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin-top:16px;">NewsFlash V6 · newsflash-v6.onrender.com</p>
      </div>
    `,
  })

  // Auto-reply to sender
  await transporter.sendMail({
    from:    `"NewsFlash" <${process.env.GMAIL_USER}>`,
    to:      data.email,
    subject: `We received your message — NewsFlash`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <div style="background:#1A1A1A;padding:16px 24px;border-radius:6px 6px 0 0;">
          <h2 style="color:white;margin:0;font-size:20px;">NEWS<span style="color:#C62828">FLASH</span></h2>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 6px 6px;border:1px solid #e0e0e0;">
          <p style="color:#1a1a1a;font-size:16px;">Hi <strong>${data.name}</strong>,</p>
          <p style="color:#555;line-height:1.7;">Thank you for reaching out to NewsFlash. We have received your message and our team will get back to you within 24–48 hours.</p>
          <div style="background:#f5f5f5;padding:16px;border-radius:4px;margin:16px 0;border-left:4px solid #C62828;">
            <p style="color:#888;font-size:12px;margin:0 0 4px;font-weight:bold;">Your message:</p>
            <p style="color:#555;font-size:14px;margin:0;white-space:pre-wrap;">${data.message}</p>
          </div>
          <p style="color:#555;line-height:1.7;">Stay updated with India's latest news at <a href="https://newsflash-v6.onrender.com" style="color:#C62828;">newsflash-v6.onrender.com</a></p>
          <p style="color:#888;font-size:13px;">— NewsFlash Editorial Team</p>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin-top:16px;">© ${new Date().getFullYear()} NewsFlash Media · India</p>
      </div>
    `,
  })
}

export async function sendEmployeeWelcomeEmail(data: {
  email: string
  fullName: string
  username: string
  password: string
  role: string
}) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from:    `"NewsFlash Admin" <${process.env.GMAIL_USER}>`,
    to:      data.email,
    subject: `Your NewsFlash Employee Account`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <div style="background:#1A1A1A;padding:16px 24px;border-radius:6px 6px 0 0;">
          <h2 style="color:white;margin:0;">NEWS<span style="color:#C62828">FLASH</span> — Employee Portal</h2>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 6px 6px;border:1px solid #e0e0e0;">
          <p>Hi <strong>${data.fullName}</strong>,</p>
          <p>Your NewsFlash employee account has been created. Here are your login credentials:</p>
          <div style="background:#f5f5f5;padding:16px;border-radius:4px;margin:16px 0;border-left:4px solid #C62828;">
            <p><strong>Portal:</strong> <a href="https://newsflash-v6.onrender.com/staff">newsflash-v6.onrender.com/staff</a></p>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Password:</strong> ${data.password}</p>
            <p><strong>Role:</strong> ${data.role}</p>
          </div>
          <p style="color:#C62828;font-weight:bold;">Please change your password after first login.</p>
          <p>— NewsFlash Admin Team</p>
        </div>
      </div>
    `,
  })
}
