import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { createMobileSession, serializeMobileUser } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body?.name || "").trim()
    const email = String(body?.email || "").trim().toLowerCase()
    const password = String(body?.password || "")

    if (!name || !email || !password) return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 })

    const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } })
    const { token, expiresAt } = await createMobileSession(user.id)

    return NextResponse.json({ token, expiresAt: expiresAt.toISOString(), user: serializeMobileUser(user) }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
  }
}
