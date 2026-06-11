import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireMobileUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (mobileUser.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 })

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { invitations: true } } } })
  return NextResponse.json({
    stats: {
      total: users.length,
      free: users.filter((user) => user.tier === "free").length,
      pro: users.filter((user) => user.tier === "pro").length,
    },
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      invitationCount: user._count.invitations,
      createdAt: user.createdAt.toISOString(),
    })),
  })
}
