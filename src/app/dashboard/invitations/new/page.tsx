import { Suspense } from "react"
import { parseTemplateKey } from "@/lib/template-defaults"
import { NewInvitationClient } from "./new-invitation-client"

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
