// @ts-nocheck
import { NextResponse } from 'next/server'
import { connectDB } from '../../lib/db'
import Article from '../../models/Article'

const SITE_URL = 'https://newsflash-v6.onrender.com'

export async function GET() {
  await connectDB()
  const articles = await Article.find({ status: 'published' }).sort({ createdAt: -1 }).lean()

  const staticPages = [
    { url: SITE_URL, priority: '1.0', changefreq: 'hourly' },
    { url: `${SITE_URL}/about`, priority: '0.5', changefreq: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: '0.5', changefreq: 'monthly' },
    { url: `${SITE_URL}/privacy-policy`, priority: '0.3', changefreq: 'yearly' },
    { url: `${SITE_URL}/terms`, priority: '0.3', changefreq: 'yearly' },
    ...['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion'].map(c => ({
      url: `${SITE_URL}/?category=${c}`, priority: '0.7', changefreq: 'hourly'
    }))
  ]

  const articleUrls = articles.map(a => ({
    url: `${SITE_URL}/article/${a.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: new Date(a.updatedAt || a.createdAt).toISOString(),
  }))

  const allUrls = [...staticPages, ...articleUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 's-maxage=3600' }
  })
}
