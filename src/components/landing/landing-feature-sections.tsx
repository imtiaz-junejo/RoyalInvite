import { siteConfig } from "@/lib/site"
import { EasyInvitationVisual } from "@/components/landing/easy-invitation-visual"
import { LandingFeatureRow } from "@/components/landing/landing-feature-row"
import { PrintInvitationVisual } from "@/components/landing/print-invitation-visual"
import { PlannerWorkspaceVisual } from "@/components/landing/planner-workspace-visual"

export function LandingFeatureSections() {
  return (
    <>
      <LandingFeatureRow
        title="Wedding invitations made easy."
        visual={<EasyInvitationVisual />}
      >
        <p>
          Take some of the stress out of wedding planning with {siteConfig.name}. Personalize every aspect of your
          chosen template — edit names, dates, and messages, upload photos for your cover and gallery, and pick from
          handcrafted themes like Royal Gold, Rose Blush, Emerald Night, and Minimal Ivory.
        </p>
        <p>
          Add background music, enable a live countdown to your big day, and delight guests with a beautiful 3D card
          reveal. Collect RSVPs from your dashboard and share a unique link on any device.
        </p>
      </LandingFeatureRow>

      <LandingFeatureRow
        title="Share and send your wedding invitations."
        visual={<PrintInvitationVisual />}
      >
        <p>
          Design a premium digital invitation, then share it instantly with a unique URL, QR code, WhatsApp, or email —
          built right into {siteConfig.name}.
        </p>
        <p>
          Guests open your invitation on any phone or desktop and experience the animated card reveal, gallery, schedule,
          and RSVP form. Track every response in one place so you always know who is celebrating with you.
        </p>
      </LandingFeatureRow>

      <LandingFeatureRow
        title="Build efficiency into your wedding planning workflow."
        reverse
        visual={<PlannerWorkspaceVisual />}
      >
        <p>
          Wedding season moves fast. Show couples a catalog of elegant templates, tailor colors and copy in minutes, and
          preview the 3D opening animation before you share — no design experience required.
        </p>
        <p>
          Use premium themes, background music, countdown timers, and RSVP collection from a single dashboard. Whether
          you are planning your own celebration or supporting clients, {siteConfig.name} keeps every invitation polished
          and on brand.
        </p>
      </LandingFeatureRow>
    </>
  )
}
