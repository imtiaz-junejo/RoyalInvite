import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invitation = await prisma.invitation.findUnique({ where: { id }, select: { id: true } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const source = req.nextUrl.searchParams.get("source") || undefined
    await prisma.invitationView.create({
      data: {
        invitationId: invitation.id,
        source,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
