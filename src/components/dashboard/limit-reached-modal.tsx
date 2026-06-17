"use client"

import { Modal } from "@/components/ui/modal"
import { ButtonLink } from "@/components/ui/button"
import { Lock, Crown, ArrowRight } from "lucide-react"
import { type } from "@/lib/typography"

interface LimitReachedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCount: number
  limit: number
}

export function LimitReachedModal({ open, onOpenChange, currentCount, limit }: LimitReachedModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
          <Lock className="h-8 w-8 text-indigo-600" />
        </div>

        <h3 className={`${type.h3} mb-2`}>You've Reached Your Limit</h3>
        <p className={`${type.body} mb-6 text-neutral-600`}>
          You've created <span className="font-semibold text-neutral-900">{currentCount}</span> out of{" "}
          <span className="font-semibold text-neutral-900">{limit}</span> free invitations.
        </p>

        <div className="mb-6 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-indigo-600" />
            <span className={`${type.label} text-indigo-700`}>Upgrade to Pro</span>
          </div>
          <ul className="space-y-1.5 text-left">
            {[
              "Unlimited invitations",
              "All themes & templates",
              "Background music",
              "Photo gallery",
              "Edit anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-neutral-700">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <ButtonLink href="/pricing" variant="primary" size="md" tone="light" className="w-full">
            Upgrade to Pro — $9
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </Modal>
  )
}
