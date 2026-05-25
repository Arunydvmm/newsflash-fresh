// @ts-nocheck
import Link from 'next/link'
export default function AboutPage() {
  return (
    <div style={{ fontFamily:"Inter, sans-serif", background:"#FAFAF8", minHeight:"100vh" }}>
      <div style={{ background:"#1A1A1A", padding:"14px 20px" }}>
        <Link href="/" style={{ fontFamily:"Playfair Display, serif", fontSize:24, fontWeight:900, color:"white", textDecoration:"none" }}>NEWS<span style={{ color:"#C62828" }}>FLASH</span></Link>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px", lineHeight:1.8 }}>
        <h1 style={{ fontFamily:"Playfair Display, serif", fontSize:36, fontWeight:700, marginBottom:8 }}>About Us</h1>
        <div style={{ width:60, height:3, background:"#C62828", marginBottom:24 }}></div>
        <p style={{ fontSize:16, color:"#444", marginBottom:16 }}>
          <strong>NewsFlash</strong> is an independent digital news platform based in India, dedicated to delivering fast, accurate, and unbiased news coverage across politics, business, technology, sports, health, and more.
        </p>
        <p style={{ fontSize:16, color:"#444", marginBottom:16 }}>
          Our content is curated from reputable online sources and enhanced using artificial intelligence to ensure clarity, readability, and factual accuracy. We believe in making news accessible to every Indian, in a format that is easy to read and understand.
        </p>
        <p style={{ fontSize:16, color:"#444", marginBottom:16 }}>
          NewsFlash was founded with a simple mission: to cut through the noise and deliver what matters most — real news, in real time.
        </p>
        <h2 style={{ fontFamily:"Playfair Display, serif", fontSize:24, fontWeight:700, marginTop:32, marginBottom:12 }}>Our Mission</h2>
        <p style={{ fontSize:16, color:"#444", marginBottom:16 }}>
          To democratize access to quality journalism in India by leveraging technology to surface the most important stories of the day — clearly, concisely, and without bias.
        </p>
        <h2 style={{ fontFamily:"Playfair Display, serif", fontSize:24, fontWeight:700, marginTop:32, marginBottom:12 }}>Contact</h2>
        <p style={{ fontSize:16, color:"#444" }}>
          For queries, partnerships, or feedback, reach us at: <a href="mailto:65arunyadav65@gmail.com" style={{ color:"#C62828" }}>65arunyadav65@gmail.com</a>
        </p>
        <div style={{ marginTop:32 }}>
          <Link href="/" style={{ background:"#C62828", color:"white", padding:"10px 20px", textDecoration:"none", fontFamily:"JetBrains Mono, monospace", fontSize:11, borderRadius:2 }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
