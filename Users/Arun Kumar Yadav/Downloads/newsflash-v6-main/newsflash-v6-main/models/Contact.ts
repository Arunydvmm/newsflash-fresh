// @ts-nocheck
import mongoose, { Schema } from 'mongoose'

const ContactSchema = new Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  subject:   { type: String, required: true, trim: true },
  message:   { type: String, required: true, trim: true },
  isRead:    { type: Boolean, default: false },
  isReplied: { type: Boolean, default: false },
  ipAddress: { type: String, default: '' },
}, { timestamps: true })

ContactSchema.index({ isRead: 1, createdAt: -1 })

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
