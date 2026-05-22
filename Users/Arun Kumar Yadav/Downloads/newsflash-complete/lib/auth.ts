import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
export const AUTH_COOKIE = 'nf_token'

export interface JWTPayload {
  adminId: string
  username: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' } as any)
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getAuth(): JWTPayload | null {
  try {
    const token = cookies().get(AUTH_COOKIE)?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
