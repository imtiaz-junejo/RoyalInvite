"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function deleteInvitation(id: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) return
  await prisma.invitation.deleteMany({ where: { id, userId: session.user.id } })
}
