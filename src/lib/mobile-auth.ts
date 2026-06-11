import crypto from "crypto"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export type MobileUser = {
  id: string
  name: string
  email: string
  role: string
  tier: string
}

const SESSION_DAYS = 30

function sessionSecret() {
  return process.env.MOBILE_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "dev-mobile-session-secret"
}

export function hashMobileToken(token: string) {
  return crypto.createHash("sha256").update(`${token}:${sessionSecret()}`).digest("hex")
}

export function createMobileToken() {
  return crypto.randomBytes(32).toString("base64url")
}

export function serializeMobileUser(user: MobileUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tier: user.tier,
  }
}

export async function createMobileSession(userId: string) {
  const token = createMobileToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.mobileSession.create({
    data: {
      userId,
      tokenHash: hashMobileToken(token),
      expiresAt,
    },
  })

  return { token, expiresAt }
}

export function getBearerToken(req: NextRequest) {
  const value = req.headers.get("authorization") || ""
  const [scheme, token] = value.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null
  return token
}

export async function requireMobileUser(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) return null

  const session = await prisma.mobileSession.findUnique({
    where: { tokenHash: hashMobileToken(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.mobileSession.delete({ where: { id: session.id } })
    return null
  }

  return serializeMobileUser(session.user)
}

export async function deleteMobileSession(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) return
  await prisma.mobileSession.deleteMany({ where: { tokenHash: hashMobileToken(token) } })
}
