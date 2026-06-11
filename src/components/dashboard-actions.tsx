"use client"

import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"
import { deleteInvitation } from "@/lib/actions"

export function CopyLinkButton({ slug }: { slug: string }) {
  return (
    <Button variant="ghost" size="sm" tone="light" title="Copy Link" onClick={() => {
      navigator.clipboard.writeText(`${getBaseUrl()}/invite/${slug}`)
    }}><Copy size={13} /></Button>
  )
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteInvitation.bind(null, id)}>
      <Button variant="ghost" size="sm" tone="light" className="text-red-600 hover:bg-red-50 hover:text-red-700" title="Delete">
        <Trash2 size={13} />
      </Button>
    </form>
  )
}
