// @ts-nocheck
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const EmployeeSchema = new Schema({
  name:         { type: String, required: true },
  username:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['NewsEditor','CricketManager','SarkariManager','SEOManager','ContentWriter','Moderator','AdManager'],
    required: true,
  },
  permissions: {
    addArticles:        { type: Boolean, default: false },
    editOwnArticles:    { type: Boolean, default: true  },
    editAllArticles:    { type: Boolean, default: false },
    deleteArticles:     { type: Boolean, default: false },
    publishArticles:    { type: Boolean, default: false },
    manageJobs:         { type: Boolean, default: false },
    manageCricket:      { type: Boolean, default: false },
    manageAds:          { type: Boolean, default: false },
    viewAnalytics:      { type: Boolean, default: false },
    manageSettings:     { type: Boolean, default: false },
  },
  isActive:     { type: Boolean, default: true },
  isSuspended:  { type: Boolean, default: false },
  avatar:       { type: String, default: '' },
  lastLogin:    Date,
  createdBy:    { type: Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true })

EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

EmployeeSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash)
}

// Default permissions by role
EmployeeSchema.pre('validate', function (next) {
  if (this.isNew) {
    const defaults: Record<string, Partial<typeof this.permissions>> = {
      NewsEditor:      { addArticles: true, editOwnArticles: true, editAllArticles: true },
      CricketManager:  { addArticles: true, editOwnArticles: true, manageCricket: true },
      SarkariManager:  { addArticles: true, editOwnArticles: true, manageJobs: true },
      SEOManager:      { editAllArticles: true, viewAnalytics: true, manageSettings: true },
      ContentWriter:   { addArticles: true, editOwnArticles: true },
      Moderator:       { editAllArticles: true, viewAnalytics: true },
      AdManager:       { manageAds: true, viewAnalytics: true },
    }
    const d = defaults[this.role] || {}
    Object.assign(this.permissions, d)
  }
  next()
})

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)
