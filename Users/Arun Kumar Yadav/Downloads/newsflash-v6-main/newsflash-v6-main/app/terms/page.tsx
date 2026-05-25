// @ts-nocheck
import Link from 'next/link'
export default function TermsPage() {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom:28 }}>
      <h2 style={{ fontFamily:"Playfair Display, serif", fontSize:22, fontWeight:700, marginBottom:10, color:"#1A1A1A" }}>{title}</h2>
      <div style={{ fontSize:15, color:"#444", lineHeight:1.8 }}>{children}</div>
    </div>
  )
  return (
    <div style={{ fontFamily:"Inter, sans-serif", background:"#FAFAF8", minHeight:"100vh" }}>
      <div style={{ background:"#1A1A1A", padding:"14px 20px" }}>
        <Link href="/" style={{ fontFamily:"Playfair Display, serif", fontSize:24, fontWeight:900, color:"white", textDecoration:"none" }}>NEWS<span style={{ color:"#C62828" }}>FLASH</span></Link>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px" }}>
        <h1 style={{ fontFamily:"Playfair Display, serif", fontSize:36, fontWeight:700, marginBottom:8 }}>Terms of Service</h1>
        <div style={{ width:60, height:3, background:"#C62828", marginBottom:8 }}></div>
        <p style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color:"#aaa", marginBottom:28 }}>Last updated: May 2026</p>
        <Section title="1. Acceptance of Terms">
          By accessing or using NewsFlash, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
        </Section>
        <Section title="2. Use of Content">
          <p style={{ marginBottom:8 }}>All content on NewsFlash, including articles, images, and other materials, is for informational purposes only. You may:</p>
          <ul style={{ paddingLeft:20 }}>
            <li style={{ marginBottom:6 }}>Read and share articles with proper attribution to NewsFlash</li>
            <li style={{ marginBottom:6 }}>Use content for personal, non-commercial purposes</li>
          </ul>
          <p style={{ marginTop:8 }}>You may not reproduce, republish, or redistribute our content for commercial purposes without written permission.</p>
        </Section>
        <Section title="3. AI-Generated Content Disclaimer">
          NewsFlash uses artificial intelligence to summarize and enhance news content sourced from publicly available online sources. While we strive for accuracy, AI-generated content may contain errors or omissions. We are not liable for decisions made based on our content. Always verify important information from authoritative primary sources.
        </Section>
        <Section title="4. User Conduct">
          You agree not to use NewsFlash to: spread misinformation, engage in illegal activities, attempt to hack or disrupt our services, or impersonate any person or entity.
        </Section>
        <Section title="5. Intellectual Property">
          The NewsFlash name, logo, and original content are the intellectual property of NewsFlash Media. Sourced content belongs to the respective original publishers and is used under fair use principles for news reporting and commentary.
        </Section>
        <Section title="6. Third-Party Links">
          Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.
        </Section>
        <Section title="7. Limitation of Liability">
          NewsFlash is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the website or reliance on its content.
        </Section>
        <Section title="8. Governing Law">
          These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.
        </Section>
        <Section title="9. Changes to Terms">
          We reserve the right to modify these Terms at any time. Continued use of the website after changes constitutes acceptance of the new Terms.
        </Section>
        <Section title="10. Contact">
          For questions about these Terms, contact us at: <a href="mailto:65arunyadav65@gmail.com" style={{ color:"#C62828" }}>65arunyadav65@gmail.com</a>
        </Section>
        <div style={{ marginTop:32 }}>
          <Link href="/" style={{ background:"#C62828", color:"white", padding:"10px 20px", textDecoration:"none", fontFamily:"JetBrains Mono, monospace", fontSize:11, borderRadius:2 }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
