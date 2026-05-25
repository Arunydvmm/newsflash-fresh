// @ts-nocheck
import mongoose, { Schema } from 'mongoose'

const ArticleSchema = new Schema({
  title:            { type: String, required: true },
  slug:             { type: String, unique: true },
  summary:          { type: String, required: true },
  content:          { type: String, required: true },
  featuredImage:    { type: String, default: '' },
  videoUrl:         { type: String, default: '' },
  keyHighlights:    [String],
  referenceLinks:   [{ sourceName: String, url: String }],
  category: {
    type: String, required: true,
    enum: ['India','World','Business','Technology','Sports','Science','Health','Entertainment','Opinion','Cricket','Sarkari'],
  },
  tags:     [String],
  status:   { type: String, enum: ['draft','published','pending_review'], default: 'draft' },
  views:    { type: Number, default: 0 },
  readTime: { type: Number, default: 3 },
  author:   { type: String, default: 'NewsFlash Desk' },
  authorId: { type: Schema.Types.ObjectId, ref: 'Employee' },
  isDataDriven:  { type: Boolean, default: false },
  articleType:   { type: String, default: 'standard' },
  dataSource:    { type: String, default: '' },
  lastUpdated:   Date,
  isFeatured:    { type: Boolean, default: false },
  isBreaking:    { type: Boolean, default: false },
}, { timestamps: true })

ArticleSchema.pre('validate', function (next) {
  if (this.isModified('title') && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  if (this.isModified('content') && this.content) {
    const words = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length
    this.readTime = Math.max(1, Math.round(words / 200))
  }
  next()
})

ArticleSchema.index({ title: 'text', summary: 'text', tags: 'text' })
ArticleSchema.index({ status: 1, createdAt: -1 })
ArticleSchema.index({ category: 1, status: 1 })
ArticleSchema.index({ isBreaking: 1 })

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)
