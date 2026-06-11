"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" tone="light" onClick={() => signOut({ callbackUrl: "/sign-in" })}>
      <LogOut size={14} />
    </Button>
  )
}
