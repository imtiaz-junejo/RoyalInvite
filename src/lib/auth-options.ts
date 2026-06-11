import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string
        const name = credentials.name as string | undefined

        // If name is provided, this is a sign-up attempt
        if (name) {
          const existing = await prisma.user.findUnique({ where: { email } })
          if (existing) return null
          const hash = await bcrypt.hash(password, 12)
          const user = await prisma.user.create({
            data: { email, name, passwordHash: hash },
          })
          return { id: user.id, email: user.email, name: user.name }
        }

        // Sign-in
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
  },
  logger: {
    error(code, metadata) {
      if (code === "JWT_SESSION_ERROR") return
      console.error(`[next-auth][error][${code}]`, metadata)
    },
    warn(code) {
      console.warn(`[next-auth][warn][${code}]`)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[next-auth][debug][${code}]`, metadata)
      }
    },
  },
}
