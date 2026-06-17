import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { parseTemplateKey } from "@/lib/template-defaults"
import { NewInvitationClient } from "./new-invitation-client"
import { canCreateInvitation } from "@/lib/tier-config"

function BuilderLoading() {
  return (
    <div className="flex min-h-[calc(100vh-var(--site-nav-height))] items-center justify-center bg-neutral-50 font-sans text-sm text-neutral-500">
      Loading builder…
    </div>
  )
}

async function NewInvitationContent({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { invitations: true } } },
  })

  if (!user) redirect("/sign-in")

  const tier = (user.tier as "free" | "pro") || "free"
  const canCreate = canCreateInvitation(user._count.invitations, tier)

  if (!canCreate) {
    redirect("/dashboard?limit=true")
  }

  const params = await searchParams
  const templateKey = parseTemplateKey(params.template ?? null)

  return <NewInvitationClient templateKey={templateKey} />
}

export default function NewInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  return (
    <Suspense fallback={<BuilderLoading />}>
      <NewInvitationContent searchParams={searchParams} />
    </Suspense>
  )
}
