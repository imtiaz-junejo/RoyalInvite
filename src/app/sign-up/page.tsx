import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { AuthPageShell } from "@/components/marketing/auth-page-shell"
import SignUpForm from "./sign-up-form"

export const metadata = buildMetadata({
  title: "Sign Up",
  description: "Create an account to design, publish, and track your digital wedding invitations.",
  path: "/sign-up",
  noIndex: true,
})

export default async function SignUpPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <AuthPageShell
      title="Create your account"
      subtitle="Start building your dream wedding invitation for free"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className={mt.link}>
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthPageShell>
  )
}
