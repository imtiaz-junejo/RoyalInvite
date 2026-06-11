import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  return (
    <div className={dt.containerNarrow}>
      <h1 className={`${dt.heading} mb-8`}>Settings</h1>
      <div className="space-y-6">
        <div className={dt.card}>
          <h2 className={dt.headingSm}>Account</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className={dt.label}>Name</p>
              <p className={`mt-1 ${type.bodyStrong}`}>{session.user.name}</p>
            </div>
            <div>
              <p className={dt.label}>Email</p>
              <p className={`mt-1 ${type.bodyStrong}`}>{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className={dt.card}>
          <h2 className={dt.headingSm}>Production domain</h2>
          <p className={`${dt.subheading} mt-2`}>Your invitations will be shared from:</p>
          <code className={`mt-3 block rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 ${type.caption} text-neutral-700`}>
            {process.env.APP_URL || "https://invite.sikanderkumbhar.com"}/invite/[slug]
          </code>
        </div>
      </div>
    </div>
  )
}
