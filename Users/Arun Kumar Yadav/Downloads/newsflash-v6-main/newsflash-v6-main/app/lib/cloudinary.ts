// @ts-nocheck
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export async function uploadImage(source: string): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    folder: 'newsflash',
    transformation: [{ width: 1280, height: 720, crop: 'fill', quality: 'auto:good' }],
  })
  return result.secure_url
}

export default cloudinary
