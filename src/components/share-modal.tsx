"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Copy, Mail, Share2 } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"
import QRCode from "qrcode"
import { useEffect, useRef } from "react"
import Image from "next/image"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  title: string
}

export function ShareModal({ open, onOpenChange, slug, title }: ShareModalProps) {
  const shareUrl = `${getBaseUrl()}/invite/${slug}`
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (open && slug) {
      QRCode.toDataURL(shareUrl, { width: 160, margin: 1 }, (err, url) => {
        if (url) setQrDataUrl(url)
      })
    }
  }, [open, slug, shareUrl])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.getElementById("share-url-input") as HTMLInputElement
      if (input) {
        input.select()
        document.execCommand("copy")
      }
    }
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited to ${title}! ${shareUrl}`)}`, "_blank")
  }

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`You're invited to ${title}`)}&body=${encodeURIComponent(`Join us! ${shareUrl}`)}`, "_blank")
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`You're invited to ${title}!`)}&url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Share Invitation" subtitle="Send love to the people who matter most">
      <div className="flex gap-2 mb-5">
        <input
          id="share-url-input"
          readOnly
          value={shareUrl}
          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-accent tracking-wide font-lato"
        />
        <Button variant="primary" size="sm" onClick={copyLink}>
          <Copy size={14} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="flex gap-2.5 justify-center mb-5 flex-wrap">
        <button
          onClick={shareWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-lato transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{ background: "#25d366" }}
        >
          💬 WhatsApp
        </button>
        <button
          onClick={shareTwitter}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-lato transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{ background: "#1da1f2" }}
        >
          🐦 Twitter
        </button>
        <button
          onClick={shareEmail}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-lato transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{ background: "#ea4335" }}
        >
          ✉️ Email
        </button>
      </div>

      {qrDataUrl && (
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-white/10">
          <p className="text-[10px] tracking-wider uppercase font-cinzel opacity-50 text-center">Scan QR Code</p>
          <div className="rounded-lg overflow-hidden bg-white p-2">
            <img src={qrDataUrl} alt="QR Code" width={160} height={160} />
          </div>
        </div>
      )}

      <p className="text-[11px] opacity-40 text-center mt-5" style={{ color: "var(--text-color, #fdf8f0)" }}>
        Link is active until the wedding date
      </p>
    </Modal>
  )
}
