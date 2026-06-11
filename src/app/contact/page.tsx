import Link from "next/link"
import { auth } from "@/lib/auth"
import { Mail, MessageCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { buildMetadata } from "@/lib/seo"
import { mt } from "@/lib/marketing-theme"
import { type } from "@/lib/typography"
import { siteConfig } from "@/lib/site"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = buildMetadata({
  title: "Contact Eternally Yours",
  description:
    "Contact Eternally Yours for wedding invitation questions, support, or product feedback.",
  path: "/contact",
})

const contactInfo = [
  {
    icon: Mail,
    title: "Email us",
    desc: "We typically reply within one business day.",
    href: `mailto:${siteConfig.social.email}`,
    label: siteConfig.social.email,
  },
  {
    icon: MessageCircle,
    title: "Product feedback",
    desc: "Tell us what would make your invitation workflow even better.",
  },
  {
    icon: Clock,
    title: "Support hours",
    desc: "Mon–Fri, 9:00 AM – 6:00 PM (your local time).",
  },
]

export default async function ContactPage() {
  const session = await auth()

  return (
    <div className={mt.page}>
      <section className={`bg-neutral-50/80 ${mt.pageViewport}`}>
        <div className={mt.containerNarrow}>
          <header className={mt.pageHeaderLeft}>
            <h1 className={type.h2}>We&apos;d love to hear from you</h1>
            <p className={`${type.secondary} mt-2`}>
              Questions about invitations, pricing, or your account? We&apos;re here to help.
            </p>
          </header>

          <div className={`${mt.pageMain} grid gap-5 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start`}>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {contactInfo.map((item) => (
                <div key={item.title} className={mt.cardStaticCompact}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <item.icon size={18} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <h2 className={type.h5}>{item.title}</h2>
                      <p className={`${type.caption} mt-0.5 leading-snug`}>{item.desc}</p>
                      {item.href && (
                        <a href={item.href} className={`${mt.link} mt-1.5 inline-block ${type.caption}`}>
                          {item.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <p className={`${type.caption} hidden lg:block`}>
                <Link href="/about" className={mt.link}>
                  About us
                </Link>
                {" · "}
                <Link href="/pricing" className={mt.link}>
                  Pricing
                </Link>
              </p>
            </div>

            <div className={mt.cardStaticCompact}>
              <h2 className={type.h5}>Send a message</h2>
              <p className={`${type.caption} mt-1 text-neutral-500`}>
                Fill out the form and we&apos;ll respond as soon as we can.
              </p>

              <form className="mt-4 space-y-3" action="#">
                <Input label="Name" tone="light" placeholder="Your name" id="contact-name" />
                <Input label="Email" tone="light" type="email" placeholder="you@example.com" id="contact-email" />
                <Textarea
                  label="Message"
                  tone="light"
                  placeholder="How can we help?"
                  className="min-h-[120px]"
                  id="contact-message"
                />
                <Button variant="primary" size="md" tone="light" className="w-full" type="submit">
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter session={!!session} />
    </div>
  )
}
