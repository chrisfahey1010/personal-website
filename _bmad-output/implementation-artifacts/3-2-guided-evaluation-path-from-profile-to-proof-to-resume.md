# Story 3.2: Guided Evaluation Path from Profile to Proof to Resume

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a hiring audience member,
I want the site to guide me through the core evaluation journey,
so that I can move from understanding Chris to reviewing proof and qualifications in one visit.

## Acceptance Criteria

1. Given a visitor starts on the home page or another primary entry point, when they scan the site for next steps, then the experience presents a clear progression toward projects and resume review, and that progression remains understandable on desktop and mobile.
2. Given a visitor has completed one stage of evaluation such as reading the introduction or reviewing projects, when they are ready to continue, then the page provides an obvious next action toward the next evaluative step, and the user never has to infer the intended path from layout alone.
3. Given a visitor completes the full evaluation journey in one session, when they move across profile, projects, and resume destinations, then the flow feels cohesive rather than fragmented, and each stage reinforces the site's professional credibility.

## Tasks / Subtasks

- [x] Make the homepage handoff from profile understanding into project proof explicit (AC: 1, 2)
  - [x] Update the homepage CTA/content seam so the first-screen or immediate follow-on action points clearly into `/projects/` instead of stopping at a same-page proof anchor alone. Keep the route thin and use the existing content-backed homepage contract rather than hardcoding a one-off path in markup. [Source: `_bmad-output/planning-artifacts/epics.md`:580, `src/pages/index.astro`:30, `src/content/pages/home.md`:11]
  - [x] Preserve the current trust-first homepage framing while clarifying why the next stop is project proof, so evaluators understand the intended progression without needing to infer it from navigation alone. [Source: `_bmad-output/planning-artifacts/prd.md`:84, `_bmad-output/planning-artifacts/ux-design-specification.md`:301, `src/components/sections/HeroSection.astro`]
  - [x] Keep the CTA/link behavior standard and static-first: normal anchors, real routes, no client-side interception, no wizard/progress runtime. [Source: `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:545, `tests/story-1-3-homepage-hero.test.mjs`:102]

- [x] Make the projects index a real guided midpoint instead of only a browse surface (AC: 1, 2, 3)
  - [x] Add explicit onward guidance on `/projects/` so visitors who scan the list without opening a detail page still get a clear next action toward `/resume/`. [Source: `_bmad-output/planning-artifacts/epics.md`:585, `src/pages/projects/index.astro`:32, `tests/story-2-1-projects-index.test.mjs`:97]
  - [x] Keep project detail pages aligned with the same journey language so the proof -> resume -> contact handoff stays consistent whether the visitor comes from the index or a specific project. [Source: `_bmad-output/planning-artifacts/epics.md`:590, `src/components/projects/ProjectDetailPage.astro`:142, `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:61]
  - [x] Explain the value of the next step in page copy instead of presenting resume access as an isolated utility link. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:339, `_bmad-output/planning-artifacts/prd.md`:72]

- [x] Preserve a cohesive route-to-route evaluation journey across home, projects, resume, and contact (AC: 2, 3)
  - [x] Ensure the homepage, projects index, project detail, and resume route all expose obvious next-step actions with consistent tone and action hierarchy. [Source: `_bmad-output/planning-artifacts/epics.md`:586, `src/pages/index.astro`:31, `src/pages/projects/index.astro`:14, `src/pages/resume.astro`:102]
  - [x] Keep contact as the terminal next step in the journey without overbuilding Story 3.3 inside Story 3.2; the goal here is guided progression into existing destinations, not implementing richer contact mechanics yet. [Source: `_bmad-output/planning-artifacts/epics.md`:595, `src/pages/contact.astro`:5]
  - [x] Preserve global navigation as orientation support, but reduce dependence on nav alone by adding page-level guidance where users naturally finish each stage. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:417, `src/config/navigation.ts`:6]

- [x] Keep the implementation static-first, accessible, and consistent across devices (AC: 1, 2, 3)
  - [x] Maintain one page-level `h1`, semantic landmarks, keyboard-reachable next-step controls, visible focus states, and no meaning conveyed only by placement, motion, or color. [Source: `_bmad-output/planning-artifacts/prd.md`:279, `_bmad-output/planning-artifacts/epics.md`:113, `tests/story-1-6-accessibility.test.mjs`]
  - [x] Make the guided progression understandable on mobile, tablet, and desktop without hover assumptions or cramped CTA placement. [Source: `_bmad-output/planning-artifacts/epics.md`:583, `_bmad-output/planning-artifacts/ux-design-specification.md`:447, `tests/story-1-5-responsive-layout.test.mjs`]
  - [x] Keep motion optional and non-essential; any editorial reveal or pacing treatment must not displace controls or become the thing that communicates the journey. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:203, `_bmad-output/planning-artifacts/architecture.md`:297]

- [x] Add regression coverage for the full evaluation path (AC: 1, 2, 3)
  - [x] Extend homepage tests to verify the authored CTA and built output now hand off explicitly into the evaluation journey, not just an internal proof anchor unless both are intentionally preserved. [Source: `tests/story-1-3-homepage-hero.test.mjs`:34]
  - [x] Extend projects-index and/or resume tests so built HTML proves the route-level progression from profile -> projects -> resume -> contact remains visible and truthful. [Source: `tests/story-2-1-projects-index.test.mjs`:82, `tests/story-3-1-resume-access.test.mjs`:88]
  - [x] Prefer build-output Node tests that inspect `dist/` artifacts over new browser-runtime infrastructure, and verify route links are real built routes. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:98, `tests/story-1-4-navigation.test.mjs`]
  - [x] Validate the repo with `npm run check`, `npm test`, and `npm run build`, then manually click through the evaluation path on mobile and desktop widths to confirm the story improves guidance instead of only satisfying text assertions. [Source: `package.json`, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

## Dev Notes

### Developer Context

- Story 3.2 starts from a partially complete journey, not a blank slate. The repo already supports a strong `projects -> resume -> contact` handoff, but the `home/profile -> projects` transition is still weak and too dependent on visitors inferring intent from global navigation. [Source: `_bmad-output/planning-artifacts/epics.md`:570, `src/content/pages/home.md`:11, `src/pages/projects/index.astro`:37, `src/pages/resume.astro`:102]
- Story 3.1 already made `/resume/` a real evaluation-stage handoff with fallback-safe resume access and onward cues. Story 3.2 should build on that work rather than redesigning the latter half of the journey. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:51, `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:183]
- The current homepage hero is content-backed and trustworthy, but its primary CTA still points to `#proof`, which keeps evaluators on the same page instead of clearly moving them into the project-proof stage that Epic 3 expects. [Source: `src/content/pages/home.md`:11, `src/pages/index.astro`:32]
- The projects index already frames itself as a proof path, but visitors who do not open a detail page do not currently get an equally explicit path onward to `/resume/`. That is the main route-level gap this story should close. [Source: `src/pages/projects/index.astro`:17, `src/components/projects/ProjectDetailPage.astro`:142]

### Technical Requirements

- Keep the site static-first: no database, no auth, no public app API, no client-router orchestration, and no step-tracker state for the evaluation journey. This story is about copy, links, route composition, and light shared structure. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:240, `_bmad-output/planning-artifacts/architecture.md`:545]
- The journey must be legible through explicit page-level actions. Users should not have to infer the intended path from layout alone, clever phrasing, or nav persistence. [Source: `_bmad-output/planning-artifacts/epics.md`:587, `_bmad-output/planning-artifacts/ux-design-specification.md`:301]
- Preserve professional credibility through cohesion: each stage should feel like a continuation of the same evaluation conversation, not a disconnected page with a generic CTA bolted on. [Source: `_bmad-output/planning-artifacts/epics.md`:592, `_bmad-output/planning-artifacts/prd.md`:47]
- Keep contact scope bounded. Story 3.2 should guide visitors into `/contact/`, but should not add advanced outreach workflows or solve Story 3.3/3.4 preemptively. [Source: `_bmad-output/planning-artifacts/prd.md`:137, `_bmad-output/planning-artifacts/epics.md`:595]

### Architecture Compliance

- Keep route files thin. Continue using route-level composition and existing components/helpers rather than embedding complex journey logic directly into page files. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/index.astro`:30, `src/pages/projects/index.astro`:9]
- Reuse the established shared shell under `BaseLayout.astro` and the canonical route set in `src/config/navigation.ts`. Do not create a second information architecture or custom route registry for this story. [Source: `_bmad-output/planning-artifacts/architecture.md`:807, `src/config/navigation.ts`:6]
- If shared journey presentation is needed, prefer a small reusable section/component seam over duplicating route-local CTA blocks with drifting language. [Source: `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:482, `src/components/projects/ProjectStructureSummary.astro`]
- Preserve hydration-by-exception. Guided progression should be delivered with static HTML/CSS unless a truly necessary interaction emerges, which this story does not currently justify. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553]

### Library / Framework Requirements

- Implement against the current validated stack in the repo: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 3.2 does not justify a framework upgrade. [Source: `package.json`]
- Astro content collections remain the right fit for the homepage and project content seams that define this journey. Keep authored route framing in content/schema-backed structures where they already exist, and avoid inventing a parallel manual data path unless it clearly reduces duplication. [Source: Astro content collections docs reviewed 2026-03-15, `src/content/pages/home.md`:1, `_bmad-output/planning-artifacts/architecture.md`:159]
- Astro still recommends `public/` for static assets that are not processed by Astro, so any journey guidance should continue linking to built routes and existing public assets rather than trying to model PDFs or other passthrough files as page content. [Source: Astro content collections docs reviewed 2026-03-15, `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:74]
- Cloudflare Pages continues to support Git-driven static builds with `npm run build` and `dist` output, which matches the current route-based evaluation journey. No hosting change is needed for this story. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-15]

### File Structure Requirements

- Primary homepage touchpoints: `src/pages/index.astro`, `src/content/pages/home.md`, and any existing hero/proof section components that render the evaluation-start messaging. [Source: `src/pages/index.astro`:1]
- Primary proof-stage touchpoints: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectIndexList.astro`, and `src/components/projects/ProjectDetailPage.astro`. [Source: `src/pages/projects/index.astro`:1, `src/components/projects/ProjectDetailPage.astro`:27]
- Existing handoff destination touchpoints: `src/pages/resume.astro` and `src/pages/contact.astro`. Keep these as destinations in the route graph rather than inventing intermediate pseudo-steps. [Source: `src/pages/resume.astro`:36, `src/pages/contact.astro`:5]
- Shared shell/navigation touchpoints: `src/layouts/BaseLayout.astro`, `src/components/navigation/`, and `src/config/navigation.ts`. [Source: `src/config/navigation.ts`:6]
- Testing touchpoints: extend the current Node-based `tests/` files around homepage hero, navigation validity, projects index/detail, and resume continuity; add a dedicated Story 3.2 regression test only if that is cleaner than overloading existing files. [Source: `tests/story-1-3-homepage-hero.test.mjs`:34, `tests/story-2-1-projects-index.test.mjs`:60, `tests/story-3-1-resume-access.test.mjs`:88]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`]
- Verify the homepage exposes a clear built next step into the evaluation journey and that any authored CTA href continues to pass content validation for same-page anchors or built routes. [Source: `tests/story-1-3-homepage-hero.test.mjs`:45]
- Verify `/projects/` built output includes explicit guidance toward deeper proof and onward resume review, not just project-detail links plus passive nav visibility. [Source: `src/pages/projects/index.astro`:35]
- Verify project detail pages still expose `Continue to resume` and `Start a conversation`, and that `/resume/` still routes onward to `/contact/` after Story 3.2 changes. [Source: `tests/story-2-2-project-detail-pages.test.mjs`:87, `tests/story-3-1-resume-access.test.mjs`:95]
- Verify all new journey links remain standard anchors to real built routes and that the implementation stays hydration-free for the core evaluation path. [Source: `tests/story-1-4-navigation.test.mjs`, `tests/story-2-1-projects-index.test.mjs`:99]
- Manual QA should click through the intended path from homepage to projects to resume to contact on both mobile and desktop widths to catch awkward phrasing, weak hierarchy, or dead-end handoffs that static assertions may miss. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

### Previous Story Intelligence

- Story 3.1 established the exact style to follow here: narrow, story-scoped changes around existing routes, helpers, and tests instead of broad architecture expansion. Story 3.2 should stay equally surgical. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:96]
- The previous story identified that the actual repo shape matters more than the architecture document's aspirational component tree. Follow the real codebase (`BaseLayout`, existing route pages, current tests) rather than building placeholder systems to match planning artifacts on paper. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:117]
- Existing test strategy already protects navigation, accessibility, responsive shells, and resume continuity through build-output assertions. Reuse that style for Story 3.2 instead of introducing browser automation unless a real gap appears. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:98]
- Story 3.1 left `/contact/` intentionally lightweight. Treat that as a boundary, not an omission to fix opportunistically here. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:120]

### Git Intelligence Summary

- Recent repo work is story-sized and sequential: CI/deploy hardening, project-storytelling extension seams, and resume-access review fixes. Story 3.2 should fit that same pattern with focused changes to route guidance and regression coverage. [Source: commits `2d7702e`, `a92f7c1`, `e37d23d`, `e7ce6e7`, `2a328b6` reviewed 2026-03-15]
- The working tree was clean during create-story analysis, so this story can assume the current repo reflects accepted Epic 1, Epic 2, and Story 3.1 behavior without unrelated local churn to work around. [Source: `git status --short` reviewed 2026-03-15]
- Existing commit history suggests changes are typically validated before landing. Story 3.2 should likewise plan for passing `check`, tests, and build instead of leaving verification vague. [Source: commits reviewed 2026-03-15]

### Latest Tech Information

- Astro's latest stable npm release is `6.0.4`, but this repo is intentionally pinned to `astro@^5.18.0`. Story 3.2 should use already-proven Astro 5 patterns and avoid introducing upgrade work. [Source: npm `astro` package page reviewed 2026-03-15, `package.json`]
- Current Astro docs still position build-time content collections as the best fit for content-heavy, mostly static sites, and explicitly note that static assets such as PDFs belong in `public/`. That reinforces the current content-first plus public-asset approach used by this repo. [Source: Astro content collections docs reviewed 2026-03-15]
- Cloudflare Pages still documents the standard Astro static deployment path as `npm run build` with `dist` output, so the route-based evaluation journey remains aligned with the current hosting model. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-15]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story file, current repo implementation, recent git history, and current framework/platform documentation.

### Story Completion Status

- Status: `review`
- Completion note: Homepage, projects, resume, and contact now expose a cohesive evaluation path backed by route-level guidance, shared static-first CTAs, and passing regression coverage.

### Project Structure Notes

- The actual repo already has the key route shells needed for this story: `index`, `projects`, `projects/[slug]`, `resume`, and `contact`. Story 3.2 should strengthen their connective tissue, not redefine their existence. [Source: `src/pages/`]
- The homepage is content-backed through `src/content/pages/home.md`, while projects and resume use helper/component composition. That mixed pattern is already real and acceptable; avoid forcing every route into one new abstraction just for conceptual purity. [Source: `src/pages/index.astro`:2, `src/pages/projects/index.astro`:2, `src/pages/resume.astro`:2]
- Global navigation is already canonical in `src/config/navigation.ts`; page-level journey guidance should complement it, not fork it. [Source: `src/config/navigation.ts`:6]
- The contact route exists but remains intentionally simple. Story 3.2 should guide visitors there without assuming richer contact implementation already exists. [Source: `src/pages/contact.astro`:5]

### Anti-Pattern Prevention

- Do not add hydration, client-side state, step progress bars, wizards, or intercepted navigation to represent the evaluation journey.
- Do not rely on global nav alone as the only expression of the intended profile -> proof -> resume path.
- Do not scatter hardcoded internal route strings across multiple files when existing config/content seams can centralize them.
- Do not overbuild Story 3.3 or Story 3.4 while working on Story 3.2.
- Do not regress single-`h1`, skip-link, `aria-current`, real-anchor, accessibility, or responsive-shell behavior already protected by current tests.
- Do not make motion, color, or editorial flourish the thing that explains the next step.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 3.2 requirements, acceptance criteria, and Epic 3 context
- `_bmad-output/planning-artifacts/prd.md` - evaluation journey goals, trust requirements, and MVP scope boundaries
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, route-thin rules, and hydration-by-exception guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm guidance, navigation stability, and responsive/accessibility expectations
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md` - previous-story learnings and current Epic 3 implementation baseline
- `src/pages/index.astro`, `src/content/pages/home.md`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, `src/pages/contact.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/config/navigation.ts`, and current `tests/` files - current implementation baseline for Story 3.2
- Astro content collections docs, npm `astro` package page, and Cloudflare Pages Astro deployment guide reviewed on 2026-03-15

### Definition of Done

- Visitors can move from homepage/profile context into project proof without needing to infer the intended next step.
- `/projects/` provides an obvious onward handoff to `/resume/` even when visitors only scan the index.
- The evaluation path across home, projects, resume, and contact feels cohesive rather than fragmented.
- The implementation remains static-first, accessible, responsive, and consistent with the existing shared shell.
- Regression coverage proves the journey through built output, and `npm run check`, `npm test`, and `npm run build` pass.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/dev-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `3.2` and resolved to `3-2-guided-evaluation-path-from-profile-to-proof-to-resume` from `_bmad-output/planning-artifacts/epics.md` and `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Previous-story intelligence reviewed from `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`.
- Current repo implementation reviewed across homepage, projects, resume, contact, navigation, and existing Node-based regression tests.
- Repo exploration for Story 3.2 current-state analysis was delegated to an explore subagent and incorporated into this story context.
- Git intelligence gathered from `git log --oneline -5` and `git status --short`.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.

### Implementation Plan

- Tighten the homepage CTA/content handoff so profile understanding naturally moves into project proof.
- Add explicit route-level onward guidance on the projects index while preserving the stronger detail-page handoff already in place.
- Keep resume and contact as existing destinations in the journey, refining continuity rather than redesigning those pages.
- Extend the existing build-output test suite to prove the full profile -> proof -> resume -> contact progression remains visible and static-first.
- Reuse a small shared journey CTA component so projects index and detail pages keep the same tone and action hierarchy without duplicating route-local markup.

### Completion Notes List

- Updated the homepage content contract to send the primary CTA to `/projects/` and added supporting hero copy that explains why project proof is the next evaluation step.
- Added a reusable journey-next-step section and used it on the projects index and project detail pages so resume/contact handoffs stay explicit and tonally consistent.
- Tightened the resume and contact copy so the proof -> resume -> contact progression reads like one continuous evaluation path without adding client-side flow logic.
- Expanded regression coverage across homepage, responsive, projects, resume, and a dedicated Story 3.2 build-output test, then validated with `npm run check`, `npm test`, and `npm run build`.

### File List

- `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/journey/JourneyNextStep.astro`
- `src/components/projects/ProjectDetailPage.astro`
- `src/components/sections/HeroSection.astro`
- `src/content/pages/home.md`
- `src/pages/contact.astro`
- `src/pages/projects/index.astro`
- `src/pages/resume.astro`
- `src/styles/global.css`
- `tests/story-1-1-foundation.test.mjs`
- `tests/story-1-3-homepage-hero.test.mjs`
- `tests/story-1-5-responsive-layout.test.mjs`
- `tests/story-2-1-projects-index.test.mjs`
- `tests/story-2-2-project-detail-pages.test.mjs`
- `tests/story-3-2-guided-evaluation-path.test.mjs`

## Change Log

- 2026-03-15: Implemented Story 3.2 route-to-route evaluation guidance across home, projects, resume, and contact; added shared journey CTA presentation and regression coverage for the full profile -> proof -> resume -> contact path.
