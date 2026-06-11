import { NextRequest, NextResponse } from "next/server"
import { requireMobileUser } from "@/lib/mobile-auth"
import { getWhatsappSenderStatus } from "@/lib/whatsapp/gateway"

export async function GET(req: NextRequest) {
  const mobileUser = await requireMobileUser(req)
  if (!mobileUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (mobileUser.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 })

  try {
    return NextResponse.json(await getWhatsappSenderStatus())
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 502 })
  }
}
