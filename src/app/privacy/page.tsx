import { buildMetadata } from "@/lib/seo"
import { typeDark } from "@/lib/typography"

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how Eternally Yours collects, uses, and protects account, invitation, and RSVP data.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0a04] font-sans text-[#fdf8f0]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className={`${typeDark.h1} text-center mb-8`}>Privacy Policy</h1>
        <div className={`space-y-6 ${typeDark.body}`}>
          <p>
            <strong className={typeDark.bodyStrong}>Last updated:</strong> January 2025
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Information We Collect</h2>
          <p>
            We collect information you provide directly: account details (name, email), invitation content, and RSVP
            responses from your guests.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>How We Use Your Information</h2>
          <p>
            Your information is used solely to provide the invitation creation service: creating, saving, publishing,
            and sharing your invitations.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Data Sharing</h2>
          <p>
            Published invitations are publicly accessible via their unique URL. We do not sell or share your personal
            data with third parties.
          </p>
          <h2 className={`${typeDark.h2} mt-8`}>Security</h2>
          <p>Passwords are hashed using bcrypt. We use industry-standard security practices to protect your data.</p>
          <h2 className={`${typeDark.h2} mt-8`}>Contact</h2>
          <p>
            For privacy questions, contact us at{" "}
            <a href="mailto:privacy@sikanderkumbhar.com" className={typeDark.link}>
              privacy@sikanderkumbhar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
