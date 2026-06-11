import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { AuthPageShell } from "@/components/marketing/auth-page-shell"
import SignInForm from "./sign-in-form"

export const metadata = buildMetadata({
  title: "Sign In",
  description: "Sign in to manage your wedding invitations, RSVPs, and account settings.",
  path: "/sign-in",
  noIndex: true,
})

export default async function SignInPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to continue creating your invitations"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className={mt.link}>
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthPageShell>
  )
}
