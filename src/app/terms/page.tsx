import { buildMetadata } from "@/lib/seo"
import { typeDark } from "@/lib/typography"

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Review the terms for using Eternally Yours to create, publish, and share wedding invitations online.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d0a04] font-sans text-[#fdf8f0]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className={`${typeDark.h1} text-center mb-8`}>Terms of Service</h1>
        <div className={`space-y-6 ${typeDark.body}`}>
          <p>
            <strong className={typeDark.bodyStrong}>Last updated:</strong> January 2025
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Acceptance of Terms</h2>
          <p>
            By using Eternally Yours, you agree to these terms. We provide a platform for creating and sharing wedding
            invitations.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Your Content</h2>
          <p>
            You retain ownership of all content you create. You are responsible for the accuracy and legality of your
            invitation content.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Prohibited Use</h2>
          <p>You may not use this service for illegal purposes, to send spam, or to infringe on others&apos; rights.</p>
          <h2 className={`${typeDark.h2} mt-8`}>Limitation of Liability</h2>
          <p>
            We provide the service &quot;as is&quot; without warranties. We are not liable for any damages arising from
            your use of the service.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Changes</h2>
          <p>We may update these terms at any time. Continued use constitutes acceptance of updated terms.</p>
        </div>
      </div>
    </div>
  )
}
