# Story 2.4: Extensible Project Storytelling Foundation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the project content model and templates to support richer storytelling later,
so that I can deepen proof of work over time without rebuilding the site's core project structure.

## Acceptance Criteria

1. Given the MVP project experience is implemented, when project content models and templates are defined, then they support today's required project summaries and detail pages, and they leave room for future additions such as deeper case-study sections, richer media, or expanded narrative blocks.
2. Given future project storytelling needs emerge, when Chris adds more detailed project content, then the site can accommodate that deeper storytelling within the same overall project architecture, and existing project pages do not need to be restructured from scratch.
3. Given richer storytelling is not yet used on every project, when visitors browse the current MVP project pages, then the experience remains coherent and complete without placeholder content, and future extensibility does not create clutter or confusion in the launch experience.

## Tasks / Subtasks

- [x] Extend the canonical project content model so richer storytelling can be added without creating a second project system (AC: 1, 2, 3)
  - [x] Review `src/content/config.ts`, `src/lib/content/get-projects.ts`, and `src/content/projects/*.md` together, then evolve the `projects` collection around optional, typed extension seams for future case-study depth, richer media metadata, or expanded narrative blocks instead of ad hoc top-level sprawl. Keep Astro content collections plus Zod validation as the canonical source of truth. [Source: `_bmad-output/planning-artifacts/epics.md`:521, `_bmad-output/planning-artifacts/architecture.md`:159, `src/content/config.ts`:55, `src/lib/content/get-projects.ts`:89]
  - [x] Preserve the existing `preview`, `detail`, and `discoverability` contract added in Story 2.3 so current list/detail pages keep working while richer storytelling remains additive and optional. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:22, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:158, `src/lib/content/get-projects.ts`:120]
  - [x] Keep authored project truth in repository content and static assets. Do not introduce a CMS, database, external content feed, or required third-party media platform for this story. [Source: `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/architecture.md`:153, `_bmad-output/planning-artifacts/architecture.md`:812]

- [x] Refactor project detail rendering so future story modules fit inside the existing architecture instead of forcing route redesign (AC: 1, 2, 3)
  - [x] Update the project rendering path so richer narrative/storytelling modules can be driven by normalized arrays or optional blocks rather than the current fixed assumption of exactly three narrative sections. `ProjectDetailPage.astro` currently slices the first two sections and hardcodes the third by index, so this is the main extensibility risk to remove. [Source: `_bmad-output/planning-artifacts/epics.md`:526, `src/components/projects/ProjectDetailPage.astro`:33, `src/components/projects/ProjectDetailPage.astro`:47]
  - [x] Keep `src/pages/projects/[slug].astro` thin by continuing to load one normalized project record, call `render(project.entry)`, and compose shared project components rather than moving storytelling logic into the route file. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/projects/[slug].astro`:30]
  - [x] Preserve the current evaluator-facing summary structure and onward navigation to `/projects/`, `/resume/`, and `/contact/` so richer storytelling deepens proof without breaking the broader evaluation journey. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:42, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:102, `src/components/projects/ProjectDetailPage.astro`:115]

- [x] Add future-ready media and narrative seams without cluttering the MVP experience (AC: 1, 2, 3)
  - [x] If richer media support is introduced, model it as optional, truthful metadata and static assets aligned with the reserved `public/images/projects/` boundary, not as a required gallery system or runtime-heavy media experience. [Source: `_bmad-output/planning-artifacts/epics.md`:524, `_bmad-output/planning-artifacts/prd.md`:420, `_bmad-output/planning-artifacts/architecture.md`:937]
  - [x] If expanded case-study or narrative blocks are introduced, keep them content-driven and optional so current MVP project pages remain complete when those fields are absent. No placeholder sections, empty shells, or "coming soon" storytelling blocks should appear. [Source: `_bmad-output/planning-artifacts/epics.md`:531, `_bmad-output/planning-artifacts/prd.md`:117, `_bmad-output/planning-artifacts/ux-design-specification.md`:101]
  - [x] Do not let this story drift into blog/writing infrastructure, launch navigation changes, CMS adoption, analytics, or SEO theater. Those are separate concerns and are explicitly outside MVP storytelling scope. [Source: `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/ux-design-specification.md`:201, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:137]

- [x] Preserve static-first accessibility, performance, and discoverability guardrails while making the content model more extensible (AC: 1, 2, 3)
  - [x] Keep project meaning in server-rendered HTML, continue avoiding `client:*` hydration for core project browsing, and preserve semantic sectioning so deeper storytelling still works under static delivery and normal browser navigation. [Source: `_bmad-output/planning-artifacts/epics.md`:503, `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:597]
  - [x] Respect reduced-motion, layout stability, and control stability if richer media or story modules introduce any visual enhancement. Motion may support pacing, but it cannot be required for comprehension or target acquisition. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:203, `_bmad-output/planning-artifacts/ux-design-specification.md`:215, `_bmad-output/planning-artifacts/architecture.md`:603]
  - [x] Keep canonical URLs, structured data, and project metadata centralized through existing shared layout/SEO boundaries if any new story modules affect discoverability signals. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:61, `_bmad-output/planning-artifacts/architecture.md`:798, `src/pages/projects/[slug].astro`:34]

- [x] Add regression coverage for extension-ready storytelling behavior (AC: 1, 2, 3)
  - [x] Add or extend Node-based tests under `tests/` to assert the schema and normalized helper support optional richer storytelling modules, current projects still render coherently without them, and project detail rendering no longer depends on a fixed three-section shape. [Source: `tests/story-2-2-project-detail-pages.test.mjs`:1, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:1, `src/components/projects/ProjectDetailPage.astro`:33]
  - [x] Preserve the repo verification baseline with `npm run check`, `npm test`, and `npm run build`, then manually review at least the current two project detail pages and the projects index to confirm there is no placeholder clutter or layout regression when richer-storytelling seams are present but unused. [Source: `package.json`:7, `_bmad-output/planning-artifacts/ux-design-specification.md`:247]

## Dev Notes

### Developer Context

- Story 2.4 is the Epic 2 extensibility story, not the launch of full case studies. Its job is to make the current projects architecture capable of deeper storytelling later while preserving today's clean, evaluator-ready MVP experience. [Source: `_bmad-output/planning-artifacts/epics.md`:511, `_bmad-output/planning-artifacts/prd.md`:117]
- The repo already has a strong project foundation from Stories 2.1-2.3: canonical content entries, a normalized helper, thin routes, shared project components, and discoverability/test guardrails. This story should extend those seams instead of replacing them. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:49, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:99]
- The biggest concrete current limitation is that `ProjectDetailPage.astro` assumes a fixed three-part narrative shape. That works for today's content, but it is the most obvious place where future richer storytelling could become awkward or brittle unless the rendering model is generalized. [Source: `src/components/projects/ProjectDetailPage.astro`:33, `src/components/projects/ProjectDetailPage.astro`:47]
- UX intent stays depth-on-demand: summary first, deeper proof second, richer storytelling only when it adds value. Future extensibility must not dilute fast scanning or first-minute trust. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:99, `_bmad-output/planning-artifacts/prd.md`:84]

### Technical Requirements

- Keep `src/content/projects/` as the authored source of truth and continue using Astro content collections with Zod-backed schema validation. Do not add JSON mirrors, route-local data objects, or separate metadata registries for future story modules. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:55]
- Preserve the current normalized project contract in `src/lib/content/get-projects.ts`. If richer storytelling fields are added, normalize them there so shared components consume one consistent project shape. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:58, `src/lib/content/get-projects.ts`:66]
- Keep current MVP preview/detail requirements intact: project index summaries, detail-page proof sections, canonical metadata, and server-rendered route output must still work even when no richer-storytelling fields are authored. [Source: `_bmad-output/planning-artifacts/epics.md`:523, `_bmad-output/planning-artifacts/epics.md`:533, `src/pages/projects/index.astro`:9, `src/pages/projects/[slug].astro`:34]
- Any media extensibility should remain optional, truthful, and static-friendly. Use repository content and public assets first; do not depend on runtime galleries, client uploads, or third-party media services for MVP success. [Source: `_bmad-output/planning-artifacts/prd.md`:420, `_bmad-output/planning-artifacts/architecture.md`:167, `_bmad-output/planning-artifacts/architecture.md`:934]

### Architecture Compliance

- Keep route files thin. `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro` should continue composing shared components from normalized content rather than embedding heavy storytelling logic. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:799, `src/pages/projects/index.astro`:1, `src/pages/projects/[slug].astro`:1]
- Reuse the existing layered boundaries: schema in `src/content/config.ts`, content access in `src/lib/content/`, project UI in `src/components/projects/`, shared layout/SEO in `src/layouts/` and `src/components/seo/` or `src/lib/seo/`, and styling in `src/styles/global.css`. [Source: `_bmad-output/planning-artifacts/architecture.md`:467, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:919]
- Preserve the static-first architecture: no API layer, no client router, no global client state, and no hydration for core project storytelling unless a truly bounded interaction earns it later. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:277, `_bmad-output/planning-artifacts/architecture.md`:553]
- Keep discoverability, metadata, and structured-data behavior centralized through the shared boundaries added in Story 2.3 instead of introducing route-local head duplication. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:69, `_bmad-output/planning-artifacts/architecture.md`:798]

### Library / Framework Requirements

- Implement against the current validated stack in this repo: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 2.4 does not justify a framework upgrade or architecture migration. [Source: `package.json`:16]
- Astro's current content-collections guidance still supports the patterns already used here: frontmatter `slug`, `getCollection()`, typed schemas, and `render(entry)` for Markdown body content. Keep Story 2.4 Astro 5-compatible even though newer Astro versions exist. [Source: `src/lib/content/get-projects.ts`:89, `src/pages/projects/[slug].astro`:30, Astro content collections docs reviewed 2026-03-15]
- Zod 4 remains the right schema layer for optional, typed extension seams. Favor explicit schemas and optional fields over loose `any`-style content shapes. [Source: `src/content/config.ts`:1, Zod 4 docs reviewed 2026-03-15]
- Do not add CMS SDKs, runtime content loaders, image/gallery packages, or SEO plugins for this story. The existing stack already supports the intended extensibility work. [Source: `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:977, `package.json`:16]

### File Structure Requirements

- Primary schema touchpoint: `src/content/config.ts` for optional richer-storytelling fields and validation rules. [Source: `src/content/config.ts`:55]
- Primary normalization touchpoint: `src/lib/content/get-projects.ts` for extending the canonical `ProjectRecord` shape without leaking raw frontmatter details into components. [Source: `src/lib/content/get-projects.ts`:66]
- Primary rendering touchpoints: `src/components/projects/ProjectDetailPage.astro` and, if needed, adjacent shared components in `src/components/projects/` for extensible story-module rendering. `ProjectStructureSummary.astro` should remain the recurring evaluator-facing scaffold unless there is a strong reason to split responsibilities more cleanly. [Source: `src/components/projects/ProjectDetailPage.astro`:23, `src/components/projects/ProjectStructureSummary.astro`:18]
- Route touchpoints: `src/pages/projects/[slug].astro` and `src/pages/projects/index.astro` should preserve their thin composition role and consume the refined normalized contract. [Source: `src/pages/projects/[slug].astro`:10, `src/pages/projects/index.astro`:6]
- Content touchpoints: current project entries under `src/content/projects/` should be updated only as needed to prove the extensibility model without forcing every project to adopt every new optional field immediately. [Source: `src/content/projects/portfolio-refresh.md`:1, `src/content/projects/team-dashboard-modernization.md`:1]
- Style touchpoint: `src/styles/global.css` should remain the shared home for recurring project storytelling presentation so Story 2.4 does not splinter styling into page-local hacks. [Source: `_bmad-output/planning-artifacts/architecture.md`:925]
- Testing touchpoints: extend the existing Node-based project tests under `tests/`, likely with a dedicated Story 2.4 test file and targeted updates to Story 2.2/2.3 assertions where the shared rendering contract changes. [Source: `tests/story-2-2-project-detail-pages.test.mjs`:1, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:1]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:7]
- Assert schema/helper behavior together so future storytelling fields remain typed, optional where intended, and normalized before reaching components. [Source: `_bmad-output/planning-artifacts/architecture.md`:570, `src/lib/content/get-projects.ts`:89]
- Verify current project pages still render coherent HTML when richer-storytelling fields are absent. The launch experience must not show placeholders, empty wrappers, or broken hierarchy. [Source: `_bmad-output/planning-artifacts/epics.md`:531]
- Verify project detail rendering can handle variable narrative/story-module shapes without relying on the current fixed `slice(0, 2)` plus `index 2` pattern. [Source: `src/components/projects/ProjectDetailPage.astro`:33, `src/components/projects/ProjectDetailPage.astro`:49]
- Continue checking for static-first behavior in route source and built HTML: no `client:*` directives for core project browsing, semantic structure preserved, canonical URLs and structured data still emitted correctly if affected. [Source: `tests/story-2-3-project-structure-and-discoverability.test.mjs`:1, `_bmad-output/planning-artifacts/architecture.md`:951]
- Manual QA should review the projects index plus current detail pages on mobile, tablet, and desktop widths to confirm extensibility work does not introduce clutter, unstable composition, or weaker scanability. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:247, `_bmad-output/planning-artifacts/ux-design-specification.md`:301]

### Previous Story Intelligence

- Story 2.1 established the canonical projects collection, thin routes, and baseline Node test pattern. Story 2.4 should keep extending that single content path rather than inventing a second storytelling system. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:177]
- Story 2.2 added substantive proof sections and deferred placeholder future-case-study work, which means 2.4 should add real extensibility seams instead of visible "future depth" clutter. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:55, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:103]
- Story 2.3 standardized the recurring project structure and explicitly reserved deeper narrative modules, richer media, and post-MVP storytelling seams for Story 2.4. That is the most direct implementation handoff. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:38, `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:101]
- Keep the current evaluation journey intact: project detail pages should still support onward movement to all projects, resume, and contact. Richer storytelling must reinforce that flow, not trap visitors in a dead-end case-study format. [Source: `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`:102, `src/components/projects/ProjectDetailPage.astro`:115]

### Git Intelligence Summary

- Recent story implementation work in Epic 2 has stayed tightly scoped to the project-content cluster: schema/helper, project components/routes, content entries, styles, tests, and story artifacts. Story 2.4 should follow that same implementation shape. [Source: commits `fd68255`, `c52221a`, `c6f7348` reviewed 2026-03-15]
- Recent post-2.3 commits are surgical fixes and infra adjustments (`8eed862`, `e7ce6e7`, `9a4f818`, `e37d23d`), which reinforces the repo's preference for narrow, test-backed changes rather than broad rewrites. [Source: `git log --oneline -5` reviewed 2026-03-15]
- Current repo state is clean, so Story 2.4 can assume the working tree reflects the intended latest baseline before implementation begins. [Source: `git status --short` reviewed 2026-03-15]

### Latest Tech Information

- Astro's latest stable release is newer than the version pinned in this repo (`6.0.4` published on npm at review time), but Story 2.4 should stay on the current Astro 5 stack and use the already-proven content-collection APIs in this repo unless an upgrade is intentionally planned as separate work. [Source: `package.json`:18, npm `astro` page reviewed 2026-03-15]
- Current Astro docs still recommend content collections for structured local content, support frontmatter `slug`, `getCollection()`, and `render(entry)`, and position build-time collections as the best fit for mostly static content-heavy sites. That matches this project's architecture and future-storytelling needs better than live collections. [Source: Astro content collections docs reviewed 2026-03-15]
- Zod 4 is current and stable, and Astro's schema layer is designed around Zod-backed validation. That supports adding optional richer-storytelling fields with type safety instead of allowing loose frontmatter drift. [Source: Zod docs reviewed 2026-03-15, Astro content collections docs reviewed 2026-03-15]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous Epic 2 story artifacts, current repo implementation, git history, and current framework documentation.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The actual repo uses `BaseLayout.astro` plus `src/components/projects/` for project rendering rather than the architecture document's aspirational `ProjectLayout.astro`. Follow the real codebase shape when implementing Story 2.4. [Source: `src/pages/projects/[slug].astro`:5, `_bmad-output/planning-artifacts/architecture.md`:694]
- Current project rendering already separates summary structure (`ProjectStructureSummary.astro`) from detail proof rendering (`ProjectDetailPage.astro`) and route composition. That separation is the best place to preserve while adding richer story-module flexibility. [Source: `src/components/projects/ProjectStructureSummary.astro`:18, `src/components/projects/ProjectDetailPage.astro`:23]
- `public/images/projects/` is the reserved architecture location for directly addressable project media, so future richer-media seams should align there instead of inventing a new asset taxonomy. [Source: `_bmad-output/planning-artifacts/architecture.md`:937]
- The main structural risk is accidental duplication: future story-module rules split across schema, helper, component, route, and tests with no canonical normalized contract. Keep one source of truth in the schema/helper layer. [Source: `_bmad-output/planning-artifacts/architecture.md`:640, `src/lib/content/get-projects.ts`:89]

### Anti-Pattern Prevention

- Do not create a second project data path for richer storytelling.
- Do not move heavy storytelling logic into route files.
- Do not add `client:*` hydration, client routing, loading skeletons, or runtime-only content for core project storytelling.
- Do not turn Story 2.4 into blog infrastructure, CMS adoption, analytics work, or a framework-upgrade project.
- Do not add placeholder case-study sections, empty media wrappers, or "coming soon" launch clutter.
- Do not weaken the current evaluator-facing structure or the onward paths to `/projects/`, `/resume/`, and `/contact/`.
- Do not let optional richer modules become required for every project entry at launch.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 2.4 requirements, acceptance criteria, and Epic 2 context
- `_bmad-output/planning-artifacts/prd.md` - MVP boundaries, post-MVP storytelling intent, and trust/performance constraints
- `_bmad-output/planning-artifacts/architecture.md` - static-first content architecture, file boundaries, media boundary, and implementation guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - depth-on-demand proof flow, anti-clutter guidance, and responsive QA expectations
- `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md` - Epic 2 project-route baseline and handoff into deeper proof
- `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md` - substantive proof foundation and deferred Story 2.4 seams
- `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md` - canonical project contract, discoverability guardrails, and direct scope handoff into Story 2.4
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - active sprint tracking and Story 2.4 backlog baseline
- `package.json`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectIndexList.astro`, `src/components/projects/ProjectStructureSummary.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/content/projects/portfolio-refresh.md`, `src/content/projects/team-dashboard-modernization.md`, and `tests/story-2-2-project-detail-pages.test.mjs` plus `tests/story-2-3-project-structure-and-discoverability.test.mjs` - current implementation baseline for Story 2.4
- Astro content collections docs, Astro npm package page, and Zod docs reviewed on 2026-03-15

### Definition of Done

- The `projects` content model supports optional richer-storytelling extensions without creating a second data path.
- Current project summaries, detail pages, metadata, and navigation still work coherently when richer-storytelling fields are absent.
- Project detail rendering can accommodate richer narrative/story modules inside the same overall architecture without route redesign.
- Any richer media or extended narrative seams remain optional, truthful, static-friendly, and free of launch-time placeholder clutter.
- Static-first, accessibility, performance, and discoverability guardrails remain intact.
- `npm run check`, `npm test`, and `npm run build` pass, and manual QA confirms no clutter or regression across current project pages.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `2.4` and resolved to `2-4-extensible-project-storytelling-foundation`.
- Workflow resources loaded and fully read: `workflow.yaml`, `instructions.xml`, `template.md`, `checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`.
- Current repo implementation reviewed across `package.json`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/pages/projects/`, `src/components/projects/`, `src/content/projects/`, and current Node-based project tests.
- Git intelligence gathered from `git status --short`, `git log --oneline -5`, and recent commit summaries.
- Current framework research gathered from Astro content collections docs, Astro npm package metadata, and Zod docs on 2026-03-15.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Added a red-first Story 2.4 regression test, confirmed it failed against the pre-change implementation, then implemented the schema, normalization, rendering, and content updates to make it pass.
- `npm test` initially exposed an Astro content-cache permission issue caused by a root-owned `node_modules/.astro` directory, so `astro.config.mjs` was updated to use a repo-local writable cache directory at `./.astro-cache` before rerunning validation.

### Implementation Plan

- Extend the `projects` content schema with optional discriminated story modules so richer narrative and media seams stay typed, additive, and repository-authored.
- Normalize those optional modules in `src/lib/content/get-projects.ts` while preserving the existing `preview`, `detail`, and `discoverability` contract for current routes and components.
- Refactor `src/components/projects/ProjectDetailPage.astro` to render narrative sections from normalized arrays, add optional static media modules without placeholders, and keep the route layer thin.
- Prove the new seams with one authored project example, one static asset under `public/images/projects/`, and regression coverage that checks schema, rendering, and built output behavior.

### Completion Notes List

- Story file created at `_bmad-output/implementation-artifacts/2-4-extensible-project-storytelling-foundation.md`.
- Story context emphasizes extension of the existing project schema/helper/component stack rather than a second storytelling system.
- Manual validation confirmed the story includes scope boundaries, current-code touchpoints, previous-story learnings, git patterns, testing expectations, and explicit anti-pattern prevention for future-storytelling work.
- Added optional typed `storyModules` support in `src/content/config.ts` for narrative and media extensions, including static-asset path validation for `/images/projects/`.
- Extended `src/lib/content/get-projects.ts` so the canonical normalized project contract now exposes optional story modules while preserving existing `preview`, `detail`, and `discoverability` behavior.
- Refactored `src/components/projects/ProjectDetailPage.astro` to render narrative sections from normalized arrays instead of a fixed three-section assumption and to display optional media modules without adding placeholder shells to projects that do not use them.
- Added one real extension example to `src/content/projects/portfolio-refresh.md` plus a static SVG proof map in `public/images/projects/portfolio-refresh-proof-map.svg` to demonstrate truthful, optional richer storytelling.
- Added Story 2.4 regression coverage in `tests/story-2-4-extensible-project-storytelling-foundation.test.mjs` for schema seams, rendering generalization, optional media output, and placeholder avoidance.
- Updated `astro.config.mjs` to use `./.astro-cache` so Astro sync/build writes remain inside a repo-owned cache path during verification.
- Completed final validation with `npm run check`, `npm test`, and `npm run build`, then manually reviewed the built output for `dist/projects/index.html`, `dist/projects/portfolio-refresh/index.html`, and `dist/projects/team-dashboard-modernization/index.html` to confirm extension seams stay additive and uncluttered.
- Code review fixes added reserved and unique story-module id validation, normalized narrative extensions to multi-paragraph content, required real static media assets plus explicit dimensions, and ignored the generated `.astro-cache/` directory so git/story tracking stays clean.

### File List

- `_bmad-output/implementation-artifacts/2-4-extensible-project-storytelling-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `.gitignore`
- `astro.config.mjs`
- `public/images/projects/portfolio-refresh-proof-map.svg`
- `src/components/projects/ProjectDetailPage.astro`
- `src/content/config.ts`
- `src/content/projects/portfolio-refresh.md`
- `src/env.d.ts`
- `src/lib/content/get-projects.ts`
- `src/styles/global.css`
- `tests/story-2-4-extensible-project-storytelling-foundation.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-15
- Outcome: Approve
- Findings summary: Initial review found 2 high, 2 medium, and 1 low issue. All high and medium issues were fixed during review.
- Fixes applied:
  - Added schema guards so story-module ids cannot collide with built-in narrative sections and cannot repeat within a project.
  - Expanded narrative story modules to support multi-paragraph authored content and updated rendering to output all paragraphs.
  - Tightened media validation so items must point to a real `/images/projects/` asset and include explicit `width` and `height` metadata, then passed those dimensions through to rendered HTML.
  - Ignored the generated `.astro-cache/` directory to remove undocumented git noise from the story implementation footprint.
- Verification:
  - `npm run check`
  - `npm test`
- Remaining issues: Low-severity contract overlap remains between `detail.narrativeSections` and `detail.storyModules`, but it does not block acceptance criteria or story completion.

## Change Log

- 2026-03-15: Implemented Story 2.4 extensibility seams for richer project storytelling through typed content modules, normalized detail rendering, optional static media support, and regression coverage.
- 2026-03-15: Updated Astro cache configuration to use `./.astro-cache` so repo validation commands succeed without relying on the root-owned `node_modules/.astro` cache directory.
- 2026-03-15: Applied code review fixes for reserved story-module ids, multi-paragraph narrative rendering, static media validation with dimensions, and `.astro-cache/` git hygiene.
