import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  const invitations = await prisma.invitation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { rsvps: true, views: true, guestbookEntries: true } } },
  })

  const totalViews = invitations.reduce((sum, invitation) => sum + invitation._count.views, 0)

  const tier = (user?.tier as "free" | "pro") || "free"

  return (
    <DashboardClient
      userName={session.user.name || "Guest"}
      invitations={invitations}
      totalViews={totalViews}
      tier={tier}
      invitationCount={invitations.length}
      isAdmin={user?.role === "admin"}
    />
  )
}
