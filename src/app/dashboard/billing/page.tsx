import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { BillingClient } from "./billing-client"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      tier: true,
      _count: { select: { invitations: true } },
    },
  })

  if (!user) redirect("/sign-in")

  return (
    <BillingClient
      userName={user.name}
      userEmail={user.email}
      tier={user.tier as "free" | "pro"}
      invitationCount={user._count.invitations}
    />
  )
}
