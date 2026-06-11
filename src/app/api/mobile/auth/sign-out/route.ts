import { NextRequest, NextResponse } from "next/server"
import { deleteMobileSession } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  await deleteMobileSession(req)
  return NextResponse.json({ success: true })
}
