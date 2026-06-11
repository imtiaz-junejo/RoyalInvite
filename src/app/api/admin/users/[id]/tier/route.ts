import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify admin
  const admin = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (admin?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 })

  try {
    const { id } = await params
    const body = await req.json()
    const { tier } = body as { tier: string }

    if (!["free", "pro"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier. Must be 'free' or 'pro'." }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { tier },
    })

    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
