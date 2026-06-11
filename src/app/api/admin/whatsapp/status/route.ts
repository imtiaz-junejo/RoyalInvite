import { NextResponse } from "next/server"
import { requireAdminUser } from "@/lib/admin"
import { getWhatsappSenderStatus } from "@/lib/whatsapp/gateway"

export async function GET() {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: "Admin only" }, { status: 403 })

  try {
    return NextResponse.json(await getWhatsappSenderStatus())
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 502 })
  }
}
