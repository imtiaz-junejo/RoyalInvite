# Hydration & SSR Audit Report

**Last updated:** June 2026  
**Scope:** Full `src/` codebase — Next.js 15, React 19

## Summary

| Risk | Status |
|------|--------|
| Nav className mismatch | Fixed — `.type-nav*` CSS classes |
| Mobile nav DOM drift | Fixed — stable icon + always-present panel |
| Builder client boundary | Fixed — `"use client"` chrome + preview panel |
| Date/locale formatting | Fixed — `formatEventDate()` / `formatDateTime()` |
| Random values in render | Fixed — confetti in `useEffect` only |

---

## Issues Found & Fixes

### 1. Nav typography class mismatch (HIGH)

**Files:** `landing-nav-links.tsx`, `landing-nav-mobile.tsx`, `landing-nav.tsx`, `home-hero.tsx`, `landing-footer.tsx`, `auth-page-shell.tsx`, `typography.ts`

**Issue:** `${type.nav}` / `${type.navBrand}` expanded to Tailwind strings that could differ between server HTML and stale client bundles.

**Fix:** Use static CSS component classes from `globals.css`: `.type-nav`, `.type-nav-brand`, `.type-nav-cta`. `LandingNavLinks` remains a **Server Component**.

**Prevention:** Never use `@apply` aliases via JS string interpolation in client nav; prefer literal `.type-nav*` class names.

---

### 2. Mobile nav conditional DOM (MEDIUM)

**File:** `landing-nav-mobile.tsx`

**Issue:** `{open ? <X /> : <Menu />}` and `{open && <nav>}` swap element trees (acceptable after interaction, but icons could mismatch during edge hydration).

**Fix:** Both icons always rendered (opacity toggle). Mobile `<nav>` always in DOM with `hidden` when closed.

---

### 3. Builder preview client boundary (MEDIUM)

**Files:** `invitation-builder-chrome.tsx`, `invitation-builder-preview-panel.tsx`, `invitation-preview-frame.tsx`

**Issue:** ResizeObserver scaling must live in a client boundary; importing hook components from ambiguous server context caused runtime errors.

**Fix:** `"use client"` on builder chrome + dedicated `InvitationBuilderPreviewPanel` wrapper.

---

### 4. `Date.now()` in builder defaults (HIGH)

**File:** `dashboard/invitations/new/page.tsx`

**Fix:** `BUILDER_DEFAULT_EVENT_DATE` in `src/lib/ssr.ts`.

---

### 5. Locale-dependent dates (MEDIUM)

**Fix:** `formatEventDate()` / `formatDateTime()` in `src/lib/ssr.ts` with `en-US` + `UTC`.

---

### 6. Confetti `Math.random()` during render (MEDIUM)

**File:** `confetti.tsx` — random values only in `useEffect`.

---

### 7. Framer Motion SSR (MEDIUM)

**File:** `about-hero.tsx` — `useMounted()` gates `initial` props (`initial={mounted ? anim : false}`).

---

### 8. Invalid HTML `<Link><Button>` (HIGH)

**Fix:** `ButtonLink` in `src/components/ui/button.tsx`.

---

## Safe Patterns (No Change Required)

| Location | Pattern | Why safe |
|----------|---------|----------|
| `countdown.tsx` | Placeholder `—` until `useEffect` | Identical SSR + first paint |
| `particle-canvas.tsx` | Canvas in `useEffect` | Empty canvas SSR matches client |
| `share-modal.tsx`, `modal.tsx` | Browser APIs in handlers/effects | Event-driven |
| API routes | `crypto.randomUUID()`, `new Date()` | Server-only |
| `utils.generateSlug()` | `Math.random()` fallback | API-only |

---

## Infrastructure

### SSR utilities — `src/lib/ssr.ts`

- `isBrowser()`, `getCopyrightYear()`, `BUILDER_DEFAULT_EVENT_DATE`
- `formatEventDate()`, `formatDateTime()`

### Hooks — `src/lib/hooks/`

- `useMounted()` — SSR/first paint both `false`
- `useIsClient()` — alias for `useMounted()`
- `useClientValue()`, `useSafeLocalStorage()`, `useHydrationSafeTheme()`

### ESLint — `.eslintrc.json`

- Warn on `Math.random()` during render
- Warn on `typeof window` during render

---

## Prevention Checklist

1. Never use `Date.now()`, `Math.random()`, or `window` during render.
2. Nav typography: literal `.type-nav*` classes, not dynamic Tailwind strings.
3. Use `ButtonLink` instead of `<Link><Button>`.
4. Use `formatEventDate()` for displayed dates.
5. Gate Framer Motion `initial` with `useMounted()`.
6. Browser APIs only in `useEffect` or event handlers.
7. Do not swap JSX trees for responsive layout — use Tailwind `hidden` / `md:flex`.
8. Client hooks (ResizeObserver, etc.) behind `"use client"` boundaries.

---

## Verification

```bash
rm -rf .next
npm run dev
# Hard refresh: Ctrl+Shift+R on /, /dashboard/invitations/new
npm run build
```
