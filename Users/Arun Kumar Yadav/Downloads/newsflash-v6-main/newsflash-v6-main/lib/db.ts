// @ts-nocheck
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in environment variables')

let cached = (global as any).__mongoose as { conn: any; promise: any }
if (!cached) cached = (global as any).__mongoose = { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
