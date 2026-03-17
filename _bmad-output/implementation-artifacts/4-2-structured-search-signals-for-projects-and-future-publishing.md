# Story 4.2: Structured Search Signals for Projects and Future Publishing

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the content system to support structured discoverability signals,
so that projects are easier to find now and future writing or case-study content can be added cleanly after launch without redefining MVP scope.

## Acceptance Criteria

1. Given project and core site content is modeled for the MVP, when metadata and page structure are defined, then each launch page and project page includes a meaningful page title, page description, canonical path, and visible heading structure aligned to its content, and any future writing or case-study discoverability remains explicitly extension-ready rather than launch-required.
2. Given Chris adds future publishing content after launch, when that content type is introduced, then the site can apply the same discoverability pattern without redefining the product concept, and the addition fits the existing information architecture.
3. Given discoverability support is implemented, when search-oriented content is reviewed, then it remains understandable to human readers first, and it does not become keyword-stuffed, misleading, or structurally inconsistent.

## Tasks / Subtasks

- [x] Extend the shared discoverability contract for projects and launch pages without introducing a second SEO system (AC: 1, 3)
  - [x] Reuse `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, `src/layouts/BaseLayout.astro`, and the project `discoverability` contract in `src/lib/content/get-projects.ts` as the canonical metadata path; do not add route-local ad hoc metadata builders or inline duplicate SEO objects. [Source: `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:888, `src/lib/seo/get-page-metadata.ts`:1, `src/lib/content/get-projects.ts`:67]
  - [x] Keep launch-page and project metadata human-readable first: titles, descriptions, canonicals, and visible headings must match real page intent and must not drift into keyword stuffing or inflated claims. [Source: `_bmad-output/planning-artifacts/epics.md`:689, `_bmad-output/planning-artifacts/epics.md`:699, `_bmad-output/planning-artifacts/prd.md`:240, `_bmad-output/planning-artifacts/ux-design-specification.md`:419]
  - [x] If Story 4.2 needs richer project search signals, add them through the normalized `ProjectDiscoverability` or shared SEO helpers rather than scattering fields directly through route files. Keep the route-thin pattern intact. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `_bmad-output/planning-artifacts/architecture.md`:804, `src/pages/projects/[slug].astro`:34, `src/lib/content/get-projects.ts`:125]

- [x] Strengthen project-level structured search signals while preserving the current static-first rendering model (AC: 1, 3)
  - [x] Review `src/lib/seo/get-project-structured-data.ts` and expand it only if needed to better express project meaning for search engines using truthful schema nodes that match the rendered content. Preserve server-rendered JSON-LD through `src/components/seo/StructuredData.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:798, `_bmad-output/planning-artifacts/architecture.md`:1019, `src/lib/seo/get-project-structured-data.ts`:1, `src/components/seo/StructuredData.astro`:1]
  - [x] Preserve build-time HTML discoverability: no client-generated metadata, no hydration-dependent structured data, and no JS-only exposure of project meaning. [Source: `_bmad-output/planning-artifacts/architecture.md`:242, `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/epics.md`:691, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:54]
  - [x] Keep project headings, summaries, and proof structure aligned so metadata and schema describe what users actually see on `src/pages/projects/[slug].astro` and the shared project components. [Source: `_bmad-output/planning-artifacts/epics.md`:691, `_bmad-output/planning-artifacts/prd.md`:276, `src/pages/projects/[slug].astro`:40, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:70]

- [x] Define the future publishing seam as extension-ready, not launch-required (AC: 1, 2)
  - [x] Use the architecture's reserved future-writing boundaries as the guide: `src/content/posts/`, `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`, and `src/lib/content/get-posts.ts` are valid seams, but Story 4.2 must not turn them into a full MVP blog or launch-nav addition unless absolutely required by acceptance criteria. [Source: `_bmad-output/planning-artifacts/architecture.md`:854, `_bmad-output/planning-artifacts/architecture.md`:969, `_bmad-output/planning-artifacts/prd.md`:131]
  - [x] If adding a posts collection/schema seam now, keep it minimal and schema-first so later writing or case-study content can inherit the same discoverability pattern without redefining the site architecture. Do not implement publishing workflows, CMS behavior, feeds, or non-MVP routes beyond what is necessary to prove extension readiness. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:817, `_bmad-output/planning-artifacts/epics.md`:694]
  - [x] Keep future writing out of launch navigation and preserve the existing launch IA centered on Home, Projects, Resume, and Contact. Tests already guard this boundary and should keep doing so. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:201, `src/config/navigation.ts`:1, `tests/story-1-4-navigation.test.mjs`]

- [x] Keep content ownership and naming consistent across collections and metadata fields (AC: 1, 2, 3)
  - [x] Extend `src/content/config.ts` as the single schema-definition boundary if new discoverability fields or a `posts` collection are introduced. Keep field names consistent with the current `camelCase` conventions and avoid parallel schema declarations. [Source: `_bmad-output/planning-artifacts/architecture.md`:453, `_bmad-output/planning-artifacts/architecture.md`:488, `_bmad-output/planning-artifacts/architecture.md`:523, `src/content/config.ts`:56]
  - [x] Reuse stable content concepts where possible (`seoTitle`, `seoDescription`, `canonicalPath`) instead of inventing overlapping names for the same meaning across pages, projects, and future posts. [Source: `_bmad-output/planning-artifacts/architecture.md`:522, `_bmad-output/planning-artifacts/architecture.md`:612, `src/lib/content/get-projects.ts`:67, `src/content/pages/home.md`:1]
  - [x] Prefer build-time validation and explicit errors when required search/discoverability fields are missing or invalid. Broken content contracts should fail fast instead of silently publishing weak metadata. [Source: `_bmad-output/planning-artifacts/architecture.md`:249, `_bmad-output/planning-artifacts/architecture.md`:570, `_bmad-output/planning-artifacts/architecture.md`:951]

- [x] Add regression coverage for structured search signals and future-publishing boundaries (AC: 1, 2, 3)
  - [x] Follow the repo's current Node-based regression style with `node:test` and built-output assertions. Extend existing tests where appropriate and add a dedicated Story 4.2 test file if the scope merits it. [Source: `package.json`:14, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:1, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:1]
  - [x] Assert that build output remains static-first and crawlable: absolute canonicals, server-rendered JSON-LD, no `client:*` hydration markers for discoverability, and truthful metadata/heading alignment on project pages and any new discoverability seam. [Source: `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:54, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:103]
  - [x] Add scope-protection assertions proving launch navigation still excludes writing/posts/blog routes and that any future seam stays optional rather than becoming a required launch surface. [Source: `_bmad-output/planning-artifacts/epics.md`:692, `_bmad-output/planning-artifacts/ux-design-specification.md`:201, `tests/story-1-4-navigation.test.mjs`]
  - [x] Validate with `npm run check`, `npm test`, and `npm run build`, then inspect the relevant `dist/` HTML to confirm search-facing signals are present in emitted output rather than only in source files. [Source: `package.json`:8, `_bmad-output/planning-artifacts/architecture.md`:950]

## Dev Notes

### Developer Context

- Story 4.2 is the follow-on to Story 4.1, not a restart. Story 4.1 already established shared metadata, canonical URLs, a repository-owned social image, `robots.txt`, and homepage/project JSON-LD. Story 4.2 should build on those seams to make project discoverability richer and future publishing structurally ready without expanding MVP scope into a live blog or content platform. [Source: `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`:50, `_bmad-output/planning-artifacts/epics.md`:679]
- The repo is already strongly static-first: `astro.config.mjs` sets a canonical production site and static output, routes are thin, project content is schema-backed, and discoverability is partially centralized in shared helper layers. The main opportunity is consistency and extension readiness, not introducing a new SEO architecture. [Source: `astro.config.mjs`:4, `_bmad-output/planning-artifacts/architecture.md`:74, `_bmad-output/planning-artifacts/architecture.md`:783]
- Real future-writing seams do not exist yet in code even though the architecture reserves them. Story 4.2 may define or minimally scaffold those seams, but it should not deliver launch navigation, CMS workflows, or a full writing section unless the change is narrowly required to satisfy extension readiness. [Source: `_bmad-output/planning-artifacts/architecture.md`:854, `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/ux-design-specification.md`:201]
- Existing project discoverability is strongest in `src/lib/content/get-projects.ts` and `src/lib/seo/get-project-structured-data.ts`. Treat those as the canonical places to normalize project search signals so routes continue to read shaped data rather than assemble SEO details inline. [Source: `src/lib/content/get-projects.ts`:148, `src/lib/seo/get-project-structured-data.ts`:11, `_bmad-output/planning-artifacts/architecture.md`:804]

### Technical Requirements

- Keep page meaning and discoverability in server-rendered HTML. No client-generated metadata, no runtime-only structured data, and no discoverability that depends on hydration or interactive islands. [Source: `_bmad-output/planning-artifacts/epics.md`:691, `_bmad-output/planning-artifacts/architecture.md`:291]
- Ensure each launch page and project page retains a meaningful title, description, canonical path, and visible heading structure aligned to its actual content. If new metadata fields are introduced, they must remain truthful to the rendered page and not overpromise future scope. [Source: `_bmad-output/planning-artifacts/epics.md`:689, `_bmad-output/planning-artifacts/prd.md`:276]
- Future writing/case-study discoverability must stay extension-ready rather than launch-required. The architecture supports future `posts` seams, but MVP scope still excludes blog infrastructure and broader publishing systems. [Source: `_bmad-output/planning-artifacts/epics.md`:692, `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/prd.md`:300]
- Search-oriented content must remain readable to humans first. Avoid keyword stuffing, misleading role inflation, generic SEO boilerplate, or schema that describes content the page does not actually expose. [Source: `_bmad-output/planning-artifacts/epics.md`:699, `_bmad-output/planning-artifacts/prd.md`:277, `_bmad-output/planning-artifacts/ux-design-specification.md`:68]
- Preserve long-term ownership: any discoverability improvements should stay repository-owned, schema-backed, and compatible with the current content-first maintenance model. [Source: `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/prd.md`:213]

### Architecture Compliance

- `src/content/config.ts` remains the single schema boundary. If new fields or a `posts` collection are needed, define them there instead of spreading schema logic across routes or utilities. [Source: `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:56]
- `src/lib/content/` remains the canonical read layer for content collections and normalized content contracts. Any future `get-posts.ts` helper should mirror the `get-projects.ts` pattern instead of bypassing it. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:858, `src/lib/content/get-projects.ts`:148]
- `src/lib/seo/` remains the canonical metadata-building layer and `src/components/seo/` remains the rendering boundary. Do not hand-roll route-local metadata generation or inline JSON-LD outside those seams. [Source: `_bmad-output/planning-artifacts/architecture.md`:798, `_bmad-output/planning-artifacts/architecture.md`:805, `src/components/seo/StructuredData.astro`:1]
- Keep route files thin. `src/pages/index.astro` and `src/pages/projects/[slug].astro` should continue consuming normalized metadata and structured-data helpers rather than becoming the place where discoverability logic is invented. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/index.astro`:33, `src/pages/projects/[slug].astro`:31]
- Preserve the launch navigation boundary in `src/config/navigation.ts`. The current navigation model intentionally limits launch routes to Home, Projects, Resume, and Contact. [Source: `src/config/navigation.ts`:1, `_bmad-output/planning-artifacts/ux-design-specification.md`:419]
- Keep build-time validation as the enforcement mechanism. Missing required fields or invalid structured discoverability contracts should stop the build instead of silently degrading. [Source: `_bmad-output/planning-artifacts/architecture.md`:249, `_bmad-output/planning-artifacts/architecture.md`:576]

### Library / Framework Requirements

- Implement against the repo's current stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 4.2 does not justify framework or tooling upgrades. [Source: `package.json`:16]
- Latest stable versions reviewed during story creation are `astro@6.0.5`, `tailwindcss@4.2.1`, `zod@4.3.6`, and `wrangler@4.74.0`. Keep implementation compatible with the current pinned repo versions unless upgrade work is explicitly scoped separately. [Source: npm package registry reviewed 2026-03-17, `package.json`:16]
- Continue using Astro content collections plus Zod for canonical content modeling. If future publishing needs a new collection, use the same collection/schema pattern already used for `pages` and `projects`. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `src/content/config.ts`:56]

### File Structure Requirements

- Current shared metadata boundaries: `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, and `src/layouts/BaseLayout.astro`. Extend these before creating any new metadata registry. [Source: `src/lib/seo/get-page-metadata.ts`:1, `src/lib/seo/site-metadata.ts`:1, `src/layouts/BaseLayout.astro`:1]
- Current project discoverability boundaries: `src/content/projects/*.md`, `src/lib/content/get-projects.ts`, `src/pages/projects/[slug].astro`, and `src/lib/seo/get-project-structured-data.ts`. These files own project search-signal shaping today. [Source: `src/lib/content/get-projects.ts`:125, `src/pages/projects/[slug].astro`:1, `src/lib/seo/get-project-structured-data.ts`:1]
- If Story 4.2 introduces the future-writing seam, the architecture-approved locations are `src/content/posts/`, `src/lib/content/get-posts.ts`, `src/pages/posts/index.astro`, and `src/pages/posts/[slug].astro`. Only add what is necessary to prove extension readiness. [Source: `_bmad-output/planning-artifacts/architecture.md`:854]
- Preserve the launch navigation boundary in `src/config/navigation.ts`; do not add posts/writing/blog labels there for this story. [Source: `src/config/navigation.ts`:6, `tests/story-1-4-navigation.test.mjs`]
- Testing should stay under `tests/` using the existing Node-based regression pattern. A dedicated file such as `tests/story-4-2-structured-search-signals.test.mjs` is appropriate if scope extends beyond a small assertion update. [Source: `_bmad-output/planning-artifacts/architecture.md`:928, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:1]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:8]
- Follow the Story 4.1 built-output test pattern to confirm metadata and structured data are present in `dist/` HTML, not just in source code. [Source: `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:54]
- Follow the Story 2.3 pattern for canonical project contracts: preview, detail, and discoverability should remain explicit and reusable for future entries. [Source: `tests/story-2-3-project-structure-and-discoverability.test.mjs`:23]
- Add assertions that any future-post seam stays optional and that launch navigation still excludes writing/blog/posts so MVP scope remains intact. [Source: `_bmad-output/planning-artifacts/epics.md`:692, `tests/story-1-4-navigation.test.mjs`]
- If project structured data is expanded, assert that JSON-LD remains server-rendered, escaped safely, and aligned with real project titles/descriptions. [Source: `tests/story-2-3-project-structure-and-discoverability.test.mjs`:103, `src/components/seo/StructuredData.astro`:7]

### Previous Story Intelligence

- Story 4.1 already solved the broad crawlability baseline: shared layout metadata, canonical coverage for launch routes, homepage structured data, and `robots.txt`. Reuse those seams rather than rebuilding them. [Source: `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`:50]
- The main 4.1 implementation pattern was to shape data in shared helpers and schemas first, then let routes consume normalized metadata. Story 4.2 should follow that same approach for richer project discoverability and any future-post seam. [Source: `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`:142]
- 4.1 explicitly protected scope by excluding future publishing, CMS, analytics, and broader discoverability systems. Story 4.2 may touch future-writing seams, but it still needs the same discipline: add only the minimum structure needed for extension readiness. [Source: `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`:165]
- The repo already has a partial duplication risk in shared social-image constants between `src/lib/seo/get-page-metadata.ts` and `src/lib/seo/site-metadata.ts`. Be careful not to deepen metadata drift while adding new discoverability features. [Source: repo analysis during story creation, `src/lib/seo/get-page-metadata.ts`:19, `src/lib/seo/site-metadata.ts`:3]

### Git Intelligence Summary

- Recent commits continue a story-scoped pattern: `Complete story 4.1 metadata rollout`, `Mark completed epics done`, `Clarify contact fallback guidance`, `Complete contact pathway review fixes`, and `Mark story 3.2 done`. Story 4.2 should stay similarly surgical instead of mixing broad refactors with discoverability work. [Source: `git log --oneline -5` reviewed 2026-03-17]
- The latest work on the branch already focused on metadata ownership and SEO rollout. That means Story 4.2 should prefer incremental extension of accepted seams over another broad pass across unrelated pages. [Source: `git log --oneline -5` reviewed 2026-03-17]

### Latest Tech Information

- `astro` latest stable: `6.0.5`; repo currently uses `^5.18.0`. Story 4.2 should use the existing Astro 5 route/layout/content-collection patterns already proven in the repo. [Source: npm package registry reviewed 2026-03-17, `package.json`:18]
- `zod` latest stable: `4.3.6`; matches the repo. Schema extensions for future discoverability should stay in the current Zod 4 content-collection pattern. [Source: npm package registry reviewed 2026-03-17, `package.json`:20]
- `tailwindcss` latest stable: `4.2.1`; matches the repo. Story 4.2 is not a styling-system change. [Source: npm package registry reviewed 2026-03-17, `package.json`:19]
- `wrangler` latest stable: `4.74.0`; repo currently uses `^4.73.0`. No deployment-tooling changes are required for this story. [Source: npm package registry reviewed 2026-03-17, `package.json`:24]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story file, git history, and the real codebase implementation.

### Story Completion Status

- Status: `done`
- Completion note: Story 4.2 implementation and review fixes are complete, with shared discoverability extended to project pages and a dormant future-posts route seam validated without entering launch navigation.

### Project Structure Notes

- The architecture document's future-post paths are aspirational but valid seams; they are not present in the real repo yet. Story 4.2 should respect those intended locations without assuming they already exist. [Source: `_bmad-output/planning-artifacts/architecture.md`:854]
- The real repo uses `BaseLayout.astro` rather than the architecture document's `MainLayout.astro` naming. Follow the actual codebase, not the aspirational label. [Source: `src/layouts/BaseLayout.astro`:1, `_bmad-output/planning-artifacts/architecture.md`:692]
- `src/lib/content/get-projects.ts` already exposes a dedicated `discoverability` contract, which is the strongest current pattern for reusable search signals. Future content types should mirror that normalization approach. [Source: `src/lib/content/get-projects.ts`:67]
- `src/config/navigation.ts` is intentionally narrow and typed to launch routes only. This is a useful hard boundary against accidental writing/blog scope creep. [Source: `src/config/navigation.ts`:1]
- The architecture document mixes `Cloudflare Pages` hosting decisions with older `S3`/`CloudFront` references later in the file. For Story 4.2, that discrepancy is irrelevant to implementation; follow the real current repo and existing deploy scripts, not the stale infrastructure wording. [Source: `_bmad-output/planning-artifacts/architecture.md`:319, `_bmad-output/planning-artifacts/architecture.md`:957, `package.json`:10]

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 4.2 requirements, Epic 4 scope, and human-first discoverability constraints
- `_bmad-output/planning-artifacts/prd.md` - strategic SEO goals, future-writing scope boundary, and static-first product intent
- `_bmad-output/planning-artifacts/architecture.md` - schema boundaries, future posts seams, SEO/helper ownership, and build-time validation rules
- `_bmad-output/planning-artifacts/ux-design-specification.md` - launch navigation scope, trust-first content behavior, and anti-pattern warnings
- `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md` - previous story learnings and accepted SEO implementation seams
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `astro.config.mjs`, `package.json`, `src/content/config.ts`, `src/content/pages/home.md`, `src/content/projects/*.md`, `src/lib/content/get-projects.ts`, `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, `src/lib/seo/get-project-structured-data.ts`, `src/components/seo/StructuredData.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/projects/[slug].astro`, `src/config/navigation.ts`, and existing `tests/` files - real implementation baseline for Story 4.2
- npm package registry pages for `astro`, `zod`, `tailwindcss`, and `wrangler` reviewed on 2026-03-17

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target auto-discovered from `_bmad-output/implementation-artifacts/sprint-status.yaml` as `4-2-structured-search-signals-for-projects-and-future-publishing`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and previous story file `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`.
- Repo analysis for Story 4.2 current-state discovery was delegated to an explore subagent and then reconciled with direct file reads of current SEO, content, route, and test seams.
- Additional repo files reviewed directly: `package.json`, `astro.config.mjs`, `src/content/config.ts`, `src/content/pages/home.md`, `src/content/projects/portfolio-refresh.md`, `src/content/projects/team-dashboard-modernization.md`, `src/lib/content/get-projects.ts`, `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, `src/lib/seo/get-project-structured-data.ts`, `src/components/seo/StructuredData.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/projects/[slug].astro`, `src/config/navigation.ts`, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`, and `tests/story-2-3-project-structure-and-discoverability.test.mjs`.
- Git intelligence gathered from `git log --oneline -5` on 2026-03-17.
- Web research gathered from the npm package registry for `astro`, `zod`, `tailwindcss`, and `wrangler` on 2026-03-17.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Implemented Story 4.2 with a red-green-refactor pass centered on shared metadata helpers, project discoverability normalization, richer project JSON-LD, and a minimal future-posts seam.
- Added `tests/story-4-2-structured-search-signals.test.mjs`, confirmed the new assertions failed before implementation, then re-ran `npm run check`, `npm test`, and `npm run build` successfully.
- Inspected built HTML in `dist/projects/portfolio-refresh/index.html`, `dist/projects/team-dashboard-modernization/index.html`, and `dist/projects/index.html` to verify absolute canonicals, server-rendered JSON-LD, and heading-aligned discoverability output.

### Implementation Plan

- Extend the existing shared SEO helper rather than creating a second metadata system, and route project-page metadata through the normalized `discoverability` contract.
- Enrich project structured data only with truthful nodes derived from rendered content, keeping everything server-rendered through the existing `StructuredData.astro` boundary.
- Add the minimum future-posts seam in the content schema and read layer without introducing launch navigation or live posts routes.
- Protect the behavior with a dedicated Story 4.2 regression test plus full repo validation.

### Completion Notes List

- Story context created for `4-2-structured-search-signals-for-projects-and-future-publishing` with implementation guardrails tailored to the current Astro SEO/content architecture.
- Analysis confirms Story 4.2 should extend the accepted Story 4.1 metadata seams rather than invent a second SEO system.
- The story explicitly protects MVP scope by treating future writing/posts as extension-ready seams rather than launch-required features.
- The story highlights the strongest implementation seam for project discoverability: normalize data in `src/lib/content/get-projects.ts` and shared SEO helpers, then let routes consume that shaped data.
- The story adds anti-pattern prevention around keyword stuffing, misleading schema, route-local metadata duplication, and accidental writing/blog navigation expansion.
- Manual checklist validation confirmed the story includes business context, architecture rules, previous-story learnings, testing guidance, anti-pattern prevention, and latest-version notes relevant to implementation.
- Added `createMetadataFromDiscoverability` and reused shared social-image constants so launch pages and project pages continue through one repository-owned metadata path.
- Extended `ProjectDiscoverability` with explicit metadata shape, updated the project detail route to consume that shared helper, and kept headings and descriptions aligned to visible page content.
- Expanded project JSON-LD with a truthful `CreativeWork` node, author attribution, and `about` cues derived from real project relevance data while preserving server-rendered static output.
- Added a minimal future-posts seam in `src/content/config.ts`, `src/content/posts/.gitkeep`, and `src/lib/content/get-posts.ts` without introducing launch navigation or built posts routes.
- Added `tests/story-4-2-structured-search-signals.test.mjs` and passed `npm run check`, `npm test`, and `npm run build`; inspected emitted `dist/` HTML to confirm search-facing signals exist in build output.
- Applied code-review fixes by adding draft-aware future-post content and reserved posts routes, broadening regression coverage across all project detail pages, removing the leftover legacy canonical prop from the project route, and reconciling story status tracking.

### File List

- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`
- `src/content/config.ts`
- `src/content/posts/.gitkeep`
- `src/content/posts/future-writing-seam.md`
- `src/lib/content/get-posts.ts`
- `src/lib/content/get-projects.ts`
- `src/lib/seo/get-page-metadata.ts`
- `src/lib/seo/get-project-structured-data.ts`
- `src/lib/seo/site-metadata.ts`
- `src/pages/posts/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/projects/[slug].astro`
- `tests/story-4-2-structured-search-signals.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-17
- Outcome: Approve
- Summary: Review found one partial AC implementation plus three medium issues around validation noise, regression breadth, and story-state consistency. Follow-up fixes added draft-aware post seams and reserved post routes, expanded project-page assertions, removed a leftover legacy metadata prop, updated the story status to `done`, and synced supporting notes.
- Fixed Issues:
  - [high] Added the reserved future publishing route seam in `src/pages/posts/index.astro` and `src/pages/posts/[slug].astro`, both wired to the shared discoverability contract.
  - [medium] Removed empty-collection warning noise by adding a draft placeholder entry at `src/content/posts/future-writing-seam.md` and filtering drafts in `src/lib/content/get-posts.ts`.
  - [medium] Expanded Story 4.2 regression coverage so project-page metadata and heading alignment are checked across both current project detail pages in `tests/story-4-2-structured-search-signals.test.mjs`.
  - [medium] Reconciled inconsistent story-state notes and completion status in this story file.
  - [low] Removed the redundant legacy `canonicalPath` prop from `src/pages/projects/[slug].astro`.

## Change Log

- 2026-03-17: Extended the shared discoverability contract, enriched project structured data, added a minimal future-posts seam, and added Story 4.2 regression coverage after full validation.
- 2026-03-17: Completed code-review fixes for Story 4.2, added draft-aware posts route seams, expanded regression coverage, reconciled story status notes, and approved the story.
