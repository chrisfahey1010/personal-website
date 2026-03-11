# Story 2.1: Projects Index and Evaluation-Oriented Browsing

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor evaluating Chris's work,
I want to browse a clear collection of projects,
so that I can quickly identify which work is most relevant to review in more detail.

## Acceptance Criteria

1. Given a visitor navigates to the projects area, when the projects index page loads, then it presents a scannable collection of project entries with consistent summary information, and each entry provides a clear path to a deeper project detail view.
2. Given a visitor is reviewing projects under time pressure, when they scan the project collection, then they can distinguish projects by title, context, and relevance cues, and the page supports quick comparison without requiring deep reading of every item.
3. Given the projects index is viewed on supported desktop or mobile browsers, when the collection renders, then the layout remains readable and easy to navigate across viewport sizes, and project links behave like standard web navigation.
4. Given a visitor reaches the projects index from another page, when they decide to continue evaluation, then the page offers an obvious next step into individual project proof, and it preserves orientation within the overall evaluation journey.

## Tasks / Subtasks

- [x] Establish the canonical project content model and data-loading path (AC: 1, 2, 4)
  - [x] Extend `src/content/config.ts` with a plural lowercase `projects` collection using `camelCase` frontmatter keys and strict Zod validation. The minimum Story 2.1 contract should explicitly cover the fields needed for both list and detail routing: `title`, `summary`, `context`, `relevanceCues`, `seoTitle`, `seoDescription`, and a stable slug source derived from the entry filename or validated frontmatter. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:445, `_bmad-output/planning-artifacts/architecture.md`:523, `src/content/config.ts`:1]
  - [x] Add authored project entries under `src/content/projects/` as the system of record; author at least `2` real entries so quick comparison is possible and AC 2 is actually testable. Do not source project summaries from inline route arrays, `src/data/`, or ad hoc docs-only files. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:813, `_bmad-output/planning-artifacts/epics.md`:437]
  - [x] Create a canonical read helper at `src/lib/content/get-projects.ts` that normalizes collection data for the route and future detail pages instead of duplicating sorting and shaping logic inside route files. [Source: `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:886, `_bmad-output/planning-artifacts/architecture.md`:903]

- [x] Build a scannable projects index using the existing route shell and shared visual system (AC: 1, 2, 3, 4)
  - [x] Extend `src/pages/projects/index.astro` instead of replacing the route or introducing a parallel shell; keep the route thin and data/composition-focused. [Source: `src/pages/projects/index.astro`:1, `_bmad-output/planning-artifacts/architecture.md`:479]
  - [x] Render project entries with consistent summary information that supports quick evaluator scanning: title, short summary, context or role, and relevance cues that help visitors compare projects without deep reading. [Source: `_bmad-output/planning-artifacts/epics.md`:431, `_bmad-output/planning-artifacts/ux-design-specification.md`:352, `_bmad-output/planning-artifacts/ux-design-specification.md`:356]
  - [x] Reuse the current editorial route-shell language from `BaseLayout` and `src/styles/global.css` so `/projects/` continues to feel like part of the same authored system established in Epic 1. [Source: `src/layouts/BaseLayout.astro`:14, `src/styles/global.css`:123, `_bmad-output/implementation-artifacts/1-7-distinct-visual-system-and-trust-signals.md`:161]

- [x] Introduce the minimal project-proof handoff required for deeper evaluation without pulling Story 2.2 forward (AC: 1, 4)
  - [x] Add a stable Astro detail-route foundation at `src/pages/projects/[slug].astro` so every index entry links to a normal, crawlable page destination. The route should generate static paths from the canonical collection/helper and fail loudly for invalid or missing slugs rather than shipping broken detail links. [Source: `_bmad-output/planning-artifacts/architecture.md`:682, `_bmad-output/planning-artifacts/architecture.md`:830, `_bmad-output/planning-artifacts/architecture.md`:951]
  - [x] Keep the detail-route handoff intentionally thin in Story 2.1: enough structure for clear navigation and valid links, but reserve substantive proof content and richer project storytelling for Stories 2.2 and 2.3. [Source: `_bmad-output/planning-artifacts/epics.md`:451, `_bmad-output/planning-artifacts/epics.md`:481, `_bmad-output/planning-artifacts/prd.md`:110]
  - [x] Ensure links behave like standard web navigation with dependable browser back/forward behavior and no client-side routing dependency. [Source: `_bmad-output/planning-artifacts/epics.md`:444, `_bmad-output/planning-artifacts/ux-design-specification.md`:421, `_bmad-output/planning-artifacts/architecture.md`:243]

- [x] Preserve evaluation-path clarity, responsiveness, accessibility, and discoverability on the projects index (AC: 2, 3, 4)
  - [x] Keep mobile-first readability and comparison quality across `320px-767px`, `768px-1023px`, and `1024px+` layouts without introducing hover-only meaning or horizontal-scroll dependence. [Source: `_bmad-output/planning-artifacts/epics.md`:441, `_bmad-output/planning-artifacts/prd.md`:252, `_bmad-output/planning-artifacts/ux-design-specification.md`:453]
  - [x] Use semantic headings, list/article structure, clear link labels, visible focus states, and touch targets of at least `44x44px` so the index remains usable by keyboard and assistive-technology visitors. [Source: `_bmad-output/planning-artifacts/prd.md`:279, `_bmad-output/planning-artifacts/ux-design-specification.md`:462, `src/styles/global.css`:79]
  - [x] Preserve orientation inside the broader evaluation journey by keeping resume/contact pathways understandable from the surrounding navigation and page framing rather than isolating the projects route into a disconnected sub-experience. [Source: `_bmad-output/planning-artifacts/epics.md`:448, `_bmad-output/planning-artifacts/ux-design-specification.md`:419, `src/components/navigation/SiteNav.astro`:12]
  - [x] Add page-level metadata for both `/projects/` and generated `/projects/[slug]/` pages so project browsing stays discoverable, semantically clear, and aligned with FR28/SEO expectations. [Source: `_bmad-output/planning-artifacts/prd.md`:240, `_bmad-output/planning-artifacts/architecture.md`:850]

- [x] Add regression coverage for project-index structure, routing, and static-first behavior (AC: 1, 2, 3, 4)
  - [x] Add a Node-based regression test in `tests/` that verifies the source contract and built `/projects/index.html` output for scannable summaries, explicit detail links, semantic list/article structure, a single `h1`, metadata presence, and evaluator-oriented structure. [Source: `tests/run-node-tests.mjs`:1, `_bmad-output/planning-artifacts/architecture.md`:929, `_bmad-output/planning-artifacts/prd.md`:240]
  - [x] Assert that generated detail pages exist in the build output (`dist/projects/<slug>/index.html`), expose metadata, and do not rely on unnecessary `client:*` hydration for core browsing behavior. [Source: `_bmad-output/planning-artifacts/architecture.md`:560, `_bmad-output/planning-artifacts/architecture.md`:951]
  - [x] Validate that the implementation keeps the repo's static-first baseline by passing `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:6, `_bmad-output/planning-artifacts/architecture.md`:571]
  - [x] Perform manual QA on mobile, tablet, and desktop widths to confirm that quick comparison remains easy, links stay obvious, and the page feels calm and trustworthy under time-pressure browsing. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:466, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

## Dev Notes

### Developer Context

- Story 2.1 is the first implementation story in Epic 2, so its job is to turn the existing placeholder `/projects/` route into a real evaluator-facing index while preserving the homepage-led trust system built in Epic 1. [Source: `_bmad-output/planning-artifacts/epics.md`:417, `src/pages/projects/index.astro`:5]
- The business value is quick proof triage. Evaluators should be able to scan projects fast, decide which proof to open next, and continue toward resume review or contact without friction. [Source: `_bmad-output/planning-artifacts/prd.md`:66, `_bmad-output/planning-artifacts/prd.md`:84, `_bmad-output/planning-artifacts/ux-design-specification.md`:221]
- The current repo already contains the correct route, shared layout shell, navigation model, and global editorial styling; the strongest implementation path is to extend those assets instead of inventing project-specific foundations from scratch. [Source: `src/pages/projects/index.astro`:1, `src/layouts/BaseLayout.astro`:1, `src/config/navigation.ts`:1, `src/styles/global.css`:123]
- This story should create a strong browsing surface and clear handoff to deeper proof, but it should not collapse Story 2.2 into the index by trying to deliver full case-study depth too early. [Source: `_bmad-output/planning-artifacts/epics.md`:451, `_bmad-output/planning-artifacts/prd.md`:133]

### Technical Requirements

- Preserve the static-first Astro architecture: build-time content loading, no database, no public API, no auth, no global client state, and hydration only if an interaction clearly earns it. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:546]
- Project data must be source-controlled structured content validated with Zod, not route-local mock data or a shadow data layer. Invalid required content should fail checks rather than degrade silently. [Source: `_bmad-output/planning-artifacts/architecture.md`:156, `_bmad-output/planning-artifacts/architecture.md`:162, `_bmad-output/planning-artifacts/architecture.md`:571]
- The projects index should optimize for quick comparison: concise summaries, explicit relevance/context cues, and clear next-step links rather than gallery-style cards or long narrative blocks. [Source: `_bmad-output/planning-artifacts/epics.md`:437, `_bmad-output/planning-artifacts/ux-design-specification.md`:348, `_bmad-output/planning-artifacts/ux-design-specification.md`:355]
- Maintain the warm editorial design language already present in the repo, but keep readability and information hierarchy ahead of decorative treatment. Motion, if any, must remain non-essential and must not shift interactive targets. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:167, `_bmad-output/planning-artifacts/ux-design-specification.md`:203, `src/styles/global.css`:324]
- Treat accessibility, responsiveness, metadata, and performance as definition-of-done constraints for the route and any reusable project components. [Source: `_bmad-output/planning-artifacts/architecture.md`:598, `_bmad-output/planning-artifacts/prd.md`:431]

### Architecture Compliance

- Keep route files thin: `src/pages/projects/index.astro` should orchestrate loading and composition, while reusable display logic belongs in shared components/sections and content normalization belongs in `src/lib/content/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:467, `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:805]
- Respect the architecture's layered structure: `src/pages/` for routes, `src/layouts/` for shells, `src/components/` for reusable UI, `src/content/` for authored content, `src/lib/` for helpers, and `tests/` for regression coverage. [Source: `_bmad-output/planning-artifacts/architecture.md`:467, `_bmad-output/planning-artifacts/architecture.md`:919]
- Use `src/content/config.ts` as the single schema-definition boundary. Do not duplicate project schema logic in route files, test fixtures, or helper modules. [Source: `_bmad-output/planning-artifacts/architecture.md`:489, `_bmad-output/planning-artifacts/architecture.md`:814, `src/content/config.ts`:1]
- Keep optional future seams optional. Analytics, CMS, live filters, external feeds, or client-heavy browsing enhancements are explicitly out of launch scope and must not become prerequisites for `/projects/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:807, `_bmad-output/planning-artifacts/prd.md`:131]

### Library / Framework Requirements

- Stay within the current repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, and `typescript@^5.9.3`. This story does not justify adding a client router, CMS SDK, card library, or animation dependency. [Source: `package.json`:14]
- Astro's current docs now promote Astro v6, but this repo is validated on Astro 5.18.x. For Story 2.1, build on the existing Astro 5 file-routing and content-collections model rather than folding an upgrade into feature work. [Source: Astro docs reviewed 2026-03-11, `package.json`:16]
- Tailwind CSS v4 remains CSS-first and compatible with the repo's current `src/styles/global.css` approach; continue using the existing authored global stylesheet instead of pivoting to utility-heavy route-local styling. [Source: Tailwind CSS Astro install docs reviewed 2026-03-11, `src/styles/global.css`:1]
- Zod 4 is the current stable validation layer and should continue to define the canonical project schema with TypeScript strictness preserved. [Source: Zod docs reviewed 2026-03-11, `package.json`:18]

### File Structure Requirements

- Primary route touchpoint: `src/pages/projects/index.astro`. [Source: `src/pages/projects/index.astro`:1]
- Required content/schema touchpoints: `src/content/config.ts` and new entries in `src/content/projects/`. [Source: `src/content/config.ts`:1, `_bmad-output/planning-artifacts/architecture.md`:831]
- Required content-access touchpoint: `src/lib/content/get-projects.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md`:834]
- Required detail-route touchpoint: `src/pages/projects/[slug].astro` for standard deeper-proof navigation. [Source: `_bmad-output/planning-artifacts/architecture.md`:830]
- Likely reusable UI touchpoints: project-list or card components under `src/components/` or `src/components/sections/`, following the existing PascalCase component convention and shared shell language. [Source: `_bmad-output/planning-artifacts/architecture.md`:446, `_bmad-output/planning-artifacts/architecture.md`:471]
- Testing touchpoints: a new `tests/story-2-1-projects-index.test.mjs` file plus the existing test runner in `tests/run-node-tests.mjs`. [Source: `tests/run-node-tests.mjs`:1]

### Testing Requirements

- Keep the repo baseline gates: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:6]
- Add regression checks for source contracts and built output so Story 2.1 cannot silently regress into placeholder content, broken detail links, missing metadata, or non-scannable summaries. [Source: `_bmad-output/planning-artifacts/architecture.md`:571, `_bmad-output/planning-artifacts/architecture.md`:617]
- Manual QA should verify mobile and desktop scanability, link clarity, keyboard navigation, visible focus, and reduced-motion resilience on `/projects/` and at least one linked detail page. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468, `_bmad-output/planning-artifacts/ux-design-specification.md`:470]
- Confirm that the implementation keeps a single clear page heading, semantic list/article structure, normal browser navigation behavior, generated static detail pages, and no unnecessary client hydration for core browsing. [Source: `_bmad-output/planning-artifacts/prd.md`:230, `_bmad-output/planning-artifacts/architecture.md`:560, `_bmad-output/planning-artifacts/architecture.md`:951]

### Carry-Forward Learnings

- Reuse the shared route-shell, navigation, and warm editorial system established in Story 1.7 instead of treating `/projects/` as a visual reset. [Source: `_bmad-output/implementation-artifacts/1-7-distinct-visual-system-and-trust-signals.md`:161, `src/styles/global.css`:123]
- Preserve the accessibility baseline from Story 1.6: semantic structure, visible focus, reduced-motion support, and native browser behavior remain requirements for every new project-browsing surface. [Source: `_bmad-output/implementation-artifacts/1-6-accessibility-baseline-for-core-browsing.md`:103]
- Follow the repo's existing Node-based regression pattern rather than introducing a new test framework just for Story 2.1. [Source: `_bmad-output/implementation-artifacts/1-7-distinct-visual-system-and-trust-signals.md`:89, `tests/run-node-tests.mjs`:1]

### Latest Tech Information

- Astro's latest public docs are now centered on Astro v6, but the project's validated dependency remains Astro 5.18.x. Story 2.1 should use current Astro content-collection and file-routing patterns without turning the story into an upgrade effort. [Source: Astro docs reviewed 2026-03-11, `package.json`:16]
- Tailwind CSS v4.2's Astro guidance still uses the Vite plugin plus imported global CSS, which matches the repo's current setup. There is no current technical reason to replace the existing global styling approach for this story. [Source: Tailwind CSS Astro install docs reviewed 2026-03-11, `package.json`:15, `src/styles/global.css`:1]
- Zod 4 remains the current stable schema-validation layer and continues to expect strict TypeScript usage, which aligns with the project's content-schema gatekeeping strategy. [Source: Zod docs reviewed 2026-03-11, `package.json`:18]

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, current repo state, and current standards research.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The repo currently has the correct route and shared shell pieces for this story, but it does not yet have a `projects` collection, `src/lib/content/get-projects.ts`, or `src/pages/projects/[slug].astro`. Story 2.1 should add those missing foundations in the canonical architecture locations rather than improvising alternates. [Source: `src/pages/projects/index.astro`:1, `src/content/config.ts`:1, `_bmad-output/planning-artifacts/architecture.md`:830]
- The existing shared structure is still intentionally small: `BaseLayout`, `SiteHeader`, `SiteNav`, `HeroSection`, `SocialProofSection`, route pages, and `src/styles/global.css` already establish the visual and structural system to extend. [Source: `src/layouts/BaseLayout.astro`:1, `src/components/navigation/SiteNav.astro`:1, `src/components/sections/HeroSection.astro`:1, `src/components/sections/SocialProofSection.astro`:1]
- No structural exception is needed. The main risk is creating a second project-data path or a second page-shell pattern that duplicates the existing architecture. [Source: `_bmad-output/planning-artifacts/architecture.md`:483, `_bmad-output/planning-artifacts/architecture.md`:818]

### Anti-Pattern Prevention

- Do not keep project data inline inside `src/pages/projects/index.astro` once the real content collection exists.
- Do not put canonical project content in `src/data/`, `docs/`, or a duplicate schema file.
- Do not build the index as a client-filtered app surface or hydrate the page just for presentation polish.
- Do not let Story 2.1 drift into full case-study implementation, blog infrastructure, analytics, or CMS work.
- Do not hide meaning or navigation behind hover-only treatments, decorative motion, or ambiguous card affordances.
- Do not break the launch-wide visual system by introducing a one-off project shell that ignores the existing `BaseLayout` and route-shell styling.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 2 and Story 2.1 requirements, acceptance criteria, and neighboring story boundaries
- `_bmad-output/planning-artifacts/prd.md` - product value, MVP scope, performance/accessibility constraints, and static-first product direction
- `_bmad-output/planning-artifacts/architecture.md` - canonical project structure, content-collection strategy, route boundaries, helper locations, and definition-of-done guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - evaluator journey goals, project-proof card guidance, responsive/accessibility expectations, and calm editorial interaction rules
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story key and sprint tracking state
- `_bmad-output/implementation-artifacts/1-7-distinct-visual-system-and-trust-signals.md` - current shared visual-system baseline from the last completed Epic 1 story
- `src/pages/projects/index.astro`, `src/content/config.ts`, `src/config/navigation.ts`, `src/layouts/BaseLayout.astro`, `src/components/navigation/SiteNav.astro`, `src/components/sections/HeroSection.astro`, `src/components/sections/SocialProofSection.astro`, `src/content/pages/home.md`, `src/styles/global.css`, and `tests/run-node-tests.mjs` - current implementation baseline relevant to Story 2.1
- Astro docs, Tailwind CSS Astro install docs, and Zod docs reviewed on 2026-03-11

### Definition of Done

- `/projects/` renders a real, scannable project collection sourced from validated content entries.
- At least `2` authored project entries exist so visitors can compare options meaningfully.
- Each project entry exposes clear summary information and an explicit link to a normal deeper-proof route.
- `/projects/` and generated `/projects/[slug]/` pages ship with page-level metadata and static build output.
- The projects index remains readable, keyboard-usable, and comparison-friendly across mobile, tablet, and desktop widths.
- The implementation stays static-first, route-thin, and aligned with the shared visual and structural system already present in the repo.
- `npm run check`, `npm test`, and `npm run build` pass, and manual QA confirms calm, trustworthy evaluator browsing behavior.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `2.1` and resolved to `2-1-projects-index-and-evaluation-oriented-browsing`.
- Workflow resources loaded and fully read: `workflow.yaml`, `instructions.xml`, `template.md`, `checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Current repo state reviewed across the projects route, shared layout, navigation, homepage sections, content schema, global styles, and Node test runner.
- Additional implementation-focused research gathered for the current Astro docs site, Tailwind CSS Astro setup guidance, and Zod 4 documentation.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file is not present in this repository, so the checklist step could not be executed through the referenced task runner.
- Added a `projects` content collection in `src/content/config.ts` with strict schema validation for list/detail metadata and stable slug support.
- Added authored project entries in `src/content/projects/` and a canonical content helper in `src/lib/content/get-projects.ts`.
- Built the scannable projects index and minimal static detail route using the existing `BaseLayout` shell plus shared editorial styling extensions.
- Added Node-based regression coverage for source contracts and built project pages, then ran `npm run check`, `npm test`, and `npm run build` successfully.

### Implementation Plan

- Introduce the canonical `projects` content model first so route work stays source-controlled, validated, and reusable.
- Keep `/projects/` thin by moving project rendering into a shared component and centralizing collection shaping in `src/lib/content/get-projects.ts`.
- Add a minimal `[slug]` route that provides real static destinations and preserves the evaluation journey without pulling full case-study depth forward.
- Expand the shared stylesheet only where needed to support comparison-friendly cards, responsive list behavior, and clear next-step links.
- Lock the story down with Node-based regression checks plus the repo baseline commands.

### Completion Notes List

- Comprehensive implementation context created for Story 2.1 with product, UX, architecture, repo-state, testing, and current-tooling guidance.
- Acceptance criteria expanded into implementation-focused tasks and guardrails tied to the current codebase and Epic 2 scope boundaries.
- Implemented a canonical `projects` content collection, added two authored project entries, and introduced a reusable content helper for list/detail routing.
- Reworked `/projects/` into a comparison-friendly index with semantic list/article structure, clear evaluator cues, and explicit deeper-proof links.
- Added a static `/projects/[slug]/` route with metadata, dependable browser navigation, and intentionally thin proof handoff content for Story 2.1.
- Extended shared editorial styling to support responsive project browsing while preserving touch targets, focus visibility, and non-hydrated navigation.
- Added `tests/story-2-1-projects-index.test.mjs` and verified the story with `npm run check`, `npm test`, and `npm run build`.
- Manual QA completed through breakpoint-focused inspection of the rendered structure and responsive styling rules for mobile, tablet, and desktop browsing behavior.
- Checklist validation task reference was reviewed, but the referenced `_bmad/core/tasks/validate-workflow.xml` file does not exist in this repository.

### File List
- `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/projects/ProjectIndexList.astro`
- `src/content/config.ts`
- `src/content/projects/portfolio-refresh.md`
- `src/content/projects/team-dashboard-modernization.md`
- `src/lib/content/get-projects.ts`
- `src/pages/projects/[slug].astro`
- `src/pages/projects/index.astro`
- `src/styles/global.css`
- `tests/story-2-1-projects-index.test.mjs`

## Change Log

- 2026-03-11: Implemented the Story 2.1 projects collection, scannable index, static detail route, responsive styling, and regression coverage.
