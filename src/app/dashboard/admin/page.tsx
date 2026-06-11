import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { ButtonLink } from "@/components/ui/button"
import { formatEventDate } from "@/lib/ssr"
import { Users, FileText, Mail, Activity, Eye, Shield, MessageCircle } from "lucide-react"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "admin") redirect("/dashboard")
  return { session, user }
}

export default async function AdminPage() {
  await requireAdmin()

  const [totalUsers, totalInvitations, totalRsvps, allInvitations, allUsers] = await Promise.all([
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.rsvp.count(),
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { _count: { select: { rsvps: true } }, user: { select: { name: true, email: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { invitations: true } } },
    }),
  ])

  return (
    <div className={dt.container}>
        <div className="mb-8">
          <h1 className={dt.heading}>Welcome, Admin</h1>
          <p className={`${dt.subheading} mt-2`}>Platform overview & management</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-6">
          <StatCard icon={Users} label="Total Users" value={totalUsers} iconClass="text-brand-600" />
          <StatCard icon={FileText} label="Invitations" value={totalInvitations} iconClass="text-rose-500" />
          <StatCard icon={Mail} label="RSVPs" value={totalRsvps} iconClass="text-emerald-600" />
          <Link href="/dashboard/admin/users" className={`${dt.statCard} block transition hover:border-brand-300 hover:shadow-md`}>
            <Users size={22} className="mx-auto mb-2 text-brand-600" />
            <p className={dt.statLabel}>Manage Users</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">Tier control</p>
          </Link>
          <Link href="/dashboard/admin/whatsapp" className={`${dt.statCard} block transition hover:border-brand-300 hover:shadow-md`}>
            <MessageCircle size={22} className="mx-auto mb-2 text-emerald-600" />
            <p className={dt.statLabel}>WhatsApp</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">Sender control</p>
          </Link>
          <StatCard
            icon={Activity}
            label="Published"
            value={allInvitations.filter((i) => i.isPublished).length}
            iconClass="text-sky-600"
          />
        </div>

        <div className="mb-10">
          <h2 className={`${dt.headingSm} mb-4 flex items-center gap-2`}>
            <FileText size={18} className="text-brand-600" /> All invitations
          </h2>
          <div className={dt.tableWrap}>
            <table className="w-full text-sm">
              <thead className={dt.tableHead}>
                <tr className="border-b border-neutral-200">
                  <th className={dt.tableHeadCell}>Title</th>
                  <th className={`${dt.tableHeadCell} hidden sm:table-cell`}>Owner</th>
                  <th className={dt.tableHeadCell}>Status</th>
                  <th className={`${dt.tableHeadCell} hidden md:table-cell`}>RSVPs</th>
                  <th className={`${dt.tableHeadCell} hidden lg:table-cell`}>Created</th>
                  <th className={dt.tableHeadCell} />
                </tr>
              </thead>
              <tbody>
                {allInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                      No invitations yet
                    </td>
                  </tr>
                ) : (
                  allInvitations.map((inv) => (
                    <tr key={inv.id} className={dt.tableRow}>
                      <td className={`${dt.tableCell} max-w-[200px] truncate font-medium text-neutral-900`}>
                        {inv.title}
                      </td>
                      <td className={`${dt.tableCell} hidden text-neutral-600 sm:table-cell`}>
                        {inv.user.name || inv.user.email}
                      </td>
                      <td className={dt.tableCell}>
                        {inv.isPublished ? (
                          <span className={dt.badgePublished}>Published</span>
                        ) : (
                          <span className={dt.badgeDraft}>Draft</span>
                        )}
                      </td>
                      <td className={`${dt.tableCell} hidden text-neutral-600 md:table-cell`}>{inv._count.rsvps}</td>
                      <td className={`${dt.tableCell} hidden text-xs text-neutral-500 lg:table-cell`}>
                        {formatEventDate(inv.createdAt)}
                      </td>
                      <td className={dt.tableCell}>
                        <ButtonLink href={`/invite/${inv.slug}`} variant="ghost" size="sm" tone="light">
                          <Eye size={14} />
                        </ButtonLink>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className={`${dt.headingSm} mb-4 flex items-center gap-2`}>
            <Users size={18} className="text-brand-600" /> All users
          </h2>
          <div className={dt.tableWrap}>
            <table className="w-full text-sm">
              <thead className={dt.tableHead}>
                <tr className="border-b border-neutral-200">
                  <th className={dt.tableHeadCell}>Name</th>
                  <th className={dt.tableHeadCell}>Email</th>
                  <th className={dt.tableHeadCell}>Role</th>
                  <th className={`${dt.tableHeadCell} hidden md:table-cell`}>Invitations</th>
                  <th className={`${dt.tableHeadCell} hidden md:table-cell`}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className={dt.tableRow}>
                    <td className={`${dt.tableCell} font-medium text-neutral-900`}>{u.name}</td>
                    <td className={`${dt.tableCell} text-neutral-600`}>{u.email}</td>
                    <td className={dt.tableCell}>
                      {u.role === "admin" ? (
                        <span className={dt.badgePro}>Admin</span>
                      ) : (
                        <span className={dt.badgeFree}>User</span>
                      )}
                    </td>
                    <td className={`${dt.tableCell} hidden text-neutral-600 md:table-cell`}>
                      {u._count.invitations}
                    </td>
                    <td className={`${dt.tableCell} hidden text-xs text-neutral-500 md:table-cell`}>
                      {formatEventDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: number
  iconClass: string
}) {
  return (
    <div className={dt.statCard}>
      <Icon size={22} className={iconClass} />
      <p className={`${dt.statLabel} mt-2`}>{label}</p>
      <p className={dt.statValue}>{value}</p>
    </div>
  )
}
