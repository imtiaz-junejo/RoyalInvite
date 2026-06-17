"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function deleteInvitation(id: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) return
  await prisma.invitation.deleteMany({ where: { id, userId: session.user.id } })
}

export async function updateProfile(data: {
  name: string
  company: string
  timezone: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name.trim(),
        company: data.company.trim() || null,
        timezone: data.timezone,
      },
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update profile" }
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { success: false, error: "User not found" }

  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash)
  if (!valid) return { success: false, error: "Current password is incorrect" }

  if (data.newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters" }
  }

  try {
    const hash = await bcrypt.hash(data.newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hash },
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to change password" }
  }
}
