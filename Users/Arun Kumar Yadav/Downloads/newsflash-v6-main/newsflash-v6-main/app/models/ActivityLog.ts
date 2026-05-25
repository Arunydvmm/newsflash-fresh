// @ts-nocheck
import mongoose, { Schema } from 'mongoose'

const ActivityLogSchema = new Schema({
  actorId:    { type: Schema.Types.ObjectId, refPath: 'actorModel' },
  actorModel: { type: String, enum: ['Admin', 'Employee'] },
  actorName:  { type: String },
  action:     { type: String, required: true },
  resource:   { type: String, default: '' },
  resourceId: { type: String, default: '' },
  details:    { type: String, default: '' },
  ip:         { type: String, default: '' },
}, { timestamps: true })

ActivityLogSchema.index({ actorId: 1, createdAt: -1 })
ActivityLogSchema.index({ createdAt: -1 })

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema)
