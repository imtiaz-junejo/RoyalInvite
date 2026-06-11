import { auth } from "@/lib/auth"
import { LandingNav, type LandingNavUser } from "@/components/landing/landing-nav"

/** Global site navbar — rendered once in the root layout on every page */
export async function SiteNav() {
  const session = await auth()
  const navUser: LandingNavUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null

  return <LandingNav session={!!session} user={navUser} />
}
