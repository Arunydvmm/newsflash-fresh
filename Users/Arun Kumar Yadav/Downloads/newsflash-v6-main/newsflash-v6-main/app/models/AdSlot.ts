// @ts-nocheck
import mongoose, { Schema } from 'mongoose'

const AdSlotSchema = new Schema({
  slotId:   { type: String, required: true, unique: true },
  name:     String,
  size:     String,
  position: String,
  enabled:  { type: Boolean, default: false },
  script:   { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.AdSlot || mongoose.model('AdSlot', AdSlotSchema)
