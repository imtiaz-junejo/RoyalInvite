import { NextRequest, NextResponse } from "next/server"
import { requireMobileUser } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const user = await requireMobileUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ user })
}
