import { getServerSession, DefaultSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export { authOptions }

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export async function auth() {
  return getServerSession(authOptions)
}

export async function signIn(...args: any[]) {
  const { signIn } = await import("next-auth/react")
  return signIn(...args)
}

export async function signOut(...args: any[]) {
  const { signOut } = await import("next-auth/react")
  return signOut(...args)
}
