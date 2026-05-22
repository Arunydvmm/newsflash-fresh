import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['SuperAdmin','Editor'], default: 'Editor' },
  lastLogin:    Date,
}, { timestamps: true })

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

AdminSchema.methods.comparePassword = function(candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash)
}

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
