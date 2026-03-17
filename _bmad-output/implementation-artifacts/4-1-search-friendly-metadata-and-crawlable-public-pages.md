# Story 4.1: Search-Friendly Metadata and Crawlable Public Pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a search engine or external visitor,
I want the site's primary pages to expose crawlable content and clear metadata,
so that Chris's professional identity and work can be discovered through search and sharing.

## Acceptance Criteria

1. Given a search engine crawls the site's primary public pages, when it reads the rendered output, then the core page meaning is available in the HTML response, and the site does not depend on client-side execution to expose its main identity and project content.
2. Given the home page, project pages, and other launch pages are published, when metadata is generated, then each page includes relevant titles and descriptions aligned to its content, and the metadata supports name-based discovery and basic social sharing clarity.
3. Given public pages are linked through the site's navigation and internal structure, when search engines or visitors move through them, then the pages are discoverable through normal crawlable links, and primary destinations are not hidden behind non-standard interaction patterns.

## Tasks / Subtasks

- [x] Establish a shared SEO metadata path for all launch routes without breaking the static-first architecture (AC: 1, 2)
  - [x] Extend the existing shared head/rendering path around `src/layouts/BaseLayout.astro` so homepage, projects index, project detail, resume, and contact routes can all emit consistent title, description, and canonical metadata without duplicating head logic across route files. [Source: `_bmad-output/planning-artifacts/architecture.md`:795, `_bmad-output/planning-artifacts/architecture.md`:805, `src/layouts/BaseLayout.astro`:5]
  - [x] Normalize launch-page metadata so every public route has content-aligned page titles and descriptions that remain human-readable first, while still supporting name-based discovery and basic sharing previews. Reuse current route data and content collection fields before adding new config. [Source: `_bmad-output/planning-artifacts/epics.md`:669, `_bmad-output/planning-artifacts/prd.md`:272, `src/pages/index.astro`:18, `src/pages/projects/index.astro`:11, `src/pages/resume.astro`:37, `src/pages/contact.astro`:7]
  - [x] Close the current canonical-path gap by ensuring routes that are already public and crawlable also emit canonical URLs through the shared layout contract, especially the homepage and contact page which currently omit `canonicalPath`. [Source: `src/layouts/BaseLayout.astro`:11, `src/pages/index.astro`:32, `src/pages/contact.astro`:7]

- [x] Add bounded search-and-sharing foundations in the approved SEO layer (AC: 2)
  - [x] Reuse `src/components/seo/StructuredData.astro` for any new JSON-LD needed by Story 4.1 instead of hand-writing inline scripts in route files. If new schema is added, keep it narrowly focused on launch-page discoverability rather than future publishing scope. [Source: `_bmad-output/planning-artifacts/architecture.md`:798, `src/components/seo/StructuredData.astro`:1]
  - [x] If metadata generation needs shaping helpers, place them under `src/lib/seo/` to match the current project detail pattern instead of scattering ad hoc string builders through route files. [Source: `_bmad-output/planning-artifacts/architecture.md`:805, `src/lib/seo/get-project-structured-data.ts`:1]
  - [x] Add only the minimal static assets or public crawlability files justified by this story, such as `public/robots.txt` and basic sharing-image support, without turning Story 4.1 into a full future-publishing or advanced schema project. [Source: `_bmad-output/planning-artifacts/architecture.md`:852, `_bmad-output/planning-artifacts/prd.md`:129, `_bmad-output/planning-artifacts/epics.md`:679]

- [x] Preserve crawlable HTML and normal-link discovery across the existing evaluation journey (AC: 1, 3)
  - [x] Keep all launch pages server-rendered and readable without JavaScript; do not introduce client-side metadata generation, runtime-only page meaning, or interaction-dependent discoverability. [Source: `_bmad-output/planning-artifacts/epics.md`:664, `_bmad-output/planning-artifacts/architecture.md`:242, `_bmad-output/planning-artifacts/architecture.md`:553]
  - [x] Reuse the canonical route graph in `src/config/navigation.ts` and the existing plain-anchor journey/navigation components so search engines and visitors can continue moving through Home, Projects, Resume, and Contact via ordinary links. [Source: `_bmad-output/planning-artifacts/architecture.md`:823, `_bmad-output/planning-artifacts/architecture.md`:885, `src/config/navigation.ts`:1, `src/pages/index.astro`:47]
  - [x] Keep Story 4.1 scoped to launch pages and current project entries. Do not implement the reserved posts routes, CMS workflows, analytics hooks, or broader future discoverability systems in this story. [Source: `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/architecture.md`:854, `_bmad-output/planning-artifacts/epics.md`:692]

- [x] Keep metadata and content ownership aligned with the source-controlled content model (AC: 1, 2)
  - [x] Prefer schema-backed metadata fields and existing content helpers over hardcoded per-page strings when reuse will improve consistency, especially for projects and any repeated page metadata concepts. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:517, `src/content/config.ts`:56, `src/lib/content/get-projects.ts`:67]
  - [x] Preserve build-time validation as the guardrail: invalid required metadata or broken content contracts should fail the build instead of silently shipping weak or misleading discoverability output. [Source: `_bmad-output/planning-artifacts/architecture.md`:249, `_bmad-output/planning-artifacts/architecture.md`:570]
  - [x] Keep wording direct, honest, and aligned to the actual rendered page content. Avoid keyword stuffing, misleading role inflation, or generic marketing metadata that weakens trust. [Source: `_bmad-output/planning-artifacts/epics.md`:699, `_bmad-output/planning-artifacts/ux-design-specification.md`:141]

- [x] Add regression coverage for emitted metadata, crawlability, and static output expectations (AC: 1, 2, 3)
  - [x] Extend the existing Node-based built-output tests to verify title, description, canonical, and any new static SEO signals for each primary public page in `dist/`. Follow the current repo test style instead of introducing a new browser-only test stack. [Source: `package.json`:14, `tests/story-2-1-projects-index.test.mjs`, `tests/story-2-3-project-structure-and-discoverability.test.mjs`]
  - [x] Add assertions proving core page meaning and internal navigation remain present in server-rendered HTML without depending on `client:*` hydration for launch-page discoverability. [Source: `_bmad-output/planning-artifacts/epics.md`:666, `_bmad-output/planning-artifacts/architecture.md`:291]
  - [x] Validate the repo with `npm run check`, `npm test`, and `npm run build`, then manually sanity-check page source/share-preview-critical pages for homepage, projects, resume, and contact. [Source: `package.json`:8, `_bmad-output/planning-artifacts/prd.md`:240]

## Dev Notes

### Developer Context

- Story 4.1 is the MVP discoverability foundation, not a publishing expansion. Its job is to make the existing launch pages legible to search engines and sharers while preserving the same calm, trustworthy evaluator journey already built in Epics 1-3. [Source: `_bmad-output/planning-artifacts/epics.md`:654, `_bmad-output/planning-artifacts/prd.md`:272]
- The current repo already has strong crawlability fundamentals: Astro static output, route-thin pages, semantic page structure, plain anchor navigation, and project detail structured data. The biggest gaps are consistency gaps, not foundation gaps. [Source: `astro.config.mjs`, `src/pages/projects/[slug].astro`:10, `src/config/navigation.ts`:6]
- Current implementation is most mature on project pages. `src/pages/projects/[slug].astro` already uses canonical metadata and JSON-LD, while the homepage and contact page currently omit canonical URLs and the site has no `public/robots.txt` yet. [Source: `src/pages/projects/[slug].astro`:34, `src/pages/index.astro`:32, `src/pages/contact.astro`:7]
- Story 4.1 should strengthen the shared SEO path the repo already hints at, not invent a second metadata system or overbuild future writing/discoverability capabilities that belong to Story 4.2 or post-MVP work. [Source: `_bmad-output/planning-artifacts/epics.md`:679, `_bmad-output/planning-artifacts/prd.md`:110]

### Technical Requirements

- Keep the implementation static-first and HTML-first. Core identity, project meaning, and page discoverability must be available in server-rendered HTML without client-side execution. [Source: `_bmad-output/planning-artifacts/epics.md`:664, `_bmad-output/planning-artifacts/architecture.md`:74]
- Ensure every launch route emits truthful, content-aligned page metadata. Titles and descriptions should support Chris Fahey name discovery and professional clarity without becoming SEO spam. [Source: `_bmad-output/planning-artifacts/epics.md`:671, `_bmad-output/planning-artifacts/prd.md`:274]
- Preserve normal internal crawlability with standard links across Home, Projects, Resume, and Contact. Do not hide primary destinations behind non-standard interactions, menu state, or JS-only pathways. [Source: `_bmad-output/planning-artifacts/epics.md`:674, `_bmad-output/planning-artifacts/ux-design-specification.md`:49]
- If new structured data is added, keep it narrowly scoped to launch discoverability and basic sharing clarity. Do not expand into a broad schema program or future-posts implementation. [Source: `_bmad-output/planning-artifacts/epics.md`:689, `_bmad-output/planning-artifacts/prd.md`:131]
- Any missing static discoverability assets such as `robots.txt` should remain simple, repository-owned, and compatible with the current deployment model. [Source: `_bmad-output/planning-artifacts/architecture.md`:667, `_bmad-output/planning-artifacts/prd.md`:418]

### Architecture Compliance

- Keep route files thin and use the approved boundaries: `src/components/seo/` owns SEO rendering helpers/components, `src/lib/seo/` owns metadata-building helpers, and `src/lib/content/` remains the canonical read layer for structured content. [Source: `_bmad-output/planning-artifacts/architecture.md`:798, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:804]
- Reuse `BaseLayout.astro` as the shared document shell instead of duplicating `<head>` tags and metadata decisions across route files. [Source: `src/layouts/BaseLayout.astro`:20]
- Keep metadata conventions aligned with the source-controlled content model. Repeated metadata concepts should live in content schemas or shared helpers rather than route-local duplication. [Source: `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/architecture.md`:523, `src/content/config.ts`:56]
- Preserve hydration-by-exception. Story 4.1 should not introduce islands or client runtime just to set metadata, expose links, or surface crawlability signals. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553]
- Favor build-time failure for broken required metadata or schema mismatches over shipping invalid discoverability output. [Source: `_bmad-output/planning-artifacts/architecture.md`:249, `_bmad-output/planning-artifacts/architecture.md`:570]

### Library / Framework Requirements

- Implement against the repo's current validated stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 4.1 does not justify dependency upgrades. [Source: `package.json`:16]
- Latest stable versions reviewed during story creation are `astro@6.0.5`, `tailwindcss@4.2.1`, `zod@4.3.6`, and `wrangler@4.74.0`. Keep the repo on current pinned versions unless upgrade work is explicitly scoped separately. [Source: npm package registry reviewed 2026-03-17, `package.json`:16]
- Current Astro guidance still aligns with content collections plus static assets in `public/`, which supports keeping discoverability work in the existing static-first architecture rather than adding runtime SEO tooling. [Source: Astro package/docs review 2026-03-17]

### File Structure Requirements

- Shared layout touchpoint: `src/layouts/BaseLayout.astro` for title, description, canonical, and additional head-slot SEO output. [Source: `src/layouts/BaseLayout.astro`:5]
- Shared SEO touchpoints: `src/components/seo/StructuredData.astro` and `src/lib/seo/get-project-structured-data.ts`; add new shared SEO code beside these instead of creating parallel helpers elsewhere. [Source: `src/components/seo/StructuredData.astro`:1, `src/lib/seo/get-project-structured-data.ts`:1]
- Route touchpoints: `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. These are the launch pages Story 4.1 must cover. [Source: `src/pages/`]
- Content/model touchpoints: `src/content/config.ts`, `src/content/pages/home.md`, and `src/lib/content/get-projects.ts`. Reuse these before inventing a second metadata registry. [Source: `src/content/config.ts`:56, `src/lib/content/get-projects.ts`:148]
- Navigation/crawlability touchpoints: `src/config/navigation.ts`, `src/components/navigation/`, and `src/components/journey/JourneyNextStep.astro`. Keep primary discovery paths aligned with the existing route graph. [Source: `src/config/navigation.ts`:6, `src/pages/index.astro`:47]
- Static asset/public touchpoints: `public/robots.txt` and any bounded sharing-image assets that Story 4.1 truly needs. Keep them simple and source-controlled. [Source: `_bmad-output/planning-artifacts/architecture.md`:667, `_bmad-output/planning-artifacts/architecture.md`:852]
- Testing touchpoints: existing Node-based built-output tests under `tests/`, especially story tests covering navigation, project discoverability, resume access, and guided evaluation paths. [Source: `tests/`]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:8]
- Add or extend built-output tests to verify each primary public page emits the expected title, meta description, and canonical URL, and that any new static SEO artifacts are present in build output. [Source: `_bmad-output/planning-artifacts/epics.md`:669, `tests/story-2-1-projects-index.test.mjs`]
- Verify core meaning and internal links remain visible in emitted HTML so crawlers do not depend on runtime behavior for primary discovery. [Source: `_bmad-output/planning-artifacts/epics.md`:666, `tests/story-1-4-navigation.test.mjs`]
- Preserve the existing static-first regression style: inspect generated `dist/` HTML and assets rather than relying only on manual browser checks. [Source: `_bmad-output/planning-artifacts/architecture.md`:950]
- Manual QA should include view-source/no-JS sanity checks and basic share-preview sanity for homepage, project pages, resume, and contact. [Source: `_bmad-output/planning-artifacts/prd.md`:236]

### Git Intelligence Summary

- Recent commits show focused, story-sized changes rather than broad refactors: `Mark completed epics done`, `Clarify contact fallback guidance`, `Complete contact pathway review fixes`, `Mark story 3.2 done`, and `Strengthen evaluation journey handoffs`. Story 4.1 should follow the same surgical pattern. [Source: `git log --oneline -5` reviewed 2026-03-17]
- The current repo already reflects accepted work on resume, contact, journey handoffs, and project discoverability. Story 4.1 should build on those working seams rather than rewriting route structure. [Source: `git log --oneline -5` reviewed 2026-03-17]

### Latest Tech Information

- `astro` latest stable: `6.0.5`; repo currently uses `^5.18.0`. Use the current Astro 5 patterns already present in the codebase for route/layout/head management. [Source: npm package registry reviewed 2026-03-17, `package.json`:18]
- `tailwindcss` latest stable: `4.2.1`; matches the repo. No styling-tooling changes are needed for this story. [Source: npm package registry reviewed 2026-03-17, `package.json`:19]
- `zod` latest stable: `4.3.6`; matches the repo. If metadata schema fields expand, keep them compatible with the current collection setup. [Source: npm package registry reviewed 2026-03-17, `package.json`:20]
- `wrangler` latest stable: `4.74.0`; repo currently uses `^4.73.0`. Story 4.1 does not require deployment-tooling changes. [Source: npm package registry reviewed 2026-03-17, `package.json`:23]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, current repo implementation, and current package/platform documentation.

### Story Completion Status

- Status: `done`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The real repo uses `src/layouts/BaseLayout.astro` as the shared shell rather than the architecture template's aspirational `MainLayout.astro` naming. Story 4.1 should follow the real repo structure, not retrofit the aspirational map. [Source: `src/layouts/BaseLayout.astro`:1, `_bmad-output/planning-artifacts/architecture.md`:691]
- The repo already has an approved SEO component boundary (`src/components/seo/`) and a partial SEO helper layer (`src/lib/seo/`). Reuse these actual folders before introducing new abstractions. [Source: `src/components/seo/StructuredData.astro`:1, `src/lib/seo/get-project-structured-data.ts`:1]
- `src/content/config.ts` is already the canonical schema boundary and `src/lib/content/get-projects.ts` already normalizes project discoverability fields. Keep Story 4.1 aligned with those existing content/model seams. [Source: `src/content/config.ts`:137, `src/lib/content/get-projects.ts`:67]
- The route graph is already clean and crawlable through `src/config/navigation.ts` and plain anchors. The main structural gap is missing or inconsistent metadata coverage, not missing pages or missing link architecture. [Source: `src/config/navigation.ts`:6, `src/pages/index.astro`:47]
- No `public/robots.txt` exists yet even though the architecture expects that static boundary. Adding it would align the real repo more closely with the planned structure. [Source: `_bmad-output/planning-artifacts/architecture.md`:667]

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 4.1 requirements, acceptance criteria, and Epic 4 scope
- `_bmad-output/planning-artifacts/prd.md` - SEO strategy, MVP scope limits, and discoverability goals
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, SEO boundaries, content ownership, and testing guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm trust-first UX constraints, normal navigation behavior, and anti-pattern warnings
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `package.json`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/components/seo/StructuredData.astro`, `src/lib/seo/get-project-structured-data.ts`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/config/navigation.ts`, `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, `src/pages/contact.astro`, and existing `tests/` files - actual implementation baseline for Story 4.1
- npm package registry pages for `astro`, `tailwindcss`, `zod`, and `wrangler` reviewed on 2026-03-17

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Implementation Plan

- Centralize launch-page metadata in `src/layouts/BaseLayout.astro` with a shared metadata contract that emits description, canonical, Open Graph, and Twitter summary tags.
- Reuse source-controlled data first by requiring homepage SEO fields in `src/content/pages/home.md` and `src/content/config.ts`, while preserving project metadata through the existing `get-projects` discoverability contract.
- Add bounded discoverability helpers under `src/lib/seo/`, reuse `src/components/seo/StructuredData.astro` for homepage JSON-LD, and add a minimal `public/robots.txt` asset.
- Protect the story with built-output regression tests that verify launch-route metadata, project-detail inheritance, crawlable HTML, and no-JS discoverability expectations.

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `4.1` and resolved to `4-1-search-friendly-metadata-and-crawlable-public-pages` from `_bmad-output/planning-artifacts/epics.md` and `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Repo exploration for Story 4.1 current-state analysis was delegated to subagents and incorporated into this story context.
- Additional repo files reviewed directly: `package.json`, `src/layouts/BaseLayout.astro`, `src/components/seo/StructuredData.astro`, `src/lib/seo/get-project-structured-data.ts`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/config/navigation.ts`, `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`.
- Git intelligence gathered from `git log --oneline -5` on 2026-03-17.
- Web research gathered from the npm package registry for `astro`, `tailwindcss`, `zod`, and `wrangler` on 2026-03-17.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Added failing regression coverage first in `tests/story-4-1-search-metadata-and-crawlability.test.mjs`, then implemented shared metadata, homepage schema updates, homepage JSON-LD, and `public/robots.txt` until the new and existing suites passed.
- Validation completed with `npm run check`, `npm test`, and `npm run build`, followed by built-output source inspection for homepage, projects, project detail, resume, contact, and `dist/robots.txt`.

### Completion Notes List

- Story context created for `4-1-search-friendly-metadata-and-crawlable-public-pages` with implementation guardrails tailored to the current Astro codebase and existing SEO seams.
- Analysis confirmed the site already has strong static crawlability fundamentals; the main work is consistent shared metadata coverage, canonical coverage, and bounded static SEO assets.
- The story explicitly protects scope by keeping future publishing, CMS, analytics, and advanced discoverability systems out of Story 4.1.
- The story reuses the repo's real layout/content/SEO boundaries rather than the architecture document's aspirational file names where they differ.
- Manual checklist validation confirmed the story includes business context, architecture rules, testing guidance, anti-pattern prevention, and latest-version notes relevant to implementation.
- Implemented a shared launch-page metadata path in `src/layouts/BaseLayout.astro` with canonical, Open Graph, and Twitter summary tags while preserving the existing static-first route structure.
- Added schema-backed homepage SEO fields plus `src/lib/seo/get-page-metadata.ts` and `src/lib/seo/get-site-structured-data.ts` so homepage and launch-route metadata stay truthful, reusable, and build-time validated.
- Added homepage WebSite/Person JSON-LD through `src/components/seo/StructuredData.astro` and created `public/robots.txt` as the minimal crawlability asset for this story.
- Added regression coverage in `tests/story-4-1-search-metadata-and-crawlability.test.mjs` and verified `npm run check`, `npm test`, `npm run build`, and built HTML metadata output across homepage, projects, resume, contact, and project detail pages.
- Follow-up review fixes centralized launch-route metadata further, added a repository-owned social preview image, and corrected story file tracking details.

### File List

- `_bmad-output/implementation-artifacts/4-1-search-friendly-metadata-and-crawlable-public-pages.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `public/robots.txt`
- `public/images/share/site-preview.svg`
- `src/content/config.ts`
- `src/content/pages/home.md`
- `src/layouts/BaseLayout.astro`
- `src/lib/seo/get-page-metadata.ts`
- `src/lib/seo/site-metadata.ts`
- `src/lib/seo/get-site-structured-data.ts`
- `src/pages/contact.astro`
- `src/pages/index.astro`
- `src/pages/projects/index.astro`
- `src/pages/resume.astro`
- `tests/story-4-1-search-metadata-and-crawlability.test.mjs`

### Change Log

- 2026-03-17: Implemented shared launch-page metadata, homepage SEO schema and structured data, crawlability asset coverage, and built-output regression tests for Story 4.1.
- 2026-03-17: Applied code-review follow-ups for shared launch-route metadata ownership, social preview image tags, and story file-list accuracy.
