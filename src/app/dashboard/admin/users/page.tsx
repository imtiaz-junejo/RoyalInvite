import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import UserTierManager from "./user-tier-manager"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "admin") redirect("/dashboard")
  return { session, user }
}

export default async function AdminUsersPage() {
  await requireAdmin()

  const [allUsers, totalFree, totalPro] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { invitations: true } } },
    }),
    prisma.user.count({ where: { tier: "free" } }),
    prisma.user.count({ where: { tier: "pro" } }),
  ])

  return (
    <div className={dt.containerWide}>
        <div className="mb-8">
          <h1 className={dt.heading}>Manage users</h1>
          <p className={`${dt.subheading} mt-2`}>Control user tiers and access</p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Total users</p>
            <p className={dt.statValue}>{allUsers.length}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Free tier</p>
            <p className={`${dt.statValue} text-neutral-600`}>{totalFree}</p>
          </div>
          <div className={dt.statCard}>
            <p className={dt.statLabel}>Pro tier</p>
            <p className={`${dt.statValue} text-brand-600`}>{totalPro}</p>
          </div>
        </div>

        <div className={dt.tableWrap}>
          <div className={`border-b px-5 py-4 ${dt.divider}`}>
            <h2 className={dt.headingSm}>All users</h2>
          </div>
          <UserTierManager
            users={allUsers.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              tier: u.tier as "free" | "pro",
              role: u.role,
              invitationCount: u._count.invitations,
              createdAt: u.createdAt.toISOString(),
            }))}
          />
        </div>
    </div>
  )
}
