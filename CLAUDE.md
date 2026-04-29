# CLAUDE.md — Motion Dynamics website

> Loaded automatically by Claude Code at the start of every session in this repo. Read this first. Internal strategy and the full prompt runbook are in `docs/internal/` (gitignored).

---

## 1. Project context

Motion Dynamics is a UK movement-intelligence company. We extract physics-validated 3D pose, biomechanics, and kinematics from any standard video, with no sensors or wearables. This repo is the public marketing site at `motiondynamics.ai`.

The active workstream is a full visual redesign — same information architecture as today, new visual language built around a live React Three Fiber hero. The design brief is at `docs/internal/design-brief.md`. The phased prompt runbook is at `docs/internal/claude-code-runbook.md`.

All redesign work happens on branch `redesign/3d-hero` until merged.

---

## 2. Stack

- **Build:** Vite 7
- **Framework:** React 18 + TypeScript (the JSX → TSX migration is part of the redesign — anything new must be `.tsx` / `.ts`, no new `.jsx`)
- **Styling:** Tailwind 4 with `@theme` tokens in `src/styles/globals.css` (the v3 → v4 upgrade is part of the redesign)
- **Animation:** Framer Motion (in-view reveals) + GSAP ScrollTrigger (scroll-driven, pinning, scrubbing)
- **Smooth scroll:** Lenis (never CSS `scroll-behavior: smooth`)
- **3D:** `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`
- **Routing:** React Router 6
- **Email:** emailjs-com
- **SEO:** react-helmet
- **Validation:** Zod (for emailjs payloads and any external input)
- **E2E tests:** Playwright (smoke test for the demo CTA flow)
- **Hosting:** GitHub Pages, deploy via `.github/workflows/deploy.yml` on push to `main`. Static SPA, no server functions, no edge OG-image rendering.

**Forbidden:**

- AOS (`aos` package) — being removed; do not reintroduce
- styled-components, emotion, or any CSS-in-JS — Tailwind only
- `<style>` blocks inside components — global styles live only in `src/styles/globals.css`
- Bare three.js scenes — always wrap in React Three Fiber `<Canvas>`
- React.FC, default exports for components, `any` (use `unknown` + narrowing)
- `console.log` in production code

---

## 3. Brand voice

- **British English** throughout: organisation, behaviour, optimise, colour, centre.
- **Quiet authority, scientific.** B2B clinicians, sports scientists, defence buyers. Calm credibility, not "look at our WebGL".
- **Inspirations:** Whoop, Oura, Eleven Labs, Stripe, Linear.
- **Forbidden register:** Bruno Simon, Awwwards-maximalist, neon, glitch, camera shake, chromatic aberration.

The 3D scene on the hero is the actual product output, not decoration. We do not put generic Mixamo or AI-generated humans on this site — that contradicts our core differentiator (physics-validated motion data).

---

## 4. Visual rules

### Palette — locked, do not add new colours

```css
@theme {
  --color-md-bg: #0A0E14;          /* page background */
  --color-md-surface: #111821;     /* section dividers, card surfaces */
  --color-md-accent: #00E5A0;      /* primary accent — confirm with Max Ward before launch */
  --color-md-accent-soft: #7C5CFF; /* secondary accent — physics overlay glow */
  --color-md-text-hi: #F5F7FA;     /* headlines */
  --color-md-text-mid: #A4ADBC;    /* body */
  --color-md-warn: #FFB347;        /* charts only — physics-out-of-range */
}
```

Total ceiling: 7 colours. Anything more reads as cluttered.

### Typography

- Display + body in the same grotesk family (Inter Display / Söhne / General Sans — confirm with Max Ward).
- Headlines: low letter-spacing, never italic.
- Body: 17–18px, line-height ≥ 1.55.
- Numerals: tabular figures everywhere a stat appears (`font-variant-numeric: tabular-nums`).

### Motion register

- All easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Set as the default Tailwind transition timing function.
- Transitions: 600–800 ms. If a transition is < 300 ms, you are probably wrong.
- Skeleton motion: real biomechanical playback at 24–30 fps from source data, not interpolated UI animation.
- Smooth scroll: Lenis only.

---

## 5. 3D rules (non-negotiable)

- React Three Fiber only — no bare three.js scenes.
- **Every** R3F scene must respect `prefers-reduced-motion: reduce`. Use Framer Motion's `useReducedMotion` hook at the top of any animated component.
- **Every** R3F scene must pause `useFrame` when `document.visibilityState !== 'visible'`.
- 3D scenes are always dynamically imported via `React.lazy(() => import('./SceneFile'))` and wrapped in `<Suspense fallback={…}>`.
- Hero performance budget:
  - Non-3D bundle ≤ 250 KB
  - LCP ≤ 2.5 s on 4G
  - 3D ready ≤ 3 s with a video fallback during load
  - 60 fps on a 2020 MacBook Air; ≥ 30 fps on a mid-range Android
- Skeleton render: thin emissive lines between joints + small joint spheres in `--color-md-accent`. **Never** render filled body segments — even when the source GLB contains them.
- Mobile (< 768px or `pointer: coarse`): no R3F. Render the existing `skeleton_overlay_*.mp4` videos in `src/assets/` as fallbacks.
- Always `dispose()` geometries and materials in cleanup `useEffect` — Vite HMR will leak otherwise.

---

## 6. Skeleton joint connectivity

The hero loads `public/skeletons/nfl.glb`. It's a segmented rigid-body export (no armature, no skin) with 39 body-segment meshes (`MD_B_*`) and 16 joint-marker meshes (`MD_J_*`). **Render only the joints + lines between them.**

Connectivity for stick-figure rendering:

| Chain | Joints |
|---|---|
| Spine | `MD_J_hip_c` → `MD_J_chest` → `MD_J_neck` → `MD_J_head` |
| Left arm | `MD_J_chest` → `MD_J_l_sh` → `MD_J_l_el` → `MD_J_l_wr` |
| Right arm | `MD_J_chest` → `MD_J_r_sh` → `MD_J_r_el` → `MD_J_r_wr` |
| Left leg | `MD_J_hip_c` → `MD_J_l_hip` → `MD_J_l_kn` → `MD_J_l_an` |
| Right leg | `MD_J_hip_c` → `MD_J_r_hip` → `MD_J_r_kn` → `MD_J_r_an` |

Animations: 16 `MD_J_*Action` clips (translation only). Play all together via `useAnimations` from drei, `LoopRepeat`. All 16 clips share the same 4.542s duration at 24 fps — they're synchronised by construction.

---

## 7. TypeScript rules (extends `~/.claude/rules/typescript/coding-style.md`)

- Strict mode, no `any`. Use `unknown` for external/untrusted input, then narrow with type guards.
- Define component props with named `interface`. Type callback props explicitly.
- No `React.FC`.
- Public APIs (exported functions, shared utilities) must have explicit parameter and return types. Local variables use inference.
- Prefer string-literal unions over `enum`.
- Validate external input with Zod; infer types from the schema with `z.infer`.
- No `console.log` in production code. Use a proper logger (or remove the statement).
- Async/await with try/catch; narrow `unknown` errors safely with `instanceof Error`.

---

## 8. File structure rules

- One component per file, named export.
- 3D scenes live in `src/components/hero/` (the hero scene) or `src/components/3d/<scene>/` (any future scenes).
- Global styles only in `src/styles/globals.css` — no `<style>` blocks in components.
- Internal docs (brief, runbook, strategy notes) live in `docs/internal/` and are gitignored.
- Never commit `src/components.zip` or `src/components 2.zip` — these are stale archives. Delete on sight.

---

## 9. Asset rights — strict

**Allowed on the public site:**

- PGA, PSA, Teknik, UOB, MOD, ObiRobotics, RalleyForm, WSF, squashTV, squashPerformance (logos in `src/assets/pics/logo/`)
- Stuart Macgregor's own squash data
- Hinge Health (rights cleared 2026-04-29)
- University of Birmingham research footage
- Any asset in `public/skeletons/` (e.g. `nfl.glb`) — internal pipeline output, rights cleared

**Forbidden — do not reference, embed, or link:**

- BMW (any footage, logos, or case study material)
- FA (any footage, logos, or case study material)

If a future asset is unclear, ask before using.

---

## 10. Definition of done (per change)

Before considering any task complete:

- `npm run lint` passes with no warnings
- `npm run typecheck` (`tsc --noEmit`) passes
- `npm run dev` shows no console errors in the browser
- Affected sections screenshot-verified (Playwright MCP if installed, or manual + paste the screenshot back)
- For redesign-phase work: branch is `redesign/3d-hero`, `git diff --stat` matches the expected scope (no surprise file changes outside the phase's intent)

Before opening a PR:

- Lighthouse Performance ≥ 90
- LCP ≤ 2.5 s, CLS ≤ 0.05
- Hero ≥ 55 fps on a 2020 MBA in Chrome
- Playwright smoke test (`npm run test:e2e`) passes
- No console errors in production build
- OG image renders correctly when the URL is shared in Slack and LinkedIn

---

## 11. Common pitfalls — flag and fix on sight

1. **`useGLTF` without `<Suspense>`.** R3F requires Suspense around any component that calls `useGLTF`. Forgetting it triggers cryptic uncaught-Suspense errors.
2. **Lenis + GSAP ScrollTrigger integration.** ScrollTrigger needs a custom `scrollerProxy` to read scroll position from Lenis. If scroll-pinned sections feel janky, this is almost always why.
3. **Missing `prefers-reduced-motion`.** Easy to forget on every new animated component. Add `useReducedMotion` at the top of any new component before writing the animation logic.
4. **Three.js memory leaks on hot reload.** Geometries and materials must be disposed in cleanup `useEffect`. Vite HMR will leak GPU memory otherwise.
5. **Video autoplay on iOS.** Requires `playsInline muted autoPlay` together. Without `playsInline`, iOS refuses autoplay and the mobile fallback breaks.
6. **GitHub Pages base path.** Currently we're on a root domain (`CNAME` in `public/`), so the default Vite `base: '/'` is correct. If we move to a subpath, asset URLs (`/skeletons/nfl.glb`) need adjustment via Vite's `base` config.

---

## 12. Working agreements with Claude

- Run each redesign phase as a fresh session. `/clear` between phases. Long-context drift is the biggest failure mode.
- After every prompt, print `git diff --stat` to surface unexpected changes.
- When a 3D rendering issue is unclear, propose three hypotheses before testing — cheapest first.
- Iterate visually: take a screenshot of any visual issue and feed it back rather than describing it in text.
- When the user corrects an approach, update this `CLAUDE.md` so future sessions inherit the correction.
