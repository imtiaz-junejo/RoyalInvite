"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mt } from "@/lib/marketing-theme"
import { Loader2 } from "lucide-react"

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        name,
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("An account with this email already exists")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className={mt.errorAlert}>{error}</div>}
      <Input
        label="Full Name"
        tone="light"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
        id="signup-name"
      />
      <Input
        label="Email"
        tone="light"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        id="signup-email"
      />
      <Input
        label="Password"
        tone="light"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
        required
        id="signup-password"
      />
      <Button variant="primary" size="lg" tone="light" className="w-full" type="submit" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Account"}
      </Button>
    </form>
  )
}
