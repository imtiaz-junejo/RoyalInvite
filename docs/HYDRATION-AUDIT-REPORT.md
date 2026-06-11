# Hydration & SSR Audit Report

**Date:** June 2026  
**Scope:** Full `src/` codebase — Next.js 15, React 19

## Summary

| Risk | Count | Status |
|------|-------|--------|
| High | 4 | Fixed |
| Medium | 6 | Fixed |
| Low | 5 | Fixed / Acceptable |

---

## Issues Found & Fixes

### 1. Nav typography class mismatch (HIGH)

- **Files:** `landing-nav-links.tsx`, `landing-nav-mobile.tsx`, `typography.ts`
- **Issue:** Server rendered `type-nav` CSS classes; stale client bundles rendered `text-sm font-medium`, causing hydration errors.
- **Fix:** Reverted nav tokens to explicit Tailwind strings: `font-sans text-secondary font-medium text-neutral-600`.
- **Prevention:** Never use CSS `@apply` aliases in client `className` strings; keep typography as static Tailwind in `typography.ts`.

### 2. `Date.now()` in builder defaults (HIGH)

- **File:** `src/app/dashboard/invitations/new/page.tsx`
- **Issue:** `basePreview.eventDate` used `Date.now()` at module scope — server/client could differ.
- **Fix:** `BUILDER_DEFAULT_EVENT_DATE = "2026-12-15"` in `src/lib/ssr.ts`.
- **Prevention:** Use static demo data or compute dates only in `useEffect`.

### 3. Invalid HTML: `<a><button>` nesting (HIGH)

- **Files:** `dashboard/page.tsx`, `pricing/page.tsx`, `template-card.tsx`, `admin/page.tsx`, `rsvps/page.tsx`, `check-in-client.tsx`, `invitation-builder-chrome.tsx`
- **Issue:** `<Link><Button>` produced anchor wrapping button — invalid HTML, hydration risk.
- **Fix:** Added `ButtonLink` component in `src/components/ui/button.tsx`; migrated all link-buttons.
- **Prevention:** Use `ButtonLink` or `getButtonClasses()` on `<Link>` — never nest interactive elements.

### 4. Confetti `Math.random()` during render (MEDIUM)

- **File:** `src/components/confetti.tsx`
- **Issue:** Random values generated in render when `active=true`.
- **Fix:** Generate pieces in `useEffect` when `active` changes.
- **Prevention:** ESLint `no-restricted-syntax` warns on `Math.random()` in render paths.

### 5. Typography CSS class aliases (MEDIUM)

- **File:** `src/lib/typography.ts`
- **Issue:** `type.quote` and `type.templatePreview` used `type-quote` / `type-template-preview` CSS classes.
- **Fix:** Replaced with explicit Tailwind strings matching `globals.css` definitions.
- **Prevention:** Prefer inline Tailwind in typography constants for client components.

### 6. Locale-dependent date formatting (MEDIUM)

- **Files:** `dashboard/page.tsx`, `admin/page.tsx`, `rsvps/page.tsx`, `user-tier-manager.tsx`, `invitation-client.tsx`, `export-csv-button.tsx`, `whatsapp-sender-panel.tsx`
- **Issue:** `toLocaleDateString()` / `toLocaleString()` without locale/timezone — server/client could differ.
- **Fix:** `formatEventDate()` and `formatDateTime()` in `src/lib/ssr.ts` with `en-US` + `UTC`.
- **Prevention:** Always use deterministic locale/timezone for displayed dates.

### 7. Framer Motion SSR animations (MEDIUM)

- **File:** `src/components/marketing/about-hero.tsx`
- **Issue:** `initial={{ opacity: 0 }}` on server vs animated client first paint.
- **Fix:** `useMounted()` guard — `initial={mounted ? {...} : false}`.
- **Prevention:** Use `useMounted()` before motion `initial` props that differ from final state.

### 8. Preview scaler viewport checks (MEDIUM)

- **File:** `src/components/dashboard/invitation-preview-scaler.tsx`
- **Issue:** Was empty / used `window.innerWidth` for fill ratio (non-deterministic).
- **Fix:** Restored scaler with fixed `fillRatio` prop; layout measured via `ResizeObserver` in `useLayoutEffect` only.
- **Prevention:** No `window` reads during render; measure in effects only.

### 9. Redundant `typeof window` in useEffect (LOW)

- **File:** `src/app/invite/[slug]/invitation-client.tsx`
- **Issue:** Unnecessary guard inside `useEffect`.
- **Fix:** Removed — `useEffect` is client-only.
- **Prevention:** Use `isBrowser()` from `src/lib/ssr.ts` only outside effects when needed.

### 10. Footer copyright year (LOW)

- **File:** `src/components/landing/landing-footer.tsx`
- **Issue:** `new Date().getFullYear()` — server component only, no hydration risk.
- **Fix:** Routed through `getCopyrightYear()` in `src/lib/ssr.ts` for consistency.
- **Status:** Acceptable — server-rendered only.

---

## Safe Patterns (No Change Required)

| Component | Pattern | Why Safe |
|-----------|---------|----------|
| `countdown.tsx` | Placeholder `—` until `useEffect` | Identical SSR + first client paint |
| `particle-canvas.tsx` | Canvas + `window` in `useEffect` | No SSR output |
| `music-player.tsx` | Audio state in `useEffect` | Client-only |
| `share-modal.tsx` | Clipboard in handlers | Event-driven |
| `modal.tsx` | `document` keydown in `useEffect` | Client-only |
| API routes | `crypto.randomUUID()`, `new Date()` | Server-only |

---

## New Infrastructure

### SSR utilities — `src/lib/ssr.ts`

- `isBrowser()`
- `getCopyrightYear()`
- `BUILDER_DEFAULT_EVENT_DATE`
- `formatEventDate()`
- `formatDateTime()`

### Hooks — `src/lib/hooks/`

- `useMounted()`
- `useClientValue()`
- `useSafeLocalStorage()`
- `useHydrationSafeTheme()`

### UI — `src/components/ui/button.tsx`

- `getButtonClasses()` — deterministic class builder
- `ButtonLink` — valid link-as-button pattern

### ESLint — `.eslintrc.json`

- `react-hooks/exhaustive-deps`: warn
- `Math.random()` in render: warn

---

## Layout Audit

| File | Status |
|------|--------|
| `app/layout.tsx` | Safe — `suppressHydrationWarning` on `<html>` retained for font variable |
| `app/dashboard/layout.tsx` | Safe — metadata only |
| No `template.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` | N/A |

---

## Navigation Audit

| Component | Status |
|-----------|--------|
| `site-nav.tsx` | Server component |
| `landing-nav.tsx` | Server component |
| `landing-nav-links.tsx` | Client — static `type.nav` classes |
| `landing-nav-mobile.tsx` | Client — `useState(false)` for menu, SSR-safe |

---

## Verification

Run after changes:

```bash
npm run build
npm run dev
```

Hard refresh (`Ctrl+Shift+R`) to clear stale client bundles. Restart dev server if hydration warnings persist after code changes.

---

## Prevention Checklist

1. Never use `Date.now()`, `Math.random()`, or `window` during render.
2. Keep typography tokens as static Tailwind strings.
3. Use `ButtonLink` instead of `<Link><Button>`.
4. Use `formatEventDate()` for displayed dates.
5. Gate Framer Motion `initial` with `useMounted()`.
6. Browser APIs only in `useEffect` or event handlers.
7. Use `isBrowser()` from `@/lib/ssr` when guards are needed outside effects.
