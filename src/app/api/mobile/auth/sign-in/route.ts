import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { createMobileSession, serializeMobileUser } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body?.email || "").trim().toLowerCase()
    const password = String(body?.password || "")

    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const { token, expiresAt } = await createMobileSession(user.id)
    return NextResponse.json({ token, expiresAt: expiresAt.toISOString(), user: serializeMobileUser(user) })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
  }
}
