# Eternally Yours Mobile App Clone Plan

## Goal

Build a mobile application clone of the existing Eternally Yours web app for both Android and iOS.

The mobile app should let users create, publish, manage, and share wedding invitations from their phone while reusing the existing backend, database, tier rules, RSVP system, and WhatsApp gateway.

## Recommended Approach

Use one cross-platform mobile codebase:

- Framework: React Native with Expo
- Language: TypeScript
- Backend: existing Next.js app APIs
- Database: existing Prisma database through backend APIs only
- WhatsApp: existing shared WhatsApp gateway through backend APIs only
- Auth: add mobile token auth instead of relying on browser cookies

This avoids building two separate native apps and keeps the product close to the current React/Next.js codebase.

## Product Scope

The mobile app should clone the main host/admin experience from the web app.

### User Features

- Sign up
- Sign in
- View dashboard
- Create invitations
- Edit invitations if Pro
- View invitation status
- Publish/unpublish invitation
- Preview invitation
- Share invitation link
- View RSVP responses
- View guest count and attendance stats
- Send WhatsApp updates to opted-in guests
- Open check-in mode
- Mark guests as checked in

### Admin Features

- View admin dashboard
- View users
- Change user tier
- View WhatsApp sender status
- View WhatsApp send stats

Admin QR connection can stay web-only for the first mobile release.

## Architecture

```txt
Mobile App: Android / iOS
  |
  | HTTPS API requests
  v
Existing Next.js Backend
  |
  | Prisma
  v
Database
  |
  | Internal HTTP API
  v
WhatsApp Gateway
```

The mobile app must not connect directly to Prisma, SQLite, PostgreSQL, or the WhatsApp gateway.

All sensitive operations should go through backend APIs.

## Project Structure

Recommended monorepo-style folder:

```txt
apps/
  mobile/
    app/
    src/
      api/
      auth/
      components/
      screens/
      navigation/
      theme/
      utils/
```

Initial setup command:

```bash
npx create-expo-app apps/mobile --template
```

Recommended mobile packages:

```bash
npx expo install expo-secure-store expo-image-picker expo-sharing expo-linking expo-camera
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

## Backend Changes Required

The current web app uses NextAuth browser sessions. Mobile apps need token-based auth because native apps do not handle browser cookies as cleanly.

### Add Mobile Auth

Add mobile auth endpoints:

```txt
POST /api/mobile/auth/sign-in
POST /api/mobile/auth/sign-up
GET  /api/mobile/auth/me
POST /api/mobile/auth/sign-out
```

Sign-in response:

```json
{
  "token": "mobile-session-token",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user",
    "tier": "free"
  }
}
```

Mobile app stores token in Expo SecureStore.

Every protected mobile request sends:

```txt
Authorization: Bearer <token>
```

### Add Mobile Session Table

Recommended Prisma model:

```prisma
model MobileSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("mobile_sessions")
}
```

Do not store raw tokens in the database. Store only a hash.

### Mobile API Routes

Add mobile-specific API routes that reuse existing validation and tier logic:

```txt
GET    /api/mobile/invitations
POST   /api/mobile/invitations
GET    /api/mobile/invitations/[id]
PUT    /api/mobile/invitations/[id]
DELETE /api/mobile/invitations/[id]

GET    /api/mobile/invitations/[id]/rsvps
POST   /api/mobile/invitations/[id]/updates/send
POST   /api/mobile/invitations/[id]/check-in

GET    /api/mobile/admin/users
PUT    /api/mobile/admin/users/[id]/tier
GET    /api/mobile/admin/whatsapp/status
```

Mobile APIs should return JSON shapes optimized for mobile screens, not raw Prisma objects when unnecessary.

## Mobile App Screens

### 1. Auth Screens

Screens:

- Welcome
- Sign In
- Sign Up

Requirements:

- Email/password login
- Store token securely
- Redirect authenticated users to dashboard
- Show clear API errors

### 2. Dashboard Screen

Shows:

- User name
- Tier: Free or Pro
- Invitations list
- Create invitation button
- Published/draft status
- RSVP count
- View/share actions

Free tier rules:

- Free users can create up to 5 invitations
- Free users cannot edit after creation
- Pro users can edit

### 3. Invitation Builder

Mobile builder should be section-based, not one giant form.

Sections:

- Couple details
- Event details
- Venue
- Theme/template
- RSVP settings
- Story
- Gallery
- Schedule
- Music
- Publish settings

Each section should save to local form state, then submit through one create/update API call.

### 4. Preview Screen

Options:

- Open public invite in WebView
- Open public invite in external browser
- Show share link
- Copy link
- Native share sheet
- WhatsApp share

Recommended MVP:

- Use external browser or WebView for exact invitation rendering
- Do not rebuild the full 3D invitation renderer natively in version 1

### 5. RSVP Screen

Shows:

- Total responses
- Attending
- Maybe
- Declined
- Expected guest count
- Checked-in count
- WhatsApp opted-in count

Guest row fields:

- Guest name
- Attendance status
- Guest count
- Meal preference
- Message
- WhatsApp number if consented
- Check-in status

### 6. WhatsApp Update Screen

Uses existing backend send flow.

Fields:

- Message textarea
- Recipient count
- Send button
- Send result summary

Backend route:

```txt
POST /api/mobile/invitations/[id]/updates/send
```

Rules:

- Sender is always the shared application WhatsApp number
- Recipients are scoped to the selected invitation
- Only guests with WhatsApp consent are included

### 7. Check-In Screen

MVP:

- Search guest by name
- Show check-in code
- Mark checked in

Later:

- QR scanner using `expo-camera`
- Offline guest list cache
- Sync after reconnect

### 8. Admin Screens

MVP admin screens:

- Admin overview
- Users list
- Tier control
- WhatsApp sender status

Defer:

- QR sender connect/disconnect on mobile
- Deep gateway diagnostics

## Design Direction

The app should feel like the current web brand:

- Dark luxury background
- Gold accent color
- Elegant serif headings
- Soft cards and borders
- Premium wedding tone

Mobile UX should be simpler than web:

- Large tap targets
- Section cards
- Bottom tabs or stack navigation
- Native share actions
- Minimal typing friction

Suggested navigation:

```txt
AuthStack
  Welcome
  SignIn
  SignUp

AppTabs
  Dashboard
  Create
  Settings

InvitationStack
  Details
  Builder
  Preview
  RSVPs
  WhatsAppUpdate
  CheckIn

AdminStack
  AdminHome
  Users
  WhatsAppStatus
```

## Media Handling

Current web app accepts image URLs. Mobile users expect uploads.

MVP options:

- Keep URL-based image fields for first release
- Add upload later using S3/R2/Cloudinary

Recommended after MVP:

- Add image upload API
- Store uploaded images in object storage
- Return public URLs to invitation records

## Notifications

Push notifications are not required for MVP.

Later use Expo Notifications for:

- RSVP received
- Guest message posted
- Reminder send completed
- Failed WhatsApp sender alert for admins

## Payments And App Store Rules

Be careful with Pro upgrades.

Apple and Google may require in-app purchases if digital features are sold inside the mobile app.

Recommended MVP:

- Show current tier in mobile app
- Enforce Free/Pro behavior
- Do not sell Pro inside the app initially
- Add “Manage plan on web” link

Later options:

- RevenueCat for in-app subscriptions
- Stripe only for web billing
- Separate mobile subscription strategy

## Implementation Phases

### Phase 1: Mobile Foundation

Deliverables:

- Expo app created
- TypeScript configured
- Navigation configured
- Theme tokens added
- API client added
- Secure token storage added

Acceptance criteria:

- App opens on Android and iOS simulators
- Can switch between auth screens
- API base URL is configurable

### Phase 2: Mobile Auth

Backend:

- Add mobile auth routes
- Add `MobileSession` model
- Add token hashing/verification helper

Mobile:

- Sign in
- Sign up
- Persist token
- Restore session on app launch
- Sign out

Acceptance criteria:

- User can sign in from mobile
- User remains signed in after app restart
- Invalid token signs user out safely

### Phase 3: Dashboard And Invitation List

Backend:

- Add mobile invitation list API

Mobile:

- Dashboard screen
- Invitation cards
- Empty state
- Tier limit state

Acceptance criteria:

- User sees their invitations
- Free tier limit is visible
- Published/draft status is visible

### Phase 4: Create Invitation

Backend:

- Add mobile invitation create API or reuse existing validation through mobile auth

Mobile:

- Section-based create form
- Theme/template selector
- Publish toggle

Acceptance criteria:

- User can create invitation from mobile
- Created invitation appears in dashboard
- Free tier max 5 is enforced

### Phase 5: Edit Invitation

Backend:

- Add mobile update API with existing Pro edit rules

Mobile:

- Edit sections
- Disabled edit state for Free users

Acceptance criteria:

- Pro users can edit
- Free users see locked state after creation

### Phase 6: Preview And Share

Mobile:

- Preview public invitation
- Copy link
- Native share sheet
- WhatsApp share

Acceptance criteria:

- User can open preview
- User can share invitation link from phone

### Phase 7: RSVP Dashboard

Backend:

- Add mobile RSVP list API

Mobile:

- RSVP stats
- RSVP list
- Filters by status

Acceptance criteria:

- Host can see guest responses and counts

### Phase 8: WhatsApp Updates

Backend:

- Add mobile wrapper for current update send route

Mobile:

- Message composer
- Recipient count
- Send result

Acceptance criteria:

- Host can send invitation-scoped WhatsApp update
- Send result shows sent/failed count

### Phase 9: Check-In

Backend:

- Add mobile check-in route

Mobile:

- Guest search
- Manual check-in

Acceptance criteria:

- Host can mark guest as checked in

### Phase 10: Admin MVP

Backend:

- Add mobile admin routes

Mobile:

- Admin overview
- User tier management
- WhatsApp status

Acceptance criteria:

- Admin can manage users and see sender status

## Testing Plan

### Backend Tests

- Mobile sign-in success
- Mobile sign-in failure
- Token validation
- Invitation create
- Free tier limit
- Pro edit allowed
- Free edit blocked
- RSVP list authorization
- WhatsApp update authorization
- Admin-only routes blocked for normal users

### Mobile Tests

- Auth flow
- Dashboard loading
- Create invitation form validation
- Share action opens native sheet
- RSVP list loads
- WhatsApp update submit state
- Check-in state update

### Manual QA Devices

Test on:

- Android emulator
- Android physical phone
- iOS simulator
- iPhone physical device if available

## Environment Variables

Mobile app:

```txt
EXPO_PUBLIC_API_BASE_URL=https://invite.sikanderkumbhar.com
```

Backend:

```txt
MOBILE_SESSION_SECRET=strong-secret
NEXTAUTH_SECRET=existing-secret
DATABASE_URL=existing-database-url
WHATSAPP_GATEWAY_URL=existing-gateway-url
WHATSAPP_SESSION_ID=eternally-yours-main
```

## Risks

### Auth Complexity

Current auth is web-cookie based. Mobile token auth needs to be added carefully.

Mitigation:

- Keep mobile auth separate from NextAuth browser sessions
- Reuse password hashing and user lookup logic

### SQLite Production Limits

SQLite is fine for MVP but will become harder with mobile traffic and concurrent writes.

Mitigation:

- Keep current SQLite for MVP
- Plan PostgreSQL migration before high usage

### App Store Payments

Selling Pro inside the app can trigger Apple/Google in-app purchase rules.

Mitigation:

- MVP does not sell Pro inside app
- Users manage plan on web

### Invitation Renderer Duplication

Rebuilding the full animated invite natively would be expensive.

Mitigation:

- Use WebView or browser preview for public invitations first

## MVP Definition

The first mobile release is complete when:

- User can sign up/sign in
- User can create an invitation
- User can publish/share invitation
- User can view RSVP responses
- User can send WhatsApp updates
- User can manually check in guests
- Admin can view users and WhatsApp sender status

## Recommended First Task

Start with backend mobile auth because every mobile screen depends on it.

First implementation checklist:

1. Add `MobileSession` Prisma model
2. Add token generation/hash helpers
3. Add `POST /api/mobile/auth/sign-in`
4. Add `POST /api/mobile/auth/sign-up`
5. Add `GET /api/mobile/auth/me`
6. Create Expo app in `apps/mobile`
7. Add sign-in screen
8. Store token in SecureStore
9. Load dashboard after auth
