// @ts-nocheck
import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: String,
  featuredImage: String,
  tags: [String],
  readTime: { type: Number, default: 3 },
  views: { type: Number, default: 0 },
  status: { type: String, default: 'draft', enum: ['draft', 'published', 'archived'] },
  
  // NEW: Data-driven fields
  isDataDriven: { type: Boolean, default: false },
  articleType: String,
  dataSource: String,
  lastUpdated: Date,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)
