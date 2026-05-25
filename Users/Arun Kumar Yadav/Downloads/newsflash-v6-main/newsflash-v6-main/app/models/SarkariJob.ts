// @ts-nocheck
import mongoose, { Schema } from 'mongoose'

const SarkariJobSchema = new Schema({
  title:          { type: String, required: true },
  slug:           { type: String, unique: true },
  organization:   { type: String, required: true },
  category: {
    type: String,
    enum: ['Railway','SSC','UPSC','Police','Defence','Bank','Teaching','State','PSU','Internship','Private','Other'],
    required: true,
  },
  state:          { type: String, default: 'All India' },
  qualification:  [String],
  totalVacancy:   { type: Number, default: 0 },
  salaryMin:      { type: Number, default: 0 },
  salaryMax:      { type: Number, default: 0 },
  salaryText:     { type: String, default: '' },
  ageMin:         { type: Number, default: 18 },
  ageMax:         { type: Number, default: 35 },
  applicationFee: { type: String, default: 'No Fee' },
  selectionProcess: [String],
  importantDates: {
    notificationDate: Date,
    startDate:        Date,
    lastDate:         { type: Date, required: true },
    examDate:         Date,
    resultDate:       Date,
  },
  description:    { type: String, required: true },
  eligibility:    { type: String, default: '' },
  howToApply:     { type: String, default: '' },
  officialWebsite:{ type: String, default: '' },
  applyLink:      { type: String, default: '' },
  notificationPdf:{ type: String, default: '' },
  tags:           [String],
  views:          { type: Number, default: 0 },
  isActive:       { type: Boolean, default: true },
  isFeatured:     { type: Boolean, default: false },
  isExpired:      { type: Boolean, default: false },
  postedBy:       { type: Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true })

SarkariJobSchema.pre('validate', function (next) {
  if (this.isModified('title') && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
  }
  // Auto-expire
  if (this.importantDates?.lastDate && new Date(this.importantDates.lastDate) < new Date()) {
    this.isExpired = true
  }
  next()
})

SarkariJobSchema.index({ title: 'text', organization: 'text', tags: 'text' })
SarkariJobSchema.index({ category: 1, isActive: 1, isExpired: 1 })
SarkariJobSchema.index({ state: 1 })
SarkariJobSchema.index({ 'importantDates.lastDate': 1 })

export default mongoose.models.SarkariJob || mongoose.model('SarkariJob', SarkariJobSchema)
