// @ts-nocheck
import Link from 'next/link'
export default function PrivacyPolicyPage() {
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
        <h1 style={{ fontFamily:"Playfair Display, serif", fontSize:36, fontWeight:700, marginBottom:8 }}>Privacy Policy</h1>
        <div style={{ width:60, height:3, background:"#C62828", marginBottom:8 }}></div>
        <p style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color:"#aaa", marginBottom:28 }}>Last updated: May 2026</p>
        <Section title="1. Introduction">
          NewsFlash ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at newsflash-v6.onrender.com.
        </Section>
        <Section title="2. Information We Collect">
          <p style={{ marginBottom:8 }}>We may collect the following types of information:</p>
          <ul style={{ paddingLeft:20 }}>
            <li style={{ marginBottom:6 }}><strong>Usage Data:</strong> Pages visited, time spent, browser type, and device information collected automatically via server logs.</li>
            <li style={{ marginBottom:6 }}><strong>Contact Information:</strong> Name and email address if you contact us voluntarily.</li>
            <li style={{ marginBottom:6 }}><strong>Cookies:</strong> We use cookies to improve user experience and track article views.</li>
          </ul>
        </Section>
        <Section title="3. How We Use Your Information">
          <ul style={{ paddingLeft:20 }}>
            <li style={{ marginBottom:6 }}>To operate and improve our website</li>
            <li style={{ marginBottom:6 }}>To respond to your inquiries</li>
            <li style={{ marginBottom:6 }}>To analyze traffic and usage patterns</li>
            <li style={{ marginBottom:6 }}>To display relevant advertising (if applicable)</li>
          </ul>
        </Section>
        <Section title="4. AI-Generated and Sourced Content">
          NewsFlash publishes content that is sourced from publicly available online news sources and may be summarized or enhanced using artificial intelligence tools. We strive to ensure accuracy, but recommend verifying critical information from primary sources.
        </Section>
        <Section title="5. Third-Party Services">
          We may use third-party services such as Cloudinary (image hosting) and MongoDB Atlas (database). These services have their own privacy policies and we encourage you to review them.
        </Section>
        <Section title="6. Data Retention">
          We retain user data only as long as necessary for the purposes outlined in this policy. Contact form submissions are retained for up to 90 days.
        </Section>
        <Section title="7. Your Rights">
          You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, contact us at 65arunyadav65@gmail.com.
        </Section>
        <Section title="8. Cookies">
          You can disable cookies through your browser settings. Note that some features of the website may not function properly without cookies.
        </Section>
        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
        </Section>
        <Section title="10. Contact Us">
          For any privacy-related concerns, contact us at: <a href="mailto:65arunyadav65@gmail.com" style={{ color:"#C62828" }}>65arunyadav65@gmail.com</a>
        </Section>
        <div style={{ marginTop:32 }}>
          <Link href="/" style={{ background:"#C62828", color:"white", padding:"10px 20px", textDecoration:"none", fontFamily:"JetBrains Mono, monospace", fontSize:11, borderRadius:2 }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
