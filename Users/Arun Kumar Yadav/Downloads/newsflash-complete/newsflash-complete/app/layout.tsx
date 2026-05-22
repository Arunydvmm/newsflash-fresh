import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NewsFlash', template: '%s | NewsFlash' },
  description: "India's most trusted digital newsroom.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#FAFAF8', color: '#1A1A1A' }}>
        {children}
      </body>
    </html>
  )
}
