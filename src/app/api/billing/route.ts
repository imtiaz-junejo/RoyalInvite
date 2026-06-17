import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { tier } = body as { tier: string }

    if (!["free", "pro"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { tier },
      select: { id: true, tier: true, email: true, name: true },
    })

    return NextResponse.json({
      success: true,
      user,
      message: tier === "pro" ? "Upgraded to Pro successfully!" : "Downgraded to Free tier.",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update tier" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tier: true,
        email: true,
        name: true,
        _count: { select: { invitations: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      tier: user.tier,
      invitationCount: user._count.invitations,
      limit: user.tier === "pro" ? Infinity : 5,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch billing info" }, { status: 500 })
  }
}
