// @ts-nocheck
import { connectDB } from './lib/db'
import Article from './models/Article'
import SarkariJob from './models/SarkariJob'

const SITE_URL = 'https://newsflash-v6.onrender.com'

export default async function sitemap() {
  await connectDB()

  const [articles, jobs] = await Promise.all([
    Article.find({ status: 'published' }).sort({ createdAt: -1 }).select('slug updatedAt createdAt').lean(),
    SarkariJob.find({ isActive: true, isExpired: false }).sort({ createdAt: -1 }).select('slug updatedAt createdAt').lean(),
  ])

  const staticPages = [
    { url: SITE_URL,                          lastModified: new Date(), changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${SITE_URL}/cricket`,             lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${SITE_URL}/sarkari`,             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const articlePages = articles.map(a => ({
    url: `${SITE_URL}/article/${a.slug}`,
    lastModified: new Date(a.updatedAt || a.createdAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const jobPages = jobs.map(j => ({
    url: `${SITE_URL}/sarkari/${j.slug}`,
    lastModified: new Date(j.updatedAt || j.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages, ...jobPages]
}
