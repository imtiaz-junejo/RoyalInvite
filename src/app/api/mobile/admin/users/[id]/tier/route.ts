import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireMobileUser, serializeMobileUser } from "@/lib/mobile-auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (mobileUser.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 })

  try {
    const { id } = await params
    const { tier } = await req.json()
    if (!["free", "pro"].includes(tier)) return NextResponse.json({ error: "Invalid tier. Must be 'free' or 'pro'." }, { status: 400 })

    const user = await prisma.user.update({ where: { id }, data: { tier } })
    return NextResponse.json({ user: serializeMobileUser(user) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
