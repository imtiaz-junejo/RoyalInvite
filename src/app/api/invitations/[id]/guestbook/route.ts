import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { guestbookSchema } from "@/lib/validations"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invitation = await prisma.invitation.findUnique({ where: { id } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const entries = await prisma.guestbookEntry.findMany({
      where: { invitationId: invitation.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const validated = guestbookSchema.parse(body)

    const invitation = await prisma.invitation.findUnique({ where: { id } })
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 })

    const entry = await prisma.guestbookEntry.create({
      data: {
        invitationId: invitation.id,
        guestName: validated.guestName,
        message: validated.message,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
