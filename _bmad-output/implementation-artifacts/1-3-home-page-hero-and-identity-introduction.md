# Story 1.3: Home Page Hero and Identity Introduction

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a first-time visitor,
I want the homepage hero to immediately show who Chris is, what he does, and why this site is worth exploring,
so that I can quickly judge whether the site is relevant to my evaluation.

## Acceptance Criteria

1. Given a visitor lands on the home page on a supported desktop or mobile browser, when the first viewport renders, then the page presents Chris's name, professional role or focus, and a concise introduction above the fold, and the content is scannable without requiring technical insider knowledge.
2. Given a visitor lands on the home page, when they scan the hero and introduction content, then they can identify Chris as a real individual with a clear professional context, and the page includes at least one visible trust-oriented cue such as portrait, credibility tag, or professional signal.
3. Given a visitor is evaluating the site quickly, when they view the hero section, then they can identify an obvious next step to continue evaluation, and that next step does not rely on hidden, hover-only, or ambiguous interaction.
4. Given the home page is rendered in the MVP implementation, when visual styling and motion are applied, then the experience reflects the intended editorial-first visual direction, and motion remains non-essential to understanding the identity content.

## Tasks / Subtasks

- [x] Model the homepage hero content in the canonical content layer (AC: 1, 2, 3)
  - [x] Extend `src/content/config.ts` only as needed for homepage hero fields; do not create a second schema-definition location.
  - [x] Add authored homepage content under `src/content/pages/home.md` so identity copy, trust cues, and next-step labels live in source-controlled content instead of hardcoded route constants.
  - [x] Use frontmatter as the hero content contract: `title`, `description`, `heroName`, `heroRole`, `heroIntro`, `trustTags`, `primaryCtaLabel`, `primaryCtaHref`, and portrait metadata such as `portraitSrc`/`portraitAlt` if a portrait is rendered.
  - [x] Constrain the schema so `trustTags` is a short list of 1-4 concise labels, `primaryCtaHref` is either a same-page anchor (`#...`) or an existing built route (`/...`), and portrait fields are optional together rather than independently drifting.
  - [x] Keep first-screen copy concise, low-jargon, and evaluator-friendly: clearly state Chris's name, role/focus, and why the site is worth exploring.
- [x] Implement a reusable editorial hero section and keep the route thin (AC: 1, 2, 4)
  - [x] Create `src/components/sections/HeroSection.astro` for the main hero composition and import it from `src/pages/index.astro` instead of growing reusable UI directly in the route file.
  - [x] Reuse `src/layouts/BaseLayout.astro` and extend `src/styles/global.css` with token-like variables and homepage styling that match the warm editorial direction.
  - [x] Render a clear heading hierarchy, concise supporting copy, sparse trust tags/signals, and a portrait or equivalent visible trust cue that identifies Chris as a real person.
- [x] Add an obvious next-step treatment without introducing broken routes or unrelated scope (AC: 2, 3, 4)
  - [x] Provide at least one visible next-step affordance in the hero that points to an existing destination or to a real below-hero section rendered in this story; the preferred same-page target is a lightweight `SocialProofSection.astro` or equivalent evaluative summary section with actual trust value, not a fake placeholder anchor.
  - [x] Make the next step visible by default on desktop and mobile; it must not depend on hover, hidden menus, or decorative motion.
  - [x] Keep this story scoped to hero and identity introduction; do not absorb full global navigation, projects/resume/contact page builds, blog/writing, analytics, CMS, or serverless features.
- [x] Preserve static-first quality and extend verification (AC: 1, 2, 3, 4)
  - [x] Keep the homepage server-rendered by default with no broad hydration, no global client state, and no motion dependency for comprehension.
  - [x] Update the existing lightweight Node-based test coverage so the built homepage contract validates the new hero title/content and rejects regressions to baseline placeholder copy.
  - [x] Run `npm run check`, `npm test`, and `npm run build` after implementation.

## Dev Notes

### Developer Context

- Story 1.3 is the first directly user-visible Epic 1 story after foundation and CI/deploy setup; it must convert the baseline Astro app into a credible first-screen trust moment without expanding into later navigation, resume, or project-detail scope. [Source: `_bmad-output/planning-artifacts/epics.md`:169, `_bmad-output/planning-artifacts/epics.md`:248]
- The homepage is the trust gateway for recruiters, hiring managers, consulting prospects, peers, and non-technical visitors. The first screen must answer who Chris is, what kind of work he does, and what to do next within seconds. [Source: `_bmad-output/planning-artifacts/prd.md`:66, `_bmad-output/planning-artifacts/prd.md`:149, `_bmad-output/planning-artifacts/ux-design-specification.md`:221]
- The site itself is part of the evidence. The hero should therefore feel custom, polished, and intentional, but clarity and trust outrank decorative behavior. [Source: `_bmad-output/planning-artifacts/prd.md`:47, `_bmad-output/planning-artifacts/prd.md`:51, `_bmad-output/planning-artifacts/ux-design-specification.md`:207]

### Technical Requirements

- Preserve the greenfield, static-first, content-first architecture: no database, no authentication, no public application API, and no global client state at launch. [Source: `_bmad-output/planning-artifacts/epics.md`:95]
- Use Astro content collections and source-controlled content as the system of record for homepage identity content; do not hardcode the canonical hero copy in the route file. [Source: `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/architecture.md`:813]
- Keep the first viewport scannable and low-jargon. The hero must present Chris's name, role/focus, concise introduction, and at least one trust cue such as a portrait or credibility tag. [Source: `_bmad-output/planning-artifacts/epics.md`:258, `_bmad-output/planning-artifacts/epics.md`:265, `_bmad-output/planning-artifacts/prd.md`:98]
- Provide an obvious next step that remains visible without hover-only behavior. If a destination is linked, it must exist at implementation time or use an in-page pathway instead of a broken route. [Source: `_bmad-output/planning-artifacts/epics.md`:268, `_bmad-output/planning-artifacts/prd.md`:149, `_bmad-output/planning-artifacts/ux-design-specification.md`:419]
- Use a concrete homepage content contract instead of ad hoc parsing: frontmatter should carry hero identity, trust tags, portrait metadata, and CTA fields, while markdown body remains optional for supporting copy. Do not bypass the content collection with route-level constants. [Source: `src/content/config.ts`:3, `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/architecture.md`:814]
- Recommended schema shape for Story 1.3: `heroName`, `heroRole`, and `heroIntro` as required non-empty strings; `trustTags` as `z.array(z.string().min(1)).min(1).max(4)`; `primaryCtaLabel` as a required non-empty string; `primaryCtaHref` as a required string constrained to `#...` or `/...`; `portraitSrc` optional, but if present it must be paired with a non-empty `portraitAlt`. [Source: `src/content/config.ts`:3, `_bmad-output/planning-artifacts/architecture.md`:814]
- Motion is optional polish only. Any reveal, scroll emphasis, or image treatment must remain non-essential to comprehension and must respect reduced-motion preferences. [Source: `_bmad-output/planning-artifacts/epics.md`:273, `_bmad-output/planning-artifacts/ux-design-specification.md`:215]
- Follow the established visual system guidance for this first-screen work: warm palette rooted in `#FFF4EA`, `#EDDCC6`, `#BF4646`, and `#7EACB5`, serif-led display hierarchy, clean sans-serif UI/body text, sparse trust tags, and an upper-right portrait treatment if used. [Source: `_bmad-output/planning-artifacts/epics.md`:106, `_bmad-output/planning-artifacts/epics.md`:107, `_bmad-output/planning-artifacts/ux-design-specification.md`:167, `_bmad-output/planning-artifacts/ux-design-specification.md`:173, `_bmad-output/planning-artifacts/ux-design-specification.md`:199, `_bmad-output/planning-artifacts/ux-design-specification.md`:213]

### Architecture Compliance

- Keep `src/pages/index.astro` route-thin: it should compose content and section components, not become the long-term home of reusable hero markup. [Source: `_bmad-output/planning-artifacts/architecture.md`:468, `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:801]
- Follow the architecture's identity mapping: homepage route in `src/pages/index.astro`, authored home content in `src/content/pages/home.md`, and hero UI in `src/components/sections/HeroSection.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:824, `_bmad-output/planning-artifacts/architecture.md`:825, `_bmad-output/planning-artifacts/architecture.md`:826]
- Keep `src/content/config.ts` as the single schema-definition boundary. Preserve `src/content.config.ts` only as the existing re-export shim. [Source: `_bmad-output/planning-artifacts/architecture.md`:814, `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`:101]
- Load collection content in the route or a dedicated content helper, not inside reusable section components. Reusable sections should receive prepared data via props instead of owning canonical content queries. [Source: `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:801, `_bmad-output/planning-artifacts/architecture.md`:805]
- Recommended loading pattern: `src/pages/index.astro` loads the `home` content entry, maps frontmatter into props, and passes those props into `HeroSection.astro` and any same-page supporting section used as the CTA destination. [Source: `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:825]
- Reusable presentation subparts that emerge from the hero should move downward into shared component layers (`src/components/ui/`) instead of bloating the route or duplicating page-local markup. [Source: `_bmad-output/planning-artifacts/architecture.md`:796, `_bmad-output/planning-artifacts/architecture.md`:802]
- Keep optional dynamic seams optional. Do not introduce `src/pages/api/`, contact submissions, analytics clients, or other runtime dependencies just to implement the hero. [Source: `_bmad-output/planning-artifacts/architecture.md`:787, `_bmad-output/planning-artifacts/architecture.md`:790]

### Library / Framework Requirements

- Preserve the current baseline stack already validated by Stories 1.1 and 1.2: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`. [Source: `package.json`:14]
- Tailwind 4 should continue to use the current CSS import pattern (`@import "tailwindcss"`) rather than legacy `@tailwind` directives. Extend the existing global stylesheet instead of adding a parallel styling system. [Source: `src/styles/global.css`:1; Tailwind CSS v4 upgrade guidance, 2026-03-10]
- Astro 5 remains the stable major line here; avoid deprecated content-loading patterns and keep the hero static by default unless a specific interaction clearly earns client-side code. [Source: Astro 5 upgrade guidance, 2026-03-10]
- If a portrait asset is optimized through Astro image tooling, reserve dimensions and keep layout stable. If a simple static passthrough asset is sufficient, keep it in an architecture-approved asset location and avoid unnecessary complexity. [Source: `_bmad-output/planning-artifacts/architecture.md`:815; Astro images guidance, 2026-03-10]
- If a real portrait asset is not available yet, use a bounded fallback that still satisfies AC 2, such as trust tags plus a clearly labeled professional signal; do not block the story on speculative image sourcing. If a portrait is present, alt text should identify Chris meaningfully rather than restating decorative details. [Source: `_bmad-output/planning-artifacts/epics.md`:266, `_bmad-output/planning-artifacts/prd.md`:101, `_bmad-output/planning-artifacts/ux-design-specification.md`:322, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]
- Favor CSS-based motion using `transform` and `opacity` plus `prefers-reduced-motion`. Avoid client-heavy animation libraries for this story. [Source: MDN `prefers-reduced-motion`, 2026-03-10; web.dev animation guidance, 2026-03-10]

### File Structure Requirements

- Expected route/layout/style touchpoints: `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, and `src/styles/global.css`. [Source: current repo structure]
- Expected new content/component paths for this story: `src/content/pages/home.md` and `src/components/sections/HeroSection.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:825, `_bmad-output/planning-artifacts/architecture.md`:826]
- Keep content schemas in `src/content/config.ts`; keep authored page content under `src/content/pages/`; keep larger editorial UI under `src/components/sections/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:471, `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:498]
- Place any static passthrough hero asset in `public/` only when direct file serving is the right tradeoff. Do not create a second ad hoc asset taxonomy or commit generated output under `dist/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:475, `_bmad-output/planning-artifacts/architecture.md`:815]
- Do not create unrelated folders such as `src/stores`, `src/db`, or feature-expansion scaffolding while implementing the hero. [Source: `tests/story-1-1-foundation.test.mjs`:65, `tests/story-1-1-foundation.test.mjs`:188]

### Testing Requirements

- Reuse the existing verification contract: `npm run check`, `npm test`, and `npm run build` remain the required local gates and CI expectations. [Source: `package.json`:7, `.github/workflows/ci.yml`:26]
- Extend the current lightweight Node test suite rather than introducing a new test framework just for the hero. Existing tests already validate the built homepage contract and should be updated from baseline placeholder assertions to Story 1.3 expectations. [Source: `tests/story-1-1-foundation.test.mjs`:201]
- Verify the built output still produces `dist/index.html` and that the homepage title and hero content survive the production build. [Source: `tests/story-1-1-foundation.test.mjs`:198, `tests/story-1-1-foundation.test.mjs`:204]
- Keep accessibility and performance posture intact: no unnecessary hydration, stable layout, readable heading structure, visible focus states, and motion that does not interfere with comprehension. [Source: `_bmad-output/planning-artifacts/epics.md`:112, `_bmad-output/planning-artifacts/prd.md`:281, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]
- Add a compact acceptance-criteria-aligned contract to tests and/or verification review: built homepage output should include the final title, a single clear `h1`, role/focus copy, visible trust-cue text or portrait markup, a visible CTA/pathway label, no baseline placeholder copy, and no CTA href that points to a non-built route. [Source: `tests/story-1-1-foundation.test.mjs`:201, `_bmad-output/planning-artifacts/epics.md`:258, `_bmad-output/planning-artifacts/epics.md`:268]
- If the CTA targets a same-page section, verify that the matching section ID is rendered in the built homepage and that the target section contributes real evaluative value (for example a trust summary or pathway preview), not an empty compliance-only placeholder. [Source: `_bmad-output/planning-artifacts/epics.md`:268, `_bmad-output/planning-artifacts/ux-design-specification.md`:339]
- Validate keyboard/focus basics on the implemented hero surface: interactive targets should remain reachable, focus-visible, and at least `44x44px` where applicable. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:464, `_bmad-output/planning-artifacts/ux-design-specification.md`:476]
- Review final diffs for scope drift so Story 1.3 does not quietly absorb Story 1.4 navigation work, Story 1.5 responsive overhauls beyond the hero, Story 1.6 accessibility baselines beyond the implemented surface, or later page/route creation. [Source: `_bmad-output/planning-artifacts/epics.md`:278]

### Previous Story Intelligence

- Story 1.2 left the repo with a validated static-first CI/build baseline. Build on it; do not redefine project setup, deployment shape, or package scripts while implementing the homepage hero. [Source: `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`:16, `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`:154]
- The prior story explicitly reinforced that `src/content/config.ts` is the canonical schema boundary. Do not regress to duplicate schema declarations or config ownership drift. [Source: `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`:101]
- Existing verification is intentionally simple and build-oriented. Follow that pattern for Story 1.3 rather than adding heavy browser automation unless absolutely necessary. [Source: `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`:91]
- The repo already has a clean base layout, global stylesheet import, and minimal homepage placeholder. Replace the placeholder with the real hero instead of restructuring the app shell. [Source: `src/layouts/BaseLayout.astro`:2, `src/pages/index.astro`:5]

### Git Intelligence Summary

- Recent commit style is short and imperative, for example: `Complete Story 1.2 CI/CD deployment baseline` and `Fix Story 1.2 review regressions`. Follow that terse style if this story is later committed. [Source: `git log -5 --oneline`, 2026-03-10]
- Existing source footprint for the homepage is intentionally small (`src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`). This story should extend those foundations plus new content/component files rather than scattering hero logic across the repo. [Source: current repo structure]
- The repository currently contains only baseline public app files under `src/`, so new reusable UI introduced here should set the pattern for later Epic 1 stories. Keep names, folder placement, and scope disciplined. [Source: current repo structure]

### Latest Tech Information

- Astro `5.18.0` is the current stable repo baseline. Astro 5 is compatible with Vite 6, and static-first server-rendered pages remain the preferred default for this hero work. [Source: `package.json`:16; Astro 5 upgrade guidance, 2026-03-10]
- Tailwind CSS `4.2.1` is the current stable repo baseline. Tailwind 4 is a true upgrade path with modern browser assumptions, so keep implementation aligned with the existing v4 setup rather than falling back to legacy config patterns. [Source: `package.json`:15, `package.json`:17; Tailwind CSS v4 guidance, 2026-03-10]
- For hero motion, current best practice remains CSS-first enhancement with `transform`/`opacity`, short durations, and `prefers-reduced-motion`; avoid making entry animation or scroll effects part of the information architecture. [Source: MDN `prefers-reduced-motion`, 2026-03-10; web.dev animation guidance, 2026-03-10]
- Treat the hero image or portrait as a likely LCP candidate: reserve dimensions, avoid layout shift, and keep the DOM/CSS above the fold simple. [Source: Astro images guidance, 2026-03-10]

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, architecture, UX specification, epics file, sprint tracker, previous story artifact, and current repo state as its context set.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The repo already contains a functioning Astro baseline with CI/deploy guardrails, so Story 1.3 should add homepage content/components into that structure instead of behaving like a fresh scaffold.
- `src/content/pages/` currently exists but has no real content entries yet, which makes `home.md` the natural first authored page-content file.
- `src/components/` is present but effectively empty, so introducing `src/components/sections/HeroSection.astro` now is aligned with the architecture and sets up later Epic 1 section work cleanly.

### Anti-Pattern Prevention

- Do not leave the hero as a growing one-off blob inside `src/pages/index.astro`.
- Do not hardcode long-term homepage identity content directly in the route when the architecture expects source-controlled content.
- Do not query content collections directly from reusable section components; pass structured content into them.
- Do not create dead links to future `Projects`, `Resume`, or `Contact` destinations that do not exist yet.
- Do not add a meaningless below-the-fold section just to satisfy the CTA requirement; any same-page target must genuinely help the visitor continue evaluation.
- Do not introduce hydration-heavy animation, client stores, runtime APIs, analytics, CMS wiring, or other nonessential complexity.
- Do not use generic template copy, jargon-heavy messaging, or a bland all-default visual treatment that ignores the editorial hero direction.
- Do not make the next step, trust cue, or key message hover-only, motion-dependent, or visually unstable.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 1 and Story 1.3 requirements and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - product goals, MVP scope, first-screen trust path, and accessibility target
- `_bmad-output/planning-artifacts/architecture.md` - route-thin structure, content ownership, section/component boundaries, and file mapping
- `_bmad-output/planning-artifacts/ux-design-specification.md` - editorial hero direction, component strategy, responsive behavior, and accessibility rules
- `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md` - previous-story learnings and baseline constraints
- `tests/story-1-1-foundation.test.mjs` - current build-output guardrail tests that should be extended for Story 1.3
- `package.json` and `.github/workflows/ci.yml` - canonical validation/build commands that must keep passing

### Definition of Done

- Homepage hero renders Chris's identity, role/focus, concise introduction, and at least one visible trust cue above the fold on supported desktop and mobile widths.
- The hero provides at least one obvious next-step affordance that is visible without hover and points either to an implemented same-page anchor section or an existing built route.
- Visual direction is recognizably editorial and warm rather than starter-template generic, while motion stays optional and non-essential.
- Homepage content is sourced through the canonical content layer and route/component structure rather than hardcoded route-only implementation.
- `npm run check`, `npm test`, and `npm run build` pass, and the built `dist/index.html` reflects the new homepage contract instead of baseline placeholder copy.
- The hero content contract is explicit in `src/content/config.ts` and `src/content/pages/home.md`, with no duplicate schema/config ownership.
- No runtime API, global store, database, auth, analytics, CMS, blog/writing scope, or unrelated later-story functionality is introduced.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `1.3` and resolved to `1-3-home-page-hero-and-identity-introduction`.
- Workflow resources loaded: create-story `workflow.yaml`, `instructions.xml`, `template.md`, and `checklist.md`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and previous story `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`.
- Repo state reviewed through `git log -5 --oneline`, `git status --short`, `package.json`, current `src/` files, and CI/deploy workflow files.
- Additional research gathered for Astro 5, Tailwind 4, and lightweight hero-motion best practices.
- Advanced elicitation was run on the `## Story` section, and the accepted refinement updated the user-story wording.
- Story moved from `ready-for-dev` to `in-progress` in `_bmad-output/implementation-artifacts/sprint-status.yaml` before implementation and to `review` after validations passed.
- Red phase: added failing Node-based Story 1.3 contract tests for schema/content ownership and built homepage output before implementing hero changes.
- Green/refactor phase: implemented content-driven homepage loading, reusable `HeroSection.astro` and `SocialProofSection.astro`, warm editorial styling, and updated baseline tests for the new homepage contract.
- Validation phase: `npm run check`, `npm test`, and `npm run build` all passed after serializing the test runner's build execution to avoid concurrent `dist/` races.

### Implementation Plan

- Model homepage identity content in `src/content/config.ts` and `src/content/pages/home.md`, keeping the route thin and the content collection canonical.
- Compose the homepage from reusable section components so `src/pages/index.astro` only loads content and passes structured props.
- Deliver the visible next step as an in-page trust summary section reached from the hero CTA, keeping the experience static-first and mobile-visible by default.
- Extend the existing Node-based build contract tests to cover the new hero, CTA target, and regression protection against placeholder copy.

### Completion Notes List

- Story context file created for Story 1.3 with acceptance criteria, implementation tasks, architectural guardrails, previous-story intelligence, testing expectations, and anti-pattern prevention.
- Story guidance explicitly directs the future implementation toward `src/content/pages/home.md`, `src/components/sections/HeroSection.astro`, route-thin `src/pages/index.astro`, and canonical `src/content/config.ts` ownership.
- Story guidance preserves the static-first baseline and prevents premature expansion into navigation, resume, projects, contact workflows, blog infrastructure, analytics, CMS, or runtime APIs.
- This create-story execution did not implement product code; it prepared the comprehensive story context needed for `dev-story`.
- Implemented a content-driven homepage hero sourced from `src/content/pages/home.md` with schema validation for trust tags, CTA hrefs, and paired portrait metadata in `src/content/config.ts`.
- Added reusable `HeroSection.astro` and `SocialProofSection.astro` components, keeping `src/pages/index.astro` route-thin while introducing a visible same-page evaluation pathway via `#proof`.
- Reworked `src/styles/global.css` and `src/layouts/BaseLayout.astro` to support the warm editorial direction, accessible focus states, and descriptive metadata without introducing hydration or global client state.
- Extended Node-based regression coverage with `tests/story-1-3-homepage-hero.test.mjs`, updated existing homepage assertions, serialized test execution for build stability, and confirmed `npm run check`, `npm test`, and `npm run build` all pass.

### File List

- `_bmad-output/implementation-artifacts/1-3-home-page-hero-and-identity-introduction.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `package.json`
- `src/components/sections/HeroSection.astro`
- `src/components/sections/SocialProofSection.astro`
- `src/content/config.ts`
- `src/content/pages/home.md`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `tests/story-1-1-foundation.test.mjs`
- `tests/story-1-3-homepage-hero.test.mjs`

## Senior Developer Review (AI)

- Outcome: Approve
- Reviewer: Chris
- Date: 2026-03-10
- Findings addressed:
  - Tightened `primaryCtaHref` validation in `src/content/config.ts` so homepage CTA values must be a same-page anchor or an existing built route.
  - Stabilized Node build validation by removing unnecessary `dist/` deletion before repeated Astro builds in `tests/story-1-1-foundation.test.mjs`.
  - Extended `tests/story-1-3-homepage-hero.test.mjs` with negative contract coverage for invalid CTA routes and mismatched portrait metadata.
- Validation rerun after fixes:
  - `npm run check` ✅
  - `npm test` ✅
  - `npm run build` ✅

## Change Log

- 2026-03-10: Implemented Story 1.3 by moving homepage identity content into the Astro content layer, adding reusable hero and proof sections, refreshing editorial styling, and expanding regression coverage for the new homepage contract.
- 2026-03-10: Fixed code review findings by tightening CTA route validation, stabilizing repeated build tests, and adding negative schema contract coverage.
