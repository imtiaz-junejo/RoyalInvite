import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function requireAdminUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  return user?.role === "admin" ? user : null
}
