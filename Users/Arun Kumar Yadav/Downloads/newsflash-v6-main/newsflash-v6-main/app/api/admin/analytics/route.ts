// @ts-nocheck
import { NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import Article from '../../../models/Article'
import SarkariJob from '../../../models/SarkariJob'
import Contact from '../../../models/Contact'
import Employee from '../../../models/Employee'
import { getAuth } from '../../../lib/auth'

export async function GET() {
  const auth = getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo  = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000)

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    pendingArticles,
    totalViews,
    totalJobs,
    activeJobs,
    totalContacts,
    unreadContacts,
    totalEmployees,
    activeEmployees,
    recentArticles,
    topArticles,
    articlesByCategory,
    jobsByCategory,
    articlesLast30Days,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: 'published' }),
    Article.countDocuments({ status: 'draft' }),
    Article.countDocuments({ status: 'pending_review' }),
    Article.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    SarkariJob.countDocuments(),
    SarkariJob.countDocuments({ isActive: true, isExpired: false }),
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
    Employee.countDocuments(),
    Employee.countDocuments({ isActive: true, isSuspended: false }),
    Article.find({ status: 'published' }).sort({ createdAt: -1 }).limit(5).select('title slug category views createdAt').lean(),
    Article.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title slug views').lean(),
    Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    SarkariJob.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Article.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  return NextResponse.json({
    articles: {
      total: totalArticles,
      published: publishedArticles,
      drafts: draftArticles,
      pending: pendingArticles,
      totalViews: totalViews[0]?.total || 0,
    },
    jobs: { total: totalJobs, active: activeJobs },
    contacts: { total: totalContacts, unread: unreadContacts },
    employees: { total: totalEmployees, active: activeEmployees },
    recentArticles,
    topArticles,
    articlesByCategory,
    jobsByCategory,
    articlesLast30Days,
  })
}
