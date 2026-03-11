# Story 1.4: Global Navigation and First-Visit Orientation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a first-time visitor,
I want clear global navigation and orientation cues,
so that I can quickly understand where to go next and move through the site without confusion.

## Acceptance Criteria

1. Given a visitor is on any primary public page, when the global navigation is displayed, then it includes clear, direct links to the primary destinations for launch, and the labels are familiar and descriptive rather than clever or branded.
2. Given a visitor is using the site on desktop or mobile, when they access the global navigation, then they can reach the main destinations and return home without confusion, and the navigation pattern remains stable in purpose, placement, and interaction behavior.
3. Given a visitor is viewing the current page within the site, when the navigation renders, then the current page is indicated clearly but unobtrusively, and that indication does not rely on color alone.
4. Given a visitor is using a narrow mobile screen, when they access the navigation, then the mobile navigation pattern preserves access to key destinations without obscuring core content, and it avoids awkward gestures or hidden interaction requirements.
5. Given a visitor uses browser back and forward controls, when they move between primary pages, then navigation behavior remains predictable and link destinations behave like standard web navigation.

## Tasks / Subtasks

- [x] Establish the canonical launch navigation and route contract (AC: 1, 2, 5)
  - [x] Create a single source of truth for launch destinations in `src/config/navigation.ts` with direct labels for `Home`, `Projects`, `Resume`, and `Contact`; keep future writing/blog routes out of launch navigation. [Source: `_bmad-output/planning-artifacts/architecture.md`:741, `_bmad-output/planning-artifacts/architecture.md`:742, `_bmad-output/planning-artifacts/epics.md`:105]
  - [x] Replace the hardcoded route allowlist in `src/content/config.ts` with a navigation-aware or route-aware source so Story 1.3 CTA validation and Story 1.4 nav links cannot drift apart. [Source: `src/content/config.ts`:4, `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:43]
  - [x] Keep link behavior standard: normal anchor navigation, real built routes, and no JS interception that would weaken back/forward browser behavior. [Source: `_bmad-output/planning-artifacts/epics.md`:308, `_bmad-output/planning-artifacts/ux-design-specification.md`:421]
- [x] Implement reusable shared navigation in the app shell (AC: 1, 2, 3)
  - [x] Add shared navigation components under `src/components/navigation/` and render them from `src/layouts/BaseLayout.astro` so navigation is global rather than duplicated per route. [Source: `_bmad-output/planning-artifacts/architecture.md`:706, `_bmad-output/planning-artifacts/architecture.md`:798, `src/layouts/BaseLayout.astro`:21]
  - [x] Use semantic `header`/`nav`/list markup, a clear home link or site identity affordance, and direct destination labels instead of brand-like copy or icon-only controls. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:419, `_bmad-output/planning-artifacts/ux-design-specification.md`:421]
  - [x] Compute current-page state from the server-rendered route context and expose it with `aria-current="page"` plus a non-color-only visual treatment. [Source: `_bmad-output/planning-artifacts/epics.md`:298, `_bmad-output/planning-artifacts/ux-design-specification.md`:421, MDN `aria-current`, 2026-03-10]
- [x] Create bounded primary-route shells so navigation links are honest and usable (AC: 1, 2, 5)
  - [x] Add the first real launch destinations for `Projects`, `Resume`, and `Contact` using thin route files in `src/pages/projects/index.astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:681, `_bmad-output/planning-artifacts/architecture.md`:684, `_bmad-output/planning-artifacts/architecture.md`:685]
  - [x] Keep these routes intentionally bounded to first-visit orientation and route legitimacy; do not absorb Story 2.x project proof, Story 3.1 resume depth, or Story 3.3 contact workflow scope. [Source: `_bmad-output/planning-artifacts/epics.md`:417, `_bmad-output/planning-artifacts/epics.md`:540, `_bmad-output/planning-artifacts/epics.md`:595]
  - [x] Each route should provide enough heading and intro context that a first-time visitor understands why the page matters and how to continue evaluation, even before later story-specific content exists. [Source: `_bmad-output/planning-artifacts/prd.md`:84, `_bmad-output/planning-artifacts/ux-design-specification.md`:43]
- [x] Deliver a mobile-safe navigation pattern without breaking the static-first baseline (AC: 2, 4)
  - [x] Prefer a CSS-first or native-HTML mobile disclosure pattern that keeps interaction local and lightweight; only introduce client-side code if the accessibility and stability case is clear. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:555, `_bmad-output/planning-artifacts/ux-design-specification.md`:421]
  - [x] Keep mobile controls visible, reachable, and at least `44x44px`, with no gesture-only, hover-only, or hidden-hit-area behavior. [Source: `_bmad-output/planning-artifacts/epics.md`:113, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]
  - [x] Ensure the mobile pattern does not obscure the homepage hero or trap visitors in an overlay-heavy interaction model. [Source: `_bmad-output/planning-artifacts/epics.md`:303, `_bmad-output/planning-artifacts/ux-design-specification.md`:427]
- [x] Extend verification around route coverage, navigation semantics, and regression protection (AC: 1, 2, 3, 4, 5)
  - [x] Add Node-based regression tests for built navigation on the homepage and each new primary route, including destination labels, current-page indication, and real generated files under `dist/`. [Source: `tests/story-1-1-foundation.test.mjs`:208, `tests/story-1-3-homepage-hero.test.mjs`:83]
  - [x] Verify that only one link per page carries `aria-current="page"`, that current-page indication survives production build output, and that internal links point only to built routes or real same-page anchors. [Source: `_bmad-output/planning-artifacts/epics.md`:298, MDN `aria-current`, 2026-03-10]
  - [x] Run `npm run check`, `npm test`, and `npm run build` after implementation. [Source: `package.json`:8, `.github/workflows/ci.yml`:29]

## Dev Notes

### Developer Context

- Story 1.4 is the first cross-page trust-and-wayfinding story in Epic 1. It should turn the existing single-page hero baseline into a stable sitewide navigation system without diluting the calm, evaluator-friendly first impression established in Story 1.3. [Source: `_bmad-output/planning-artifacts/epics.md`:169, `_bmad-output/planning-artifacts/epics.md`:278, `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:49]
- The launch evaluation path must keep `Projects`, `Resume`, and `Contact` obvious across desktop and mobile, while future writing remains explicitly out of launch navigation scope. [Source: `_bmad-output/planning-artifacts/epics.md`:105, `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/ux-design-specification.md`:201]
- The UX spec treats navigation as the primary experience system. Users should feel in control within seconds, with no need to decode labels, recover from hidden interactions, or guess how to get back home. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:43, `_bmad-output/planning-artifacts/ux-design-specification.md`:59, `_bmad-output/planning-artifacts/ux-design-specification.md`:417]

### Technical Requirements

- Preserve the static-first Astro architecture: no database, no authentication, no public application API, and no global client-state layer just to support navigation. [Source: `_bmad-output/planning-artifacts/epics.md`:95, `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:129]
- The navigation must use clear launch destinations with direct labels. `Projects`, `Resume`, and `Contact` are the primary launch pathways; avoid clever wording, icon-only labels, or future-scope routes such as writing/posts in the main nav. [Source: `_bmad-output/planning-artifacts/epics.md`:290, `_bmad-output/planning-artifacts/ux-design-specification.md`:419]
- Because the current repo only ships `/` plus a same-page `#proof` CTA, Story 1.4 must add honest built destinations before global nav can point to them. Do not ship nav links to routes that do not exist. [Source: `src/pages/index.astro`:30, `src/content/config.ts`:4, `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:142]
- Current-page indication must be accessible and unobtrusive. Use `aria-current="page"` on exactly one nav link per page and pair it with a visible treatment beyond color alone, such as underline, border, weight, marker text, or a structural cue. [Source: `_bmad-output/planning-artifacts/epics.md`:298, `_bmad-output/planning-artifacts/prd.md`:281, MDN `aria-current`, 2026-03-10]
- Keep browser navigation native and dependable. Use ordinary anchors and route navigation rather than JS-driven history tricks, faux buttons, or overlay-only pathing that can break back/forward expectations. [Source: `_bmad-output/planning-artifacts/epics.md`:308, `_bmad-output/planning-artifacts/ux-design-specification.md`:51]
- Mobile navigation must preserve access without covering core content or requiring awkward gestures. A narrow, accessible disclosure is acceptable; a heavy full-screen takeover is not the default. [Source: `_bmad-output/planning-artifacts/epics.md`:303, `_bmad-output/planning-artifacts/ux-design-specification.md`:421, `_bmad-output/planning-artifacts/ux-design-specification.md`:427]
- Route shells added in this story should be orientation-forward, not placeholder theater. Give each primary destination a real heading and short context that explains why the visitor is there and what deeper story will later fill in. [Source: `_bmad-output/planning-artifacts/prd.md`:84, `_bmad-output/planning-artifacts/ux-design-specification.md`:147]
- Preserve the document outline. Shared header/site identity should not add a second page-level `<h1>`; each primary route should continue to expose exactly one page `h1`, with nav text kept at non-heading or subordinate-heading levels. [Source: `tests/story-1-3-homepage-hero.test.mjs`:89]

### Architecture Compliance

- Keep route files thin and shared nav global. `src/layouts/BaseLayout.astro` should own the shared shell, while nav components live under `src/components/navigation/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:693, `_bmad-output/planning-artifacts/architecture.md`:705, `_bmad-output/planning-artifacts/architecture.md`:798]
- Follow the architecture's planned route structure for launch pages: `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:680, `_bmad-output/planning-artifacts/architecture.md`:682, `_bmad-output/planning-artifacts/architecture.md`:684, `_bmad-output/planning-artifacts/architecture.md`:685]
- Use `src/config/` for stable navigation configuration rather than scattering nav arrays through layouts and pages. The architecture already reserves `src/config/navigation.ts` for this role. [Source: `_bmad-output/planning-artifacts/architecture.md`:742, `_bmad-output/planning-artifacts/architecture.md`:808]
- Reusable nav components must not own route-specific content loading. Route files and layouts can pass pathname/config props downward, but nav components should stay presentation-focused. [Source: `_bmad-output/planning-artifacts/architecture.md`:800, `_bmad-output/planning-artifacts/architecture.md`:889]
- Keep authored content and schemas centralized when real content is introduced. If this story adds minimal route-intro content for `resume` or `contact`, extend the canonical `pages` collection instead of inventing a second content model. [Source: `_bmad-output/planning-artifacts/architecture.md`:813, `_bmad-output/planning-artifacts/architecture.md`:814]
- Decide the route-shell content strategy explicitly before coding: either (a) broaden the `pages` collection just enough to support reusable page-title/intro content for `resume` and `contact`, or (b) keep those shells route-authored and intentionally minimal for now. Do not leave the repo half on one strategy and half on the other. [Source: `src/content/config.ts`:6, `_bmad-output/planning-artifacts/architecture.md`:814]
- Do not use Story 1.4 as a reason to activate `src/pages/api/`, optional integrations, analytics, or newsletter seams. They remain future-only boundaries. [Source: `_bmad-output/planning-artifacts/architecture.md`:787, `_bmad-output/planning-artifacts/architecture.md`:807]

### Library / Framework Requirements

- Preserve the current validated stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, and `typescript@^5.9.3`. [Source: `package.json`:14]
- In Astro 5, current-route state can be derived server-side from `Astro.url.pathname`; use that instead of client routers or app-state infrastructure for nav highlighting on static pages. [Source: Astro render context docs (`Astro.url.pathname`), 2026-03-10]
- Normalize pathname comparisons before applying active-link state so `/projects` and `/projects/` resolve to the same current-page result in static output and tests. [Source: Astro render context docs (`Astro.url.pathname`), 2026-03-10]
- Tailwind 4 remains mobile-first: unprefixed styles target mobile first, `md:` begins at `48rem` / `768px`, and `lg:` begins at `64rem` / `1024px`, which matches the architecture's breakpoint plan. [Source: `_bmad-output/planning-artifacts/epics.md`:104, Tailwind responsive design docs v4.2, 2026-03-10]
- If a mobile-menu disclosure needs state, keep it narrowly scoped and removable. Prefer native semantics or minimal local behavior over hydrating the whole header. [Source: `_bmad-output/planning-artifacts/architecture.md`:546, `_bmad-output/planning-artifacts/architecture.md`:555]
- Keep the warm editorial visual language already established in `src/styles/global.css`: restrained palette, serif-led hierarchy, clean sans-serif UI copy, and stable focus-visible treatment. [Source: `src/styles/global.css`:3, `_bmad-output/planning-artifacts/ux-design-specification.md`:167, `_bmad-output/planning-artifacts/ux-design-specification.md`:173]

### File Structure Requirements

- Expected shared-shell and styling touchpoints: `src/layouts/BaseLayout.astro`, `src/styles/global.css`, and possibly `src/pages/index.astro` if the homepage needs composition updates after the shell changes. [Source: `src/layouts/BaseLayout.astro`:12, `src/styles/global.css`:41, `src/pages/index.astro`:30]
- Expected new navigation/config paths: `src/config/navigation.ts` plus `src/components/navigation/` components such as `SiteHeader.astro`, `SiteNav.astro`, and an optional bounded mobile-nav component if the split improves clarity. [Source: `_bmad-output/planning-artifacts/architecture.md`:705, `_bmad-output/planning-artifacts/architecture.md`:706, `_bmad-output/planning-artifacts/architecture.md`:707, `_bmad-output/planning-artifacts/architecture.md`:742]
- Expected new route shells: `src/pages/projects/index.astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:682, `_bmad-output/planning-artifacts/architecture.md`:684, `_bmad-output/planning-artifacts/architecture.md`:685]
- If minimal authored page copy is added now, use `src/content/pages/contact.md` and `src/content/pages/resume.md`; do not invent unrelated folders or a fake projects content model just to satisfy navigation. [Source: `_bmad-output/planning-artifacts/architecture.md`:725, `_bmad-output/planning-artifacts/architecture.md`:726, `_bmad-output/planning-artifacts/architecture.md`:727]
- Do not create `src/stores`, `src/db`, `src/auth`, or route-local duplicated nav constants. [Source: `tests/story-1-1-foundation.test.mjs`:65, `tests/story-1-1-foundation.test.mjs`:196]

### Testing Requirements

- Reuse the existing validation contract: `npm run check`, `npm test`, and `npm run build` remain required local and CI gates. [Source: `package.json`:8, `.github/workflows/ci.yml`:29]
- Extend the Node-based regression suite instead of introducing a new browser test stack just for navigation. Existing tests already validate built HTML contracts and static-first guardrails. [Source: `tests/story-1-1-foundation.test.mjs`:201, `tests/story-1-3-homepage-hero.test.mjs`:83]
- Add coverage that `dist/index.html`, `dist/projects/index.html`, `dist/resume/index.html`, and `dist/contact/index.html` are generated and each contains the shared navigation with direct launch labels. [Source: `_bmad-output/planning-artifacts/architecture.md`:951]
- Verify that each primary page exposes exactly one current nav item with `aria-current="page"`, and that current-page treatment is not implemented only through color-specific class changes. [Source: `_bmad-output/planning-artifacts/epics.md`:298, MDN `aria-current`, 2026-03-10]
- Add assertions that each primary page still renders exactly one `<h1>` after the shared header/nav is introduced. [Source: `tests/story-1-3-homepage-hero.test.mjs`:89]
- Verify the mobile pattern remains static-first unless a clearly bounded exception is chosen. Build output should not show broad `client:*` hydration directives attached to the whole header. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `tests/story-1-3-homepage-hero.test.mjs`:102]
- Confirm internal nav links target only built routes, the homepage hero CTA still points to a real destination, and browser-standard anchor markup remains intact. [Source: `src/content/pages/home.md`:11, `_bmad-output/planning-artifacts/epics.md`:308]
- Keep focus visibility and target-size basics intact on the new nav controls, especially on narrow screens. [Source: `src/styles/global.css`:36, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]

### Previous Story Intelligence

- Story 1.3 already converted the homepage into a content-driven, route-thin composition with a warm editorial style and a same-page orientation CTA. Reuse that shell and tone instead of rebuilding the homepage around a new pattern. [Source: `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:28, `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:52]
- The repo currently has no global nav, no `src/components/navigation/` layer, and only `/` as a built route. Story 1.4 should fill that gap in the architecture-approved place rather than improvising page-local nav blocks. [Source: `src/layouts/BaseLayout.astro`:21, `src/content/config.ts`:4]
- Story 1.3 left an explicit review follow-up about replacing the hardcoded built-route set in `src/content/config.ts`. Story 1.4 is the first natural moment to resolve that drift risk because multiple real routes now become launch scope. [Source: `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:43]
- Keep verification lightweight and build-oriented. The existing test strategy is Node-based and already tuned for the CI Node version. [Source: `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:93, `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`:186]

### Git Intelligence Summary

- Recent commit style is short and imperative: `Complete Story 1.3 homepage hero introduction`, `Fix Story 1.3 review follow-ups`, `Complete Story 1.2 CI/CD deployment baseline`. Follow that style if this story is later committed. [Source: `git log -5 --oneline`, 2026-03-10]
- The current source footprint is still intentionally small. Shared shell changes should stay concentrated in the layout, global styles, route files, and new navigation/config files rather than spreading nav logic across unrelated folders. [Source: current repo state review, 2026-03-10]
- Tests currently protect static output, one clear `h1` on the homepage, valid same-page CTA behavior, and no premature global-state scaffolding. Story 1.4 should extend those guardrails instead of bypassing them. [Source: `tests/story-1-1-foundation.test.mjs`:65, `tests/story-1-3-homepage-hero.test.mjs`:89]

### Latest Tech Information

- Astro 5's render context exposes `Astro.url.pathname`, which is the right static-safe primitive for current-page link state in `.astro` layouts and pages. No client router is needed for this requirement. [Source: Astro render context docs (`Astro.url.pathname`), 2026-03-10]
- Tailwind CSS 4.2 keeps the default responsive breakpoints at `sm 40rem`, `md 48rem`, and `lg 64rem`, and its guidance remains to build mobile first with unprefixed utilities. That fits the architecture's `320-767`, `768-1023`, and `1024+` breakpoint strategy. [Source: Tailwind responsive design docs v4.2, 2026-03-10]
- Current ARIA guidance remains to use `aria-current="page"` for the current page within a set of nav links and to apply it to only one item in the set. This should inform both markup and regression tests. [Source: MDN `aria-current`, 2026-03-10]

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, architecture, UX specification, epics file, sprint tracker, previous story artifact, recent git history, and current repo state as its context set.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- `src/layouts/BaseLayout.astro` is the natural global shell entry point and currently renders only `<slot />`, so Story 1.4 can add shared header/nav there without undoing Story 1.3's route-thin homepage composition. [Source: `src/layouts/BaseLayout.astro`:21]
- `src/pages/index.astro` already composes reusable sections and loads content through Astro content collections, which means homepage nav/orientation changes should be additive rather than a rewrite. [Source: `src/pages/index.astro`:8, `src/pages/index.astro`:30]
- `src/styles/global.css` already carries the project's palette, fonts, focus-visible treatment, and responsive baseline, so nav styling should extend those tokens instead of introducing a parallel styling system. [Source: `src/styles/global.css`:3, `src/styles/global.css`:36, `src/styles/global.css`:239]

### Anti-Pattern Prevention

- Do not ship global nav links to routes that do not exist yet.
- Do not hide critical navigation behind hover-only, gesture-only, or decorative-only behavior.
- Do not implement current-page state with color alone or by styling a non-link while leaving links ambiguous.
- Do not hydrate the whole header or add a global client store just to open a mobile menu.
- Do not let Story 1.4 balloon into full projects, resume, or contact experiences that belong to later stories.
- Do not add writing/posts to launch navigation or create fake placeholder destinations to imply unsupported scope.
- Do not duplicate route lists across content validation, layout markup, and tests.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 1 and Story 1.4 requirements, launch-navigation scope, and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - first-minute evaluation path, MVP scope boundaries, browser/mobile expectations, and accessibility target
- `_bmad-output/planning-artifacts/architecture.md` - route structure, navigation component locations, config boundaries, static-first rules, and testing/deployment structure
- `_bmad-output/planning-artifacts/ux-design-specification.md` - navigation principles, mobile behavior, accessibility expectations, and editorial experience constraints
- `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md` - previous-story learnings, route/content patterns, and route-validation follow-up
- `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/content/config.ts`, `src/content/pages/home.md`, and `src/styles/global.css` - current repo baseline relevant to navigation/orientation work
- `tests/story-1-1-foundation.test.mjs` and `tests/story-1-3-homepage-hero.test.mjs` - existing regression/test style to extend

### Definition of Done

- Shared global navigation renders on the homepage and each launch-primary route with direct labels for `Home`, `Projects`, `Resume`, and `Contact`.
- Visitors can navigate between those primary pages and return home using normal links and normal browser back/forward behavior.
- The current page is indicated clearly and accessibly with `aria-current="page"` plus a non-color-only visual treatment.
- Mobile navigation preserves access to launch destinations without obscuring core content or depending on awkward gestures.
- Route files remain thin, shared nav/config stay centralized, and the static-first architecture is preserved.
- `npm run check`, `npm test`, and `npm run build` pass, and built output contains real nav markup for all primary pages.
- No runtime API, global store, database, auth, analytics, CMS, or future-writing launch scope is introduced.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `1.4` and resolved to `1-4-global-navigation-and-first-visit-orientation`.
- Workflow resources loaded: dev-story `workflow.yaml`, `instructions.xml`, `checklist.md`, and `_bmad/core/tasks/workflow.xml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and previous story `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`.
- Repo state reviewed through `git log -5 --oneline`, current `src/` files, current test files, CI workflow, and package metadata.
- Additional research gathered for Astro 5 route context, Tailwind 4 responsive behavior, and `aria-current` guidance for accessible current-page indication.
- No `project-context.md` file was present anywhere in the repository during workflow execution.

### Implementation Plan

- Centralized launch navigation and built-route validation in `src/config/navigation.ts` so content validation, layout rendering, and route tests share one contract.
- Added a reusable shared header/nav in the base layout with semantic markup, route-derived `aria-current`, and a non-color-only current-page marker.
- Implemented thin `Projects`, `Resume`, and `Contact` route shells that provide first-visit orientation without pulling later story scope forward.
- Extended the Node-based regression suite to verify build output, generated route files, one current nav item per page, and the static-first mobile navigation pattern.

### Completion Notes List

- Implemented a shared launch-navigation contract in `src/config/navigation.ts` and reused it in `src/content/config.ts` so homepage CTA validation and global nav routes cannot drift apart.
- Added shared navigation components in `src/components/navigation/` and rendered them from `src/layouts/BaseLayout.astro` using `Astro.url.pathname` plus `aria-current="page"` and a visible current-page marker.
- Added thin launch-primary route shells for `Projects`, `Resume`, and `Contact`, keeping content bounded to first-visit orientation rather than later story depth.
- Introduced a CSS-first mobile navigation treatment with reachable controls and no header-wide hydration or JS interception.
- Added Story 1.4 regression coverage for source contracts and built HTML across `/`, `/projects/`, `/resume/`, and `/contact/`.
- Verified the implementation with `npm run check`, `npm test`, and `npm run build`.
- Review fixes aligned route validation with normalized path handling, collapsed mobile disclosure by default on narrow screens, matched the documented `48rem` breakpoint, and added built-link assertions for internal routes and same-page anchors.

### File List

- `_bmad-output/implementation-artifacts/1-4-global-navigation-and-first-visit-orientation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/navigation/SiteHeader.astro`
- `src/components/navigation/SiteNav.astro`
- `src/config/navigation.ts`
- `src/content/config.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/contact.astro`
- `src/pages/projects/index.astro`
- `src/pages/resume.astro`
- `src/styles/global.css`
- `tests/story-1-4-navigation.test.mjs`

## Senior Developer Review (AI)

- Outcome: Approve
- Reviewer: Chris
- Date: 2026-03-11
- Findings addressed:
  - Updated `src/config/navigation.ts` so content route validation accepts normalized built-route variants instead of rejecting slashless equivalents.
  - Refined `src/components/navigation/SiteHeader.astro` and `src/styles/global.css` so desktop navigation stays visible while the mobile disclosure remains collapsed by default and switches at the documented `48rem` breakpoint.
  - Extended `tests/story-1-4-navigation.test.mjs` to verify built internal route targets and same-page anchors instead of only checking nav labels and active-state markup.
- Validation rerun after fixes:
  - `npm run check` ✅
  - `npm test` ✅
  - `npm run build` ✅

## Change Log

- 2026-03-11: Implemented shared launch navigation, added bounded primary route shells, extended regression coverage, and validated with check/test/build.
- 2026-03-11: Fixed review findings by normalizing built-route validation, collapsing mobile disclosure by default, aligning the breakpoint contract, and strengthening built-link regression coverage.
