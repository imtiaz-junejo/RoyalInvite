# Smart RSVP And WhatsApp Reminder Plan

This document defines the recommended implementation plan for adding a Smart RSVP and WhatsApp Reminder System to the existing 3D wedding invitation app.

The goal is to make the invitation app operationally useful for hosts, not just visually impressive.

## Product Goal

Guests should be able to:
- open the invitation
- submit RSVP directly on the invitation page
- provide guest details and WhatsApp contact
- opt into reminder messages

Hosts should be able to:
- see all RSVP responses in one dashboard
- understand expected guest count
- identify non-responders
- send automatic WhatsApp reminders and event updates

## Current Codebase Status

Already implemented in the app:
- invitation public page with RSVP form
- RSVP attendance status: attending / not attending / maybe
- guest name
- guest email
- guest count
- meal preference
- RSVP dashboard
- total guest count calculation
- guest check-in code system
- event-day check-in dashboard

Missing for this idea:
- WhatsApp number collection
- explicit opt-in for WhatsApp reminders
- non-responder tracking model
- reminder scheduling system
- event update messaging flow
- WhatsApp delivery logs and retry model
- admin controls for broadcasting updates

## Sender Model Decision

This feature should use:
- one shared default WhatsApp sender number
- one shared WhatsApp gateway session

This means:
- all users of the wedding app send reminders through the same platform-owned sender
- the host does not connect their own personal WhatsApp account
- all reminder and update messages originate from the app's official sender number
- all messages are sent **from the application number** to guest WhatsApp numbers collected on each invitation
- recipients are scoped per invitation, not globally across the app

Why this is the right model here:
- much simpler UX
- easier operational support
- easier health monitoring
- easier audit logging
- matches your requirement that the sender should be only one number for all users

### Final sender behavior
- sender: always the application's WhatsApp number
- recipients: guests who submitted RSVP on a specific invitation
- message types:
  - RSVP reminders
  - wedding-day reminders
  - venue/time/detail updates
  - manual host-triggered updates for that invitation only

## Existing Gateway Fit

Gateway path provided:
- `~/Desktop/projects/saqib-jamali/scrapping-bot/map-scrapper/whatsapp-gateway`

The gateway already supports:
- session connect
- session QR retrieval
- session status check
- session disconnect
- direct message send

Relevant internal endpoints already available:
- `POST /internal/sessions/connect`
- `GET /internal/sessions/:sessionId/status`
- `GET /internal/sessions/:sessionId/qr`
- `POST /internal/sessions/:sessionId/disconnect`
- `POST /internal/messages/send`

Important gateway design note:
- the gateway is session-based
- for this wedding app, we should standardize on one fixed session id, for example `eternally-yours-main`
- that single connected session becomes the default sender for all reminder traffic

## Recommended Product Scope

### Phase 1: Smart RSVP data capture
Add to RSVP form:
- guest name
- WhatsApp number
- attendance status
- guest count
- optional message
- checkbox: agree to receive WhatsApp reminders and updates

Optional fields to keep:
- guest email
- meal preference

### Phase 2: RSVP dashboard intelligence
Host dashboard should show:
- attending
- not attending
- maybe
- not responded
- total expected guest count
- opted in to WhatsApp reminders
- invalid / missing WhatsApp numbers
- sender delivery health summary
- last reminder sent timestamp
- last update broadcast timestamp

### Phase 3: Reminder automation
Automated reminders for opted-in guests:
- 7 days before event
- 1 day before event
- on wedding day
- when venue/time/details are updated

### Phase 4: Update broadcasting
Host can send event updates manually:
- venue change
- time change
- weather / parking update
- dress code clarification
- livestream link or map note

## UX Flow

### Guest Flow
1. Guest opens invitation page
2. Guest fills RSVP form
3. Guest enters WhatsApp number
4. Guest checks reminder consent checkbox
5. Guest submits RSVP
6. Guest sees success state
7. Guest may receive WhatsApp reminders later if opted in

### Host Flow
1. Host opens RSVP dashboard
2. Host sees response summary
3. Host sees expected guest count and reminder consent breakdown
4. Host opens reminder/update panel
5. Host can preview scheduled reminders and send urgent updates
6. App sends those messages from the shared application number to the WhatsApp numbers collected for that invitation

## Recommended Data Model Changes

The current `Rsvp` model should be extended instead of replaced.

### Add to `Rsvp`
- `guestWhatsapp String?`
- `whatsappConsent Boolean @default(false)`
- `responseSource String?`
- `lastReminderSentAt DateTime?`
- `lastUpdateSentAt DateTime?`

Meaning:
- `guestWhatsapp`: cleaned E.164 or normalized local format
- `whatsappConsent`: explicit user opt-in
- `responseSource`: for future analytics like `invite-page`, `manual`, `host-entry`
- reminder timestamps help prevent duplicate sends

This table is the core recipient source.

For this product model:
- every invitation owns its own RSVP recipient list
- WhatsApp reminders are sent only to RSVP rows for that invitation
- there is no user-level sender identity in the wedding app

### Add new table: `ReminderSubscription` or reuse `Rsvp`

Recommended approach:
- keep reminder eligibility on `Rsvp`
- add separate message log tables for delivery audit

### New table: `WhatsAppMessageLog`
Suggested fields:
- `id`
- `invitationId`
- `rsvpId`
- `senderSessionId`
- `senderPhoneNumber`
- `phoneNumber`
- `messageType`
- `scheduledFor`
- `sentAt`
- `status`
- `providerMessageId`
- `error`
- `payload`
- `createdAt`

Message types:
- `reminder_7_days`
- `reminder_1_day`
- `reminder_same_day`
- `event_update`
- `manual_broadcast`

### New table: `InvitationUpdate`
Suggested fields:
- `id`
- `invitationId`
- `type`
- `title`
- `message`
- `sendToOptedInOnly Boolean`
- `createdAt`
- `createdByUserId`

Purpose:
- store a durable record of updates sent by host
- support update history in dashboard

### Recipient selection rule
All reminder/update sends should filter by:
- `invitationId = current invitation`
- `guestWhatsapp is not null`
- `whatsappConsent = true`

This guarantees that:
- messages only go to guests for that wedding invitation
- users cannot accidentally broadcast to another invitation's guests

### New table: `WhatsAppSenderConfig`
Because the app uses one shared sender number, keep sender state centralized.

Suggested fields:
- `id`
- `sessionId`
- `displayName`
- `phoneNumber`
- `status`
- `lastConnectedAt`
- `isDefault`
- `createdAt`
- `updatedAt`

Recommended normal operating mode:
- exactly one default sender config row
- future-safe if multiple sender numbers are ever needed later

## Recommended Normalization Rules

### WhatsApp Number Handling
At submission time:
- trim spaces
- remove separators like `-` and spaces
- normalize to international format if possible
- validate min/max length

Do not attempt magical guessing silently for every country.

Recommended UI:
- country code input or dropdown in a later phase
- initial version can use single text input with clear formatting hint

Example placeholder:
- `+91 9876543210`

## API Changes

### Existing RSVP API to extend
Current route:
- `src/app/api/invitations/[id]/rsvp/route.ts`

Extend request payload with:
- `guestWhatsapp`
- `whatsappConsent`

Validation changes:
- WhatsApp required only if consent is checked
- if WhatsApp is present, validate format

Behavioral rule:
- store guest WhatsApp number against that specific invitation RSVP
- later reminders and updates use that stored number as the destination

### New API: reminder preview / scheduling
Suggested routes:
- `POST /api/invitations/[id]/reminders/preview`
- `POST /api/invitations/[id]/reminders/schedule`
- `POST /api/invitations/[id]/updates/send`
- `GET /api/invitations/[id]/message-logs`

### New API: shared sender administration
Suggested routes:
- `GET /api/admin/whatsapp/sender-status`
- `POST /api/admin/whatsapp/connect-default-sender`
- `GET /api/admin/whatsapp/default-sender-qr`
- `POST /api/admin/whatsapp/disconnect-default-sender`

Purpose:
- only admins/platform operators manage the shared sender session
- hosts should not see QR/session controls

Host-facing APIs should remain invitation-scoped.

That means:
- hosts act on `/api/invitations/[id]/...`
- sender session control stays under `/api/admin/whatsapp/...`

### New API: stats
Suggested route:
- `GET /api/invitations/[id]/rsvp-summary`

Should return:
- attending count
- not attending count
- maybe count
- non-responders count
- total expected guests
- opted-in count
- invalid/missing WhatsApp count

## Non-Responder Logic

This app currently stores only actual responses.

To show `not responded yet`, the app needs one of these models:

### Option A: Guest List Per Invitation
Add a guest list feature:
- host uploads or adds expected guests
- RSVP ties to invited guests
- non-responders = invited guests without RSVP

Best long-term choice.

### Option B: No formal guest list
Without a guest list, true `not responded yet` is impossible.

You can only show:
- total RSVP responses received
- expected guest count from responses

Recommendation:
- Phase 1: ship WhatsApp RSVP without non-responder count
- Phase 2: add guest list support

## Recommendation On Guest List

Add a new `InvitationGuest` table later.

Suggested fields:
- `id`
- `invitationId`
- `name`
- `whatsapp`
- `groupLabel`
- `guestCountExpected`
- `invitationSentAt`
- `rsvpId`
- `createdAt`

Benefits:
- real non-responder tracking
- targeted reminder messages
- family grouping
- host-side invite distribution tracking

## WhatsApp Delivery Strategy

This feature should be provider-based, not hardcoded.

### Recommended architecture
Create a `lib/whatsapp/` service layer:
- `sendMessage()`
- `sendTemplateMessage()`
- `validatePhone()`
- provider adapters

For this project specifically, add:
- `getDefaultSenderSession()`
- `sendFromDefaultSender()`

Suggested providers for the future:
- Meta WhatsApp Business Cloud API
- Twilio WhatsApp
- Gupshup / Interakt / WATI if regional needs fit better

### Recommended first provider choice for this app
Use the existing `whatsapp-gateway` first.

Why:
- it already exists
- it already supports a session-based sender model
- it already exposes internal send APIs
- it fits the one-default-sender requirement well

### Standard sender session
Recommended fixed session id:
- `eternally-yours-main`

All reminder and update sends should use that one session id.

This session represents the single application-owned WhatsApp number.

## Message Types

### 7 days before wedding
Purpose:
- warm reminder
- keep wedding visible

Example:
```text
Hi {name}, just a joyful reminder that {bride} & {groom}'s wedding is in 7 days. We can’t wait to celebrate with you. View invitation: {link}
```

### 1 day before wedding
Purpose:
- practical reminder
- location/time readiness

Example:
```text
Hi {name}, the wedding celebration for {bride} & {groom} is tomorrow at {time}. Venue: {venue}. Maps: {mapLink}
```

### Wedding day
Purpose:
- same-day attendance support

Example:
```text
Hi {name}, today is the big day for {bride} & {groom}. We look forward to celebrating with you at {venue}. Safe travels.
```

### Event update
Purpose:
- notify changes fast

Example:
```text
Update for {bride} & {groom}'s wedding: {updateMessage}. Please check your invitation page for the latest details: {link}
```

## Scheduling Strategy

### Recommended implementation
Do not send reminders from page requests.

Use a background execution strategy:
- cron-driven job
- queue worker
- scheduled polling route called by server cron

### Suggested first version
If keeping infra simple:
- create a server route for reminder dispatch
- call it with cron from EC2 every 15 minutes

Suggested route:
- `POST /api/jobs/send-whatsapp-reminders`

This job should:
1. find published invitations with event dates
2. find RSVP rows with consent + valid WhatsApp number
3. determine which reminder window applies
4. skip already-sent reminder types
5. send through the shared sender session
6. store result in `WhatsAppMessageLog`

Recipient query shape:
- `where invitationId = ?`
- `and guestWhatsapp is not null`
- `and whatsappConsent = true`

### Shared sender delivery flow
1. wedding app loads the default sender session id from config
2. wedding app calls gateway `/internal/messages/send`
3. request includes:
   - `session_id`
   - `to`
   - `text`
4. gateway sends through the one connected WhatsApp account
5. app stores success/failure in `WhatsAppMessageLog`

## Event Update Trigger Strategy

When invitation event details change:
- venue
- time
- date
- map link
- schedule

System should:
1. detect meaningful change in update API
2. create `InvitationUpdate` record
3. optionally queue/send WhatsApp update to opted-in guests

Recommended UX:
- if host changes key logistics, show modal:
  - `Send WhatsApp update to opted-in guests?`
  - yes / no

The update message should clearly identify:
- couple names
- invitation title
- that it comes from the official wedding invitation sender

It should be sent only to guests from that invitation's RSVP list.

## Dashboard Enhancements

### RSVP Dashboard additions
Show cards for:
- attending count
- not attending count
- maybe count
- total expected guests
- opted in for WhatsApp count
- missing WhatsApp count
- invalid WhatsApp count
- non-responders count if guest list exists

### New table columns
Add to RSVP table:
- WhatsApp number
- consent status
- reminder status
- check-in status

### New tabs or sections
Suggested dashboard sections:
1. Responses
2. Reminders
3. Updates
4. Delivery Logs
5. Guest Check-In

### Admin-only sections
Suggested platform/admin controls:
1. Shared Sender Status
2. QR Connect / Reconnect
3. Delivery Health
4. Failed Queue Review

## Admin / Host Controls

Host should be able to:
- filter RSVP responses by status
- filter only opted-in guests
- see guests missing numbers
- manually resend reminder
- send one-off update
- preview message before sending

Admin/platform operator should be able to:
- connect the shared sender number by QR
- reconnect it if disconnected
- pause reminder sending if sender health is bad
- inspect gateway health and send failures

Hosts should **not** be able to:
- change the sender number
- connect their own WhatsApp session
- access QR/session admin controls

Optional bulk tools later:
- export opted-in WhatsApp list
- segment by attendance status
- segment by event if guest list supports event groups

## Validation Rules

### RSVP rules
- `guestName` required
- `attendanceStatus` required
- `guestCount` min 1
- `guestWhatsapp` required if `whatsappConsent = true`
- WhatsApp number must pass normalization rule
- reminder/update sends must always remain invitation-scoped

### Reminder rules
- only send to opted-in guests
- only send to valid phone numbers
- only send reminders for published invitations
- prevent duplicates per message type

### Update rules
- do not auto-send update if invitation is still draft
- if invitation changes are cosmetic only, do not trigger message prompt

## Codebase Integration Plan

### Existing files that should evolve
- `prisma/schema.prisma`
- `src/lib/validations.ts`
- `src/app/api/invitations/[id]/rsvp/route.ts`
- `src/app/invite/[slug]/invitation-client.tsx`
- `src/app/dashboard/invitations/[id]/rsvps/page.tsx`

### New likely files
- `src/lib/whatsapp/provider.ts`
- `src/lib/whatsapp/meta.ts` or `twilio.ts`
- `src/app/api/invitations/[id]/updates/send/route.ts`
- `src/app/api/jobs/send-whatsapp-reminders/route.ts`
- `src/app/dashboard/invitations/[id]/reminders/page.tsx`
- `src/app/dashboard/invitations/[id]/updates/page.tsx`

For this codebase and sender model, add these first instead:
- `src/lib/whatsapp/gateway.ts`
- `src/lib/whatsapp/default-sender.ts`
- `src/app/api/admin/whatsapp/sender-status/route.ts`
- `src/app/api/admin/whatsapp/connect-default-sender/route.ts`
- `src/app/api/admin/whatsapp/default-sender-qr/route.ts`
- `src/app/api/admin/whatsapp/disconnect-default-sender/route.ts`

## Build Phases

### Phase 1: Smart RSVP foundation
Implement:
- WhatsApp number field
- consent checkbox
- dashboard fields for consent and phone
- totals for expected guests and opted-in count

Outcome:
- usable RSVP collection with WhatsApp opt-in

### Phase 2: Reminder infrastructure
Implement:
- message log table
- provider abstraction
- scheduled reminder job
- 7-day / 1-day / wedding-day rules

Outcome:
- automatic reminder system

### Phase 3: Event update messaging
Implement:
- detect event-detail changes
- send optional update broadcast
- update history and delivery logs

Outcome:
- hosts can communicate live changes reliably

### Phase 4: Guest-list-driven intelligence
Implement:
- invitation guest list
- non-responder tracking
- targeted reminder segmentation

Outcome:
- full RSVP management suite

## Risks And Constraints

### 1. WhatsApp platform approvals
Template messages often need approval depending on provider and message type.

### 2. Consent compliance
You need explicit user consent for reminder messaging.

Because one shared sender number will message all users' guests, the consent copy must be explicit.

Recommended checkbox copy:
- `I agree to receive wedding reminders and important updates on WhatsApp from the official wedding invitation service.`

### 3. Non-responder count requires guest list
Without guest list, you cannot truly know who has not responded.

### 4. Scheduling infrastructure
Automated reminders need a stable background runner.

### 5. Shared sender bottleneck
One sender number means:
- all reminders depend on one connected session
- rate limiting matters more
- monitoring and failure handling matter more

Mitigation:
- queue sends
- cap throughput
- retry with backoff
- expose sender health in admin
- document reconnect procedure

### 5. Phone number normalization
This can create support edge cases if not handled clearly.

## Recommended Final Product Shape

For this app, the strongest version is:

1. invitation page collects RSVP + WhatsApp consent
2. dashboard becomes RSVP command center
3. automatic reminder job sends timeline reminders
4. update broadcast handles venue/time changes
5. guest list later unlocks non-responder intelligence

## Suggested MVP Definition

If you want the smallest worthwhile version first, build this:

### MVP scope
- add WhatsApp number to RSVP form
- add reminder consent checkbox
- show RSVP + WhatsApp info in dashboard
- calculate expected guest count
- add manual send update button for opted-in guests
- add scheduled 1-day reminder only first

For this app specifically, MVP should also include:
- one configured default sender session id
- admin-only shared sender QR/status page

Message delivery in MVP:
- from the shared application WhatsApp number
- to guest WhatsApp numbers collected on that invitation

Why this MVP is good:
- real utility
- lower infra complexity
- faster to test in production

## Testing Plan

### RSVP form
Test:
- submit with no WhatsApp and no consent
- submit with WhatsApp and consent
- submit with consent but invalid number

Expected:
- correct validation behavior

### Dashboard
Test:
- RSVP status counts
- expected guest count
- opted-in counts

### Reminder job
Test:
- create invitation with near event date in staging
- create opted-in guests
- trigger scheduled route manually
- verify logs and send behavior

### Update broadcast
Test:
- change venue or time
- choose send update
- verify logs

## Recommendation

Best implementation order for this codebase:
1. Smart RSVP fields and consent
2. RSVP dashboard enhancements
3. Shared sender gateway integration
4. Admin shared-sender connect/status controls
5. Scheduled reminder job
6. Update broadcast flow
7. Guest list and non-responder tracking

That path keeps the app stable while turning it into a real wedding operations tool.
