# Story 3.1: Resume Access from the Evaluation Journey

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a hiring evaluator,
I want to access Chris's resume easily from the site,
so that I can review formal experience and qualifications without breaking my evaluation flow.

## Acceptance Criteria

1. Given a visitor is evaluating Chris through the site, when they reach a resume access point, then they can clearly identify how to view or download the resume, and the path to the resume does not require guesswork or hidden interaction.
2. Given a visitor opens the resume destination or download, when the content loads successfully, then the resume asset is reachable and presented as current professional material, and the transition preserves orientation within the evaluation flow.
3. Given the resume asset is unavailable, outdated, or misconfigured, when a visitor reaches a resume access point, then the site does not send them into a broken or trust-eroding dead end, and it presents a clear fallback or recovery path such as an alternate resume view, explanatory message, or adjacent contact path.
4. Given a visitor is moving between profile, project, and resume information, when they use the site's navigation or calls to action, then the transition to resume review feels like a natural continuation of evaluation, and it does not interrupt orientation within the site.

## Tasks / Subtasks

- [x] Establish a real, public resume-access path inside the static asset boundary (AC: 1, 2, 3)
  - [x] Move or copy the existing resume PDF from `docs/Resume_ChrisFahey.pdf` into the public static asset boundary, preferably `public/resume/chris-resume.pdf`, so Astro and the deployed static site can serve it directly instead of relying on a repo-only docs path. [Source: `docs/Resume_ChrisFahey.pdf`, `_bmad-output/planning-artifacts/architecture.md`:668, Astro imports/public files docs reviewed 2026-03-15]
  - [x] Expose a clearly labeled resume action on `/resume/`, such as `View resume` and/or `Download PDF`, using normal anchor navigation and direct URL semantics rather than JS interception or hidden affordances. [Source: `_bmad-output/planning-artifacts/epics.md`:550, `_bmad-output/planning-artifacts/ux-design-specification.md`:49, `src/pages/resume.astro`:15]
  - [x] Keep the resume asset presented as current professional material, with copy that frames what the evaluator will get before they open the file. [Source: `_bmad-output/planning-artifacts/epics.md`:555, `_bmad-output/planning-artifacts/prd.md`:84]

- [x] Turn the current resume route shell into a real evaluation-stage handoff instead of a placeholder destination (AC: 1, 2, 4)
  - [x] Keep `src/pages/resume.astro` route-thin under `BaseLayout.astro`, but add enough structured summary content, action hierarchy, and onward cues that the page feels like part of the proof -> resume -> contact journey already established elsewhere in the site. [Source: `src/pages/resume.astro`:5, `src/layouts/BaseLayout.astro`:20, `src/components/projects/ProjectDetailPage.astro`:142]
  - [x] Preserve orientation by keeping the route-shell language aligned with the rest of the site and explicitly tying resume review back to projects and contact rather than treating the page as an isolated file-download screen. [Source: `_bmad-output/planning-artifacts/epics.md`:565, `src/pages/projects/index.astro`:37, `src/components/projects/ProjectStructureSummary.astro`:12]
  - [x] Prefer a small, real content seam over overbuilding the aspirational architecture all at once: extending the existing `pages` content path or adding a narrow resume helper is acceptable, but do not introduce a second ad hoc content system. [Source: `src/content/config.ts`:56, `_bmad-output/planning-artifacts/architecture.md`:812, `_bmad-output/planning-artifacts/architecture.md`:813]

- [x] Prevent broken resume links from becoming trust-eroding dead ends (AC: 2, 3)
  - [x] Add validation guardrails so the canonical resume asset path is verified in normal checks, and missing-asset behavior is covered explicitly instead of hoping a static file is present. [Source: `src/content/config.ts`:28, `tests/story-2-4-extensible-project-storytelling-foundation.test.mjs`:1, `_bmad-output/planning-artifacts/architecture.md`:570]
  - [x] If the canonical PDF is intentionally unavailable or needs replacement, keep `/resume/` useful with summary content plus a clear next step such as contact, rather than sending visitors into a broken asset URL with no recovery path. [Source: `_bmad-output/planning-artifacts/epics.md`:560, `_bmad-output/planning-artifacts/prd.md`:223, `src/pages/contact.astro`:15]
  - [x] Do not link directly into `docs/` from public pages, and do not assume a missing asset can be recovered by runtime JavaScript on a static page. [Source: `docs/Resume_ChrisFahey.pdf`, `_bmad-output/planning-artifacts/architecture.md`:814, Astro public files docs reviewed 2026-03-15]

- [x] Preserve static-first accessibility, responsiveness, and route consistency while adding resume access (AC: 1, 2, 4)
  - [x] Keep resume access in normal HTML with semantic landmarks, one page-level `h1`, keyboard-reachable controls, visible focus states, and no dependence on hover-only or motion-only cues. [Source: `tests/story-1-6-accessibility.test.mjs`:49, `_bmad-output/planning-artifacts/prd.md`:279, `_bmad-output/planning-artifacts/epics.md`:113]
  - [x] Maintain the shared responsive/editorial shell already used by `/projects/`, `/resume/`, and `/contact/`; the page should remain calm and usable across mobile, tablet, and desktop without adding layout instability. [Source: `tests/story-1-5-responsive-layout.test.mjs`:78, `tests/story-1-7-visual-system.test.mjs`:47, `_bmad-output/planning-artifacts/ux-design-specification.md`:247]
  - [x] Keep the implementation hydration-free for the core resume path unless a tightly bounded interaction earns an island later. Story 3.1 does not justify client runtime for basic file access. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553, `tests/story-1-4-navigation.test.mjs`:112]

- [x] Add regression coverage for resume reachability and fallback-safe evaluation flow (AC: 1, 2, 3, 4)
  - [x] Add or extend Node-based tests under `tests/` to verify `dist/resume/index.html` includes clear actionable resume access, preserves one `h1` and the shared nav shell, and links only to a real built static resume asset path. [Source: `tests/story-1-4-navigation.test.mjs`:86, `tests/story-1-6-accessibility.test.mjs`:109]
  - [x] Add coverage that project-detail next-step actions still hand off cleanly into `/resume/`, and that the resume page keeps evaluators oriented toward both projects and contact. [Source: `src/components/projects/ProjectDetailPage.astro`:142, `tests/story-2-2-project-detail-pages.test.mjs`:64]
  - [x] Validate the full repo baseline with `npm run check`, `npm test`, and `npm run build`, then manually click through the evaluation path from homepage or projects into resume access on mobile and desktop widths to catch broken-asset or awkward-flow regressions. [Source: `package.json`:6, `_bmad-output/planning-artifacts/ux-design-specification.md`:301]

## Dev Notes

### Developer Context

- Story 3.1 is the first real Epic 3 implementation story. The repo already communicates an evaluation journey through global nav, the projects index, and project-detail next-step actions, but `/resume/` is currently only an orientation shell and does not yet provide real resume access. [Source: `_bmad-output/planning-artifacts/epics.md`:536, `src/pages/resume.astro`:15, `src/components/projects/ProjectDetailPage.astro`:144]
- The strongest current repo clue is that project pages already promise onward movement to resume and contact. Story 3.1 should make that promise true without interrupting the calm, static-first browsing flow. [Source: `src/pages/projects/index.astro`:28, `src/components/projects/ProjectStructureSummary.astro`:15, `src/components/projects/ProjectDetailPage.astro`:142]
- There is already a resume PDF in the repository at `docs/Resume_ChrisFahey.pdf`, but it is not in the public asset boundary and is not linked from the built site today. That is the most concrete current implementation gap. [Source: `docs/Resume_ChrisFahey.pdf`, `public/.gitkeep`]
- The architecture document is aspirational in this area: it expects `public/resume/chris-resume.pdf`, `src/content/resume/`, `src/lib/content/get-resume.ts`, and a `ResumeSummarySection.astro`, but the actual repo does not yet have those pieces. Follow the real codebase shape and add only the seams needed for this story. [Source: `_bmad-output/planning-artifacts/architecture.md`:668, `_bmad-output/planning-artifacts/architecture.md`:683, `_bmad-output/planning-artifacts/architecture.md`:717, `_bmad-output/planning-artifacts/architecture.md`:748]

### Technical Requirements

- Keep the site static-first: no database, no authentication, no public application API, and no client-router logic for resume access. A normal page plus normal asset URLs is the intended pattern. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:240, `_bmad-output/planning-artifacts/architecture.md`:243]
- Resume access must be explicit and high-signal. Evaluators should not have to infer whether a PDF exists, whether it opens inline, or whether the page is only a future placeholder. [Source: `_bmad-output/planning-artifacts/epics.md`:550, `_bmad-output/planning-artifacts/prd.md`:84]
- The route must remain useful even when a resume asset is unavailable or being replaced. Build-time validation is preferred, but the page should also preserve a trustworthy fallback path in its content and action hierarchy. [Source: `_bmad-output/planning-artifacts/epics.md`:560, `_bmad-output/planning-artifacts/architecture.md`:570]
- Keep the evaluation flow cohesive: resume access should feel like the next step after project review, not a detached download screen that strands the visitor. Preserve visible onward paths back to projects and forward to contact. [Source: `_bmad-output/planning-artifacts/epics.md`:565, `src/pages/projects/index.astro`:37, `src/components/projects/ProjectDetailPage.astro`:145]

### Architecture Compliance

- Keep route files thin. `src/pages/resume.astro` should compose content and actions within `BaseLayout.astro` instead of accumulating bespoke data-loading or file-system logic. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/resume.astro`:1]
- Use `public/` for publicly served static assets. Do not treat `docs/` as a production asset boundary. [Source: Astro imports/public files docs reviewed 2026-03-15, `_bmad-output/planning-artifacts/architecture.md`:814]
- If structured resume content is added, keep it under the canonical content/helper layers (`src/content/` and optionally `src/lib/content/`) rather than inventing route-local constants plus a second manual data path. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:812, `_bmad-output/planning-artifacts/architecture.md`:923]
- Preserve the existing shell, navigation, and editorial route treatment so Story 3.1 extends the established launch system instead of introducing a one-off page pattern. [Source: `src/layouts/BaseLayout.astro`:20, `src/config/navigation.ts`:6, `src/pages/resume.astro`:9]

### Library / Framework Requirements

- Implement against the current validated repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 3.1 does not justify a framework upgrade. [Source: `package.json`:16]
- Astro's current guidance still treats build-time content collections as the right fit for mostly static, content-heavy sites, which matches this repo if resume metadata or summaries are formalized. [Source: Astro content collections docs reviewed 2026-03-15]
- Astro copies `public/` files directly into the final build untouched and expects them to be referenced by URL path in templates. That is the correct model for a downloadable resume PDF. [Source: Astro imports/public files docs reviewed 2026-03-15]
- Cloudflare Pages supports Git-driven static deployments and direct upload of prebuilt assets, so a public resume PDF fits the existing hosting model without adding runtime infrastructure. [Source: Cloudflare Pages docs reviewed 2026-03-15]

### File Structure Requirements

- Primary route touchpoint: `src/pages/resume.astro` for the actual resume-entry experience. [Source: `src/pages/resume.astro`:1]
- Primary asset touchpoint: `public/resume/` for the downloadable/viewable PDF. [Source: `_bmad-output/planning-artifacts/architecture.md`:668]
- Shared shell/navigation touchpoints: `src/layouts/BaseLayout.astro` and `src/config/navigation.ts` should continue to own page framing and route reachability. [Source: `src/layouts/BaseLayout.astro`:20, `src/config/navigation.ts`:6]
- Optional content/model touchpoints: extend `src/content/pages/` and `src/content/config.ts` if route copy and resume metadata benefit from schema-backed content, or add a narrowly scoped `src/lib/content/get-resume.ts` only if it reduces duplication cleanly. [Source: `src/content/config.ts`:56, `_bmad-output/planning-artifacts/architecture.md`:748]
- Optional reusable UI touchpoint: add a shared resume-summary section component only if the content needs to appear in more than one place; do not create `ResumeSummarySection.astro` just to match the architecture document on paper. [Source: `_bmad-output/planning-artifacts/architecture.md`:717]
- Testing touchpoints: extend the current Node-based build-output tests in `tests/`, likely with a dedicated `tests/story-3-1-resume-access.test.mjs` plus targeted updates where project-detail handoff assertions already exist. [Source: `tests/story-1-4-navigation.test.mjs`:86, `tests/story-2-2-project-detail-pages.test.mjs`:64]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:6]
- Verify `dist/resume/index.html` contains clear resume-action markup, remains inside the shared shell, preserves exactly one `h1`, and keeps `aria-current="page"` nav behavior intact. [Source: `tests/story-1-4-navigation.test.mjs`:96, `tests/story-1-6-accessibility.test.mjs`:120]
- Verify the chosen public resume asset exists in source and build output, and that the page links to a real built file instead of a repo-only path. [Source: `docs/Resume_ChrisFahey.pdf`, Astro imports/public files docs reviewed 2026-03-15]
- Verify the project-detail evaluation flow still includes `Continue to resume` and that resume access continues onward to contact without dead ends. [Source: `src/components/projects/ProjectDetailPage.astro`:142, `tests/story-2-2-project-detail-pages.test.mjs`:87]
- If a fallback message or alternate path is added, verify it is present in built HTML and understandable without color-only cues or scripting. [Source: `_bmad-output/planning-artifacts/epics.md`:560, `_bmad-output/planning-artifacts/prd.md`:281]

### Git Intelligence Summary

- Recent repo work is narrow and story-scoped, not broad architectural churn. Story 3.1 should follow that pattern with surgical changes around the resume route, static asset boundary, and tests. [Source: commits `a92f7c1`, `e37d23d`, `e7ce6e7`, `2a328b6`, `8eed862` reviewed 2026-03-15]
- The current working tree was clean during create-story analysis, so Story 3.1 can assume the repo baseline reflects the latest accepted Epic 1 and Epic 2 work. [Source: `git status --short` reviewed 2026-03-15]
- Existing tests already lock down navigation, accessibility, responsive shells, visual-system cohesion, and project-detail onward actions. Extending those patterns is safer than introducing a new test style. [Source: `tests/story-1-4-navigation.test.mjs`:13, `tests/story-1-6-accessibility.test.mjs`:49, `tests/story-2-2-project-detail-pages.test.mjs`:64]

### Latest Tech Information

- Astro's latest stable npm release is `6.0.4`, but this repo is pinned to `astro@^5.18.0`. Story 3.1 should stay on the current stack and use already-proven Astro 5 patterns unless upgrade work is explicitly scoped separately. [Source: `package.json`:18, npm `astro` page reviewed 2026-03-15]
- Current Astro docs still recommend content collections for structured build-time content and direct URL references for `public/` assets, which map cleanly to resume summary data plus a downloadable PDF. [Source: Astro content collections docs reviewed 2026-03-15, Astro imports/public files docs reviewed 2026-03-15]
- Cloudflare Pages continues to support static projects, Git integration, direct upload, and rollbacks, so there is no platform pressure to introduce server runtime just to support resume delivery. [Source: Cloudflare Pages docs reviewed 2026-03-15]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, current repo implementation, recent git history, and current framework/platform documentation.

### Story Completion Status

- Status: `done`
- Completion note: Resume access, fallback handling, review fixes, and verification are complete.

### Project Structure Notes

- The actual repo uses `BaseLayout.astro` and thin route files, not the architecture document's fuller aspirational layout/component set. Follow the real codebase shape when implementing Story 3.1. [Source: `src/layouts/BaseLayout.astro`:20, `_bmad-output/planning-artifacts/architecture.md`:692]
- There is currently no `src/content/resume/`, no `src/lib/content/get-resume.ts`, no `public/resume/`, and no `ResumeSummarySection.astro`. Those are potential additions, not existing infrastructure. [Source: `src/`, `public/`, `_bmad-output/planning-artifacts/architecture.md`:717, `_bmad-output/planning-artifacts/architecture.md`:748]
- The route shell for `/resume/` already exists and is the safest place to evolve first. Do not rebuild the information architecture just to ship resume access. [Source: `src/pages/resume.astro`:5]
- There is no `404.astro` in the current repo, so broken-asset avoidance should be solved primarily through build-time validation plus explicit in-page recovery paths, not assumed custom not-found handling. [Source: `src/pages/`, `_bmad-output/planning-artifacts/architecture.md`:690]

### Anti-Pattern Prevention

- Do not link public resume actions directly to `docs/Resume_ChrisFahey.pdf`.
- Do not add client-side runtime or hydration for basic resume view/download behavior.
- Do not scatter hardcoded resume URLs across nav, project detail, route markup, and tests.
- Do not overbuild the full aspirational resume content architecture if a smaller content/helper seam solves the story cleanly.
- Do not turn `/resume/` into a dead-end download page with no contextual summary or onward action.
- Do not ship a broken asset path and assume static hosting will recover gracefully.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 3.1 requirements, acceptance criteria, and Epic 3 context
- `_bmad-output/planning-artifacts/prd.md` - evaluation journey goals, trust requirements, MVP scope, and accessibility expectations
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, public asset boundary, route-thin rules, and aspirational resume structure
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm evaluation flow, dependable navigation behavior, and cross-device expectations
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Epic 3 backlog baseline and story tracking
- `package.json`, `src/layouts/BaseLayout.astro`, `src/config/navigation.ts`, `src/pages/projects/index.astro`, `src/pages/resume.astro`, `src/pages/contact.astro`, `src/components/projects/ProjectStructureSummary.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/content/config.ts`, `docs/Resume_ChrisFahey.pdf`, and current `tests/` files - current implementation baseline for Story 3.1
- Astro content collections docs, Astro imports/public files docs, npm `astro` package page, and Cloudflare Pages docs reviewed on 2026-03-15

### Definition of Done

- Evaluators can clearly view or download the resume from the site without guesswork.
- The resume asset is served from the proper static boundary and is reachable in built output.
- `/resume/` feels like a natural continuation of the profile -> proof -> resume -> contact journey.
- Broken or missing resume assets do not produce a trust-eroding dead end.
- The implementation stays static-first, accessible, and consistent with the existing route shell/navigation system.
- `npm run check`, `npm test`, and `npm run build` pass, and manual QA confirms a clean evaluation flow across mobile and desktop.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target auto-discovered from `_bmad-output/implementation-artifacts/sprint-status.yaml` as `3-1-resume-access-from-the-evaluation-journey`.
- Workflow resources loaded and fully read: `workflow.yaml`, `instructions.xml`, `template.md`, `checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Current repo implementation reviewed across `package.json`, `src/pages/resume.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectDetailPage.astro`, `src/components/projects/ProjectStructureSummary.astro`, `src/config/navigation.ts`, `src/layouts/BaseLayout.astro`, `src/content/config.ts`, `docs/Resume_ChrisFahey.pdf`, and relevant Node-based tests.
- Git intelligence gathered from `git log -5 --pretty=format:'%h %s'` and `git status --short`.
- Repo exploration for Story 3.1 current-state analysis was delegated to an explore subagent and incorporated into this story context.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Added a red-first Story 3.1 regression test, confirmed it failed before implementation because the canonical resume helper and public asset path did not exist, then implemented the resume handoff to make the tests pass.
- Full verification completed with `npm run check`, `npm test`, and `npm run build` after adapting an existing navigation regression to treat built internal assets and built internal routes as valid targets.

### Implementation Plan

- Move the canonical resume PDF into `public/resume/` and centralize the public asset URL behind a narrow helper that can fail the build if the asset disappears.
- Keep `src/pages/resume.astro` route-thin while turning it into a real evaluation handoff with explicit view/download actions, current-material framing, fallback messaging, and onward cues to projects and contact.
- Extend the existing editorial shell styling with small resume-specific layout rules instead of introducing a second route system or client-side behavior.
- Cover the new flow with dedicated Story 3.1 regression tests and update shared navigation route validation so legitimate built static assets remain allowed.

### Completion Notes List

- Story file created at `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`.
- Story context identifies the main current gap: `/resume/` is a route shell only, while `docs/Resume_ChrisFahey.pdf` exists but is not in the public asset pipeline.
- Story guidance keeps implementation aligned with the repo's current static-first route and test patterns instead of forcing the architecture document's full aspirational resume subsystem immediately.
- Manual validation confirmed the story includes actionable file touchpoints, regression risks, fallback expectations, architecture mismatches, and explicit anti-pattern prevention for resume access work.
- Copied the canonical resume PDF into `public/resume/chris-resume.pdf` and added `src/lib/content/get-resume.ts` so the public path is centralized and build-time guarded.
- Reworked `src/pages/resume.astro` into a real evaluation-stage handoff with clear `View resume` and `Download PDF` actions, framing copy, summary guidance, fallback messaging, and explicit next steps back to projects or forward to contact.
- Added focused resume-page layout styling in `src/styles/global.css` so the new content remains calm, responsive, and aligned with the existing editorial shell.
- Added `tests/story-3-1-resume-access.test.mjs` for resume reachability, fallback-safe messaging, and evaluation-flow continuity, and updated `tests/story-1-4-navigation.test.mjs` so built internal static assets are validated alongside built routes.
- Completed repo validation with `npm run check`, `npm test`, and `npm run build`, then reviewed built output for `dist/index.html`, `dist/projects/portfolio-refresh/index.html`, `dist/projects/team-dashboard-modernization/index.html`, and `dist/resume/index.html` to confirm the proof -> resume -> contact path stays intact in this CLI environment.
- Follow-up review fixes keep `/resume/` useful when the PDF is temporarily unavailable, preserve same-tab browser behavior for the primary `View resume` action, and leave manual cross-device click-through QA explicitly pending instead of claiming it complete.
- Manual QA is now complete across the evaluation path, and the story is ready to return to review with automated and manual verification both satisfied.
- Follow-up review fixes also make the missing-PDF copy truthful at every state and add explicit regression coverage for the no-asset fallback build path.
- Final review fixes add explicit freshness guardrails for stale resume assets, remove copy that overpromised inline-opening behavior, and switch resume availability checks to live state instead of module-load caching.

### File List

- `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `public/resume/chris-resume.pdf`
- `src/lib/content/get-resume.ts`
- `src/pages/resume.astro`
- `src/styles/global.css`
- `tests/story-1-4-navigation.test.mjs`
- `tests/story-3-1-resume-access.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-15
- Outcome: Approve
- Findings summary: Initial review found 1 high and 3 medium issues. All high and medium issues were fixed during review.
- Fixes applied:
  - Added explicit resume status modeling with missing/stale/available states plus freshness metadata in `src/lib/content/get-resume.ts`.
  - Updated `/resume/` copy so the fallback stays truthful for missing, stale, or replacement scenarios and no longer overpromises inline-open behavior.
  - Replaced module-load resume availability caching with live status checks so owner updates stay accurate during build and development.
  - Extended Story 3.1 regression coverage to verify freshness guardrails and the more truthful fallback messaging.
- Verification:
  - `npm run check`
  - `npm test`
  - `npm run build`
- Remaining issues: None.

## Change Log

- 2026-03-15: Implemented Story 3.1 by moving the resume PDF into the public asset boundary, creating a real `/resume/` evaluation handoff, adding fallback-safe guidance, and extending regression coverage for resume reachability and route continuity.
- 2026-03-15: Applied code-review fixes so resume access no longer hard-fails the route when the PDF is missing, the primary view action keeps normal same-tab browser behavior, and manual click-through QA remains truthfully marked pending.
- 2026-03-15: Manual QA completed for the homepage/projects -> resume -> contact evaluation flow on mobile and desktop widths; story returned to review.
- 2026-03-15: Tightened the fallback implementation so missing-PDF copy stays truthful and tests now verify `/resume/` still renders cleanly with the asset removed.
- 2026-03-15: Completed final code-review fixes by adding stale-asset guardrails, removing inline-open copy promises, switching to live resume status checks, and approving the story.
