# Story 2.3: Structured Project Presentation for Credibility and Discoverability

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor or search engine,
I want project content to follow a consistent, structured presentation pattern,
so that project proof is easier to understand, compare, and discover.

## Acceptance Criteria

1. Given project content is authored for the MVP, when project entries are created or updated, then each entry follows a defined structure for summary, detail, and supporting metadata, and the structure supports both list-page previews and detail-page rendering.
2. Given a visitor compares multiple projects, when they move between entries, then the recurring content pattern makes the proof easier to scan and evaluate, and differences between projects come from the work itself rather than inconsistent formatting.
3. Given search engines crawl project pages, when they read the rendered project content, then the page structure communicates meaningful information about the project topic and purpose, and the content is not dependent on client-side-only rendering to expose core meaning.
4. Given project entries grow over time, when new projects are added, then the same structured pattern can be reused without redesigning the project experience, and future project discoverability is strengthened by consistent content structure.

## Tasks / Subtasks

- [x] Formalize one canonical project presentation contract that covers preview content, detail content, and discoverability metadata without creating a second data path (AC: 1, 4)
  - [x] Review `src/content/config.ts` and `src/lib/content/get-projects.ts` together, then tighten the project schema and normalized helper output around one explicit recurring pattern for list previews, detail-page proof, and supporting metadata. Preserve the existing Astro content collection as the canonical source of truth rather than introducing JSON sidecars, route-local objects, or duplicated SEO config. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:493, `src/content/config.ts`:55, `src/lib/content/get-projects.ts`:15]
  - [x] Keep the content model intentionally small and truthful. Add discoverability-oriented fields only if they map to real page facts the site can render consistently, such as stable slug/canonical data, representative image metadata, or publish/update fields; do not invent marketing metadata or article-style fields that the page does not actually support. [Source: `_bmad-output/planning-artifacts/prd.md`:240, `_bmad-output/planning-artifacts/architecture.md`:523, Google canonical and structured-data guidance reviewed 2026-03-13]
  - [x] Preserve Story 2.2's substantive proof fields and use Story 2.3 to standardize how they are grouped and consumed, not to throw away the existing evaluator-facing model. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:22, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:180]

- [x] Make the recurring project pattern visible in both the projects index and project detail pages so comparison comes from content, not layout drift (AC: 1, 2, 4)
  - [x] Update `src/components/projects/ProjectIndexList.astro` and `src/components/projects/ProjectDetailPage.astro` so the same core information hierarchy appears predictably across projects: concise summary, context, relevance cues, core proof framing, and dependable next steps. Keep route files thin and continue delegating rendering to shared project components. [Source: `_bmad-output/planning-artifacts/epics.md`:496, `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/ux-design-specification.md`:101, `src/components/projects/ProjectIndexList.astro`:11, `src/components/projects/ProjectDetailPage.astro`:22]
  - [x] Ensure repeated section labels and ordering improve scanability without flattening the individuality of each project. The structure should stay consistent, but the actual proof should still come from project-specific content rather than boilerplate copy. [Source: `_bmad-output/planning-artifacts/epics.md`:498, `_bmad-output/planning-artifacts/prd.md`:86, `_bmad-output/planning-artifacts/ux-design-specification.md`:101]
  - [x] Use shared styles in `src/styles/global.css` for recurring list/detail hierarchy, spacing, and section rhythm instead of letting the project pattern drift into route-local or one-off component styling. [Source: `_bmad-output/planning-artifacts/architecture.md`:474, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:88, `src/styles/global.css`:1]
  - [x] Keep all project proof in rendered HTML and continue avoiding `client:*` hydration for project browsing. Story 2.3 is a structure-and-discoverability story, not an interaction-runtime story. [Source: `_bmad-output/planning-artifacts/epics.md`:503, `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:951, `src/pages/projects/[slug].astro`:31]

- [x] Strengthen discoverability signals for project pages through shared metadata and semantic structure, not SEO theater (AC: 1, 3, 4)
  - [x] Set the production `site` value in `astro.config.mjs` to `https://www.fahey.vip` so canonical URLs can be emitted as absolute URLs instead of path-only fallbacks, then keep canonical generation centralized through `BaseLayout.astro`. Treat `https://www.fahey.vip` as the canonical origin for generated URLs. [Source: user-provided production URL 2026-03-15, `astro.config.mjs`:4, `src/layouts/BaseLayout.astro`:11, Astro config and render-context docs reviewed 2026-03-13, Google canonical guidance reviewed 2026-03-13]
  - [x] Preserve unique project-level `seoTitle` and `seoDescription` values and ensure the rendered project pages expose meaningful headings and page structure in the HTML response. If metadata rules are expanded, do it in shared layout/SEO helpers instead of ad hoc inside individual routes. [Source: `_bmad-output/planning-artifacts/prd.md`:274, `_bmad-output/planning-artifacts/architecture.md`:799, `src/layouts/BaseLayout.astro`:5, `src/pages/projects/[slug].astro`:31]
  - [x] Add structured data only if it accurately matches what the page already presents. A safe baseline is page-oriented structured data such as `WebPage` and `BreadcrumbList`; do not force `Article`/`BlogPosting` markup unless Story 2.3 also adds the real article-style fields those schemas expect. [Source: `_bmad-output/planning-artifacts/epics.md`:501, `_bmad-output/planning-artifacts/architecture.md`:889, Google structured-data guidance reviewed 2026-03-13, Schema.org guidance reviewed 2026-03-13]

- [x] Keep the project presentation pattern extensible for future project growth without spilling into Story 2.4 scope (AC: 4)
  - [x] Shape the schema and reusable rendering so new projects can be added by following the same frontmatter/body contract, with no route redesign and no second formatting system. [Source: `_bmad-output/planning-artifacts/epics.md`:506, `_bmad-output/planning-artifacts/architecture.md`:173, `_bmad-output/planning-artifacts/architecture.md`:873]
  - [x] Do not turn Story 2.3 into richer storytelling or case-study expansion work. Reserve deeper narrative modules, richer media, and post-MVP storytelling seams for Story 2.4. [Source: `_bmad-output/planning-artifacts/epics.md`:511, `_bmad-output/planning-artifacts/prd.md`:117, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:35]

- [x] Add regression coverage for canonical structure, metadata, and static discoverability behavior (AC: 1, 2, 3, 4)
  - [x] Add or extend Node-based tests under `tests/` to assert the canonical project schema, consistent helper normalization, recurring list/detail structure, absolute canonical URLs, and absence of `client:*` hydration on project routes. [Source: `tests/story-2-1-projects-index.test.mjs`:23, `tests/story-2-2-project-detail-pages.test.mjs`:30, `_bmad-output/planning-artifacts/architecture.md`:951]
  - [x] If structured data is added, assert it exists in built project HTML and stays aligned with actual content fields rather than string-matched placeholder markup. [Source: `_bmad-output/planning-artifacts/epics.md`:503, Google structured-data guidance reviewed 2026-03-13]
  - [x] Keep the repo verification baseline by passing `npm run check`, `npm test`, and `npm run build`, then manually review at least two project pages plus the projects index for scanability, canonical output, and semantic page structure. [Source: `package.json`:6, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

## Dev Notes

### Developer Context

- Story 2.3 builds directly on Story 2.1's canonical projects collection and Story 2.2's substantive project proof pages. The system already has a workable projects schema, helper, index route, detail route, and project components; this story should standardize and strengthen that structure rather than replace it. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:102, `src/content/config.ts`:55, `src/lib/content/get-projects.ts`:35]
- The user-facing purpose is evaluator clarity and search readability at the same time. This is not generic SEO work; it is about making project proof easier for people and crawlers to understand through consistent structure, clear headings, and durable metadata. [Source: `_bmad-output/planning-artifacts/prd.md`:47, `_bmad-output/planning-artifacts/prd.md`:240, `_bmad-output/planning-artifacts/epics.md`:483]
- The current implementation already satisfies much of the content-proof requirement, but discoverability is weaker than it should be because canonicals depend on an unset Astro `site`, project metadata is centralized only minimally, and there is no structured-data layer yet. [Source: `astro.config.mjs`:4, `src/layouts/BaseLayout.astro`:13, repo analysis reviewed 2026-03-13]
- The right implementation style is refinement, not reinvention. Story 2.3 should reduce formatting drift and discoverability gaps while keeping the static-first, content-led architecture intact. [Source: `_bmad-output/planning-artifacts/architecture.md`:156, `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:598]

### Technical Requirements

- Keep `src/content/projects/` as the single authored source of truth and continue using Astro content collections plus Zod validation. Do not add a second project metadata registry, JSON export, or route-local duplication just to drive cards or SEO. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:55]
- The same canonical project structure must support both `/projects/` previews and `/projects/[slug]/` detail pages. Any new or renamed fields in the schema must be normalized through `src/lib/content/get-projects.ts` before components consume them. [Source: `_bmad-output/planning-artifacts/epics.md`:494, `_bmad-output/planning-artifacts/architecture.md`:805, `src/lib/content/get-projects.ts`:35]
- Preserve crawlable, server-rendered HTML and static generation for project pages. Search engines and visitors must be able to understand the project's topic and purpose without JavaScript-dependent rendering. [Source: `_bmad-output/planning-artifacts/epics.md`:501, `_bmad-output/planning-artifacts/prd.md`:275, `src/pages/projects/[slug].astro`:8]
- Canonical URLs should be absolute and generated consistently from the shared layout once Astro `site` is configured. Do not hardcode canonical strings in multiple files. [Source: `astro.config.mjs`:4, `src/layouts/BaseLayout.astro`:13, Google canonical guidance reviewed 2026-03-13]
- Use `https://www.fahey.vip` as the canonical production origin for `astro.config.mjs` and derived canonical URLs. Keep redirects or alternate handling for `fahey.vip` outside this story unless already covered elsewhere. [Source: user-provided production URL 2026-03-15]
- If structured data is added, it must describe what the page actually contains and be generated from real project data. Prefer small, accurate schema over broad, speculative markup. [Source: `_bmad-output/planning-artifacts/architecture.md`:889, Google structured-data guidance reviewed 2026-03-13]

### Architecture Compliance

- Keep route files thin. `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro` should keep loading data and composing shared components, while presentation logic stays in `src/components/projects/` and normalization stays in `src/lib/content/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:479, `_bmad-output/planning-artifacts/architecture.md`:887, `src/pages/projects/index.astro`:1, `src/pages/projects/[slug].astro`:1]
- Respect the existing layered structure: authored content in `src/content/`, schemas in `src/content/config.ts`, content access in `src/lib/content/`, shared shell and metadata in `src/layouts/` and `src/components/seo/` or `src/lib/seo/` if those helpers are introduced, and tests under `tests/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:849]
- Keep discoverability logic centralized. If Story 2.3 introduces reusable metadata or JSON-LD helpers, place them in the architecture's canonical SEO boundaries rather than embedding large JSON blobs or SEO helper functions directly inside route files. [Source: `_bmad-output/planning-artifacts/architecture.md`:799, `_bmad-output/planning-artifacts/architecture.md`:850]
- Avoid architecture drift from future features: no CMS work, no client router, no analytics dependency, no external content fetch, and no Story 2.4 storytelling expansion inside this story. [Source: `_bmad-output/planning-artifacts/architecture.md`:134, `_bmad-output/planning-artifacts/prd.md`:131, `_bmad-output/planning-artifacts/epics.md`:511]

### Library / Framework Requirements

- Stay on the current validated stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, and `typescript@^5.9.3`. Story 2.3 does not justify an Astro 6 upgrade or a broader content-system migration. [Source: `package.json`:14, npm registry and Astro release guidance reviewed 2026-03-13]
- Current Astro guidance still supports schema-backed content collections, `getCollection()`, `render(entry)`, and route generation from collection data. Follow the repo's existing pattern unless there is a concrete blocker; do not fold a framework migration into this story. [Source: `src/lib/content/get-projects.ts`:1, `src/pages/projects/[slug].astro`:2, Astro content-collections guidance reviewed 2026-03-13]
- Use shared layout and standards-based head output for metadata. For structured data, prefer JSON-LD generated from typed project data and emitted server-side. [Source: `src/layouts/BaseLayout.astro`:20, Google structured-data guidance reviewed 2026-03-13]
- Do not add a SEO plugin, CMS SDK, client-side schema library, or search package for this story. The current stack already covers static page rendering, typed content, and head metadata. [Source: `_bmad-output/planning-artifacts/architecture.md`:977, `package.json`:14]

### File Structure Requirements

- Required schema touchpoints: `src/content/config.ts` and `src/lib/content/get-projects.ts` for the canonical structure and normalized project output. [Source: `src/content/config.ts`:55, `src/lib/content/get-projects.ts`:15]
- Required authored-content touchpoints: all files under `src/content/projects/` should conform to the same recurring structure once Story 2.3 is complete. At minimum, `src/content/projects/portfolio-refresh.md` and `src/content/projects/team-dashboard-modernization.md` will likely need alignment review. [Source: `src/content/projects/portfolio-refresh.md`:1, `src/content/projects/team-dashboard-modernization.md`:1]
- Required UI touchpoints: `src/components/projects/ProjectIndexList.astro` and `src/components/projects/ProjectDetailPage.astro` for the visible recurring presentation pattern. [Source: `src/components/projects/ProjectIndexList.astro`:11, `src/components/projects/ProjectDetailPage.astro`:22]
- Required shared-style touchpoint: `src/styles/global.css` should continue owning recurring project layout rhythm and cross-page presentation rules so Story 2.3 does not splinter styling into route-local hacks. [Source: `src/styles/global.css`:1, `_bmad-output/planning-artifacts/architecture.md`:474]
- Required route touchpoints: `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro` should preserve their thin-route role while consuming the refined pattern. [Source: `src/pages/projects/index.astro`:1, `src/pages/projects/[slug].astro`:1]
- Required metadata touchpoints: `astro.config.mjs` for `site` and `src/layouts/BaseLayout.astro` for canonical output; if structured-data helpers are introduced, prefer `src/components/seo/` or `src/lib/seo/` instead of route-local duplication. [Source: `astro.config.mjs`:4, `_bmad-output/planning-artifacts/architecture.md`:711, `_bmad-output/planning-artifacts/architecture.md`:752]
- Required testing touchpoints: extend the existing Node-based regression pattern under `tests/`, likely with a dedicated Story 2.3 test file plus updates to Story 2.1/2.2 assertions where the shared structure changes. [Source: `tests/story-2-1-projects-index.test.mjs`:23, `tests/story-2-2-project-detail-pages.test.mjs`:30]

### Testing Requirements

- Keep the repo baseline verification gates: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:6]
- Assert the canonical project schema and helper shape together so future content additions cannot drift into inconsistent preview/detail metadata patterns. [Source: `_bmad-output/planning-artifacts/architecture.md`:571, `src/lib/content/get-projects.ts`:35]
- Verify built project index and detail HTML include clear headings, semantic structure, unique metadata, absolute canonical URLs, and no `client:*` hydration for core browsing. [Source: `_bmad-output/planning-artifacts/epics.md`:503, `tests/story-2-1-projects-index.test.mjs`:82, `tests/story-2-2-project-detail-pages.test.mjs`:64]
- If structured data is implemented, validate it against the built HTML for at least two project pages and confirm the schema fields correspond to actual visible content. [Source: Google structured-data guidance reviewed 2026-03-13]
- Manual QA should compare the projects index and at least two project detail pages on mobile, tablet, and desktop widths to confirm recurring structure improves scanability without making the content feel templated or repetitive. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:447, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

### Previous Story Intelligence

- Story 2.1 established the canonical project entry path, the normalized helper, thin project routes, shared layout usage, and Node-based regression testing. Story 2.3 should extend those same files and conventions instead of rediscovering the architecture. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:102, commit `fd68255` reviewed 2026-03-13]
- Story 2.2 added substantive evaluator-facing structure: overview, problem, role, proof sections, optional external artifacts, and reusable detail rendering. That work is the base to standardize, not a temporary stopgap to discard. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:22, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:180]
- Story 2.2 also explicitly deferred broader presentation-framework work to Story 2.3. This story is therefore the right place to formalize consistent project presentation, but it still should not become Story 2.4's richer storytelling work. [Source: `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:35]
- Current project pages already preserve onward navigation to `/projects/`, `/resume/`, and `/contact/`; that continuity should remain part of the recurring pattern so deeper proof stays inside the overall evaluation journey. [Source: `src/components/projects/ProjectDetailPage.astro`:122, `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`:42]

### Git Intelligence Summary

- Recent Epic 2 work stayed concentrated in the project content schema, content helper, project routes/components, shared layout/styling, and focused Node tests. Story 2.3 should likely touch that same cluster instead of expanding into unrelated areas. [Source: commit `c52221a` reviewed 2026-03-13, commit `fd68255` reviewed 2026-03-13]
- Recent commit history shows no dependency churn around Astro, Tailwind, Zod, or TypeScript. That lowers risk for keeping this story scoped to structured presentation and discoverability rather than opportunistic stack changes. [Source: `git log --oneline -5` reviewed 2026-03-13, `package.json`:14]
- The repository was clean during workflow execution, so the story can assume the current project structure reflects the intended latest baseline. [Source: `git status --short` reviewed 2026-03-13]

### Latest Tech Information

- Astro's latest stable release is newer than the version pinned in this repo, but Story 2.3 should keep implementing against Astro 5-compatible patterns already in use here. Avoid Astro 6-only assumptions while adding metadata or content-structure work. [Source: npm registry and Astro upgrade guidance reviewed 2026-03-13, `package.json`:16]
- Current Astro guidance still supports schema-backed content collections and build-time generated routes for structured content. That continues to align with the repo's `projects` collection and static project pages. [Source: Astro content-collections guidance reviewed 2026-03-13, `src/lib/content/get-projects.ts`:36]
- Current canonical guidance from Astro and Google favors absolute canonical URLs built from the configured site origin. Story 2.3 should close the current gap where the repo can fall back to path-only canonicals if `Astro.site` is unset. [Source: `src/layouts/BaseLayout.astro`:13, Astro config/render-context docs reviewed 2026-03-13, Google canonical guidance reviewed 2026-03-13]
- Current Google structured-data guidance favors accurate JSON-LD that reflects real page content. For this repo, `WebPage` and `BreadcrumbList` are the safest baseline unless the project content model gains the true fields needed for richer content types. [Source: Google structured-data and breadcrumb guidance reviewed 2026-03-13, Schema.org guidance reviewed 2026-03-13]

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story artifact, current repo state, git history, and current standards research.
- Production URL supplied after initial draft: use `https://www.fahey.vip` as the canonical site origin for `astro.config.mjs` and absolute canonical URL generation.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The repo already contains the core project-proof architecture this story needs: `src/content/projects/` for authored entries, `src/content/config.ts` for schema, `src/lib/content/get-projects.ts` for normalization, `src/pages/projects/` for routes, `src/components/projects/` for reusable presentation, and `tests/` for Node-based regression coverage. [Source: `_bmad-output/planning-artifacts/architecture.md`:829, `src/content/config.ts`:55]
- `BaseLayout.astro` is already the shared head shell for page title, description, and canonical output, so Story 2.3 should improve discoverability through that shared boundary rather than creating project-only head markup patterns. [Source: `src/layouts/BaseLayout.astro`:5]
- The architecture already reserves `src/components/seo/` and `src/lib/seo/` as canonical places for shared metadata helpers if Story 2.3 needs them. Use those boundaries if reusable SEO logic appears, rather than embedding it inside `ProjectDetailPage.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:710, `_bmad-output/planning-artifacts/architecture.md`:752]
- No structural conflict currently blocks the story. The main risk is accidental duplication: project content rules duplicated across schema, helper, component, route, and test layers without one clear canonical source. [Source: `_bmad-output/planning-artifacts/architecture.md`:641]

### Anti-Pattern Prevention

- Do not create a second project data path for metadata, preview cards, or structured data.
- Do not turn Story 2.3 into an Astro upgrade, CMS migration, analytics integration, or Story 2.4 richer-case-study buildout.
- Do not add SEO-only fields or schema markup that the page cannot actually support with visible content.
- Do not force every project into identical wording; standardize structure, not voice.
- Do not hide core project meaning behind client-side rendering, hydration, or expandable-only UI.
- Do not generate canonicals or metadata in multiple ad hoc places.
- Do not diverge from the agreed canonical origin `https://www.fahey.vip` unless product/domain requirements change explicitly.
- Do not weaken the current evaluation journey by removing onward paths to `/projects/`, `/resume/`, or `/contact/`.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 2.3 requirements and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - evaluator clarity, discoverability goals, and MVP boundaries
- `_bmad-output/planning-artifacts/architecture.md` - static-first content architecture, SEO boundaries, and implementation guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - scanability, navigation continuity, responsive QA, and trust-oriented information hierarchy
- `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md` - previous story learnings and deferred scope boundary into Story 2.3
- `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/content/projects/portfolio-refresh.md`, `src/content/projects/team-dashboard-modernization.md`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectIndexList.astro`, and `src/components/projects/ProjectDetailPage.astro` - current implementation baseline for Story 2.3
- `tests/story-2-1-projects-index.test.mjs` and `tests/story-2-2-project-detail-pages.test.mjs` - current regression patterns to reuse or extend
- Astro content collections, Astro config/render-context, Google canonical, Google structured-data, Google breadcrumb, and Schema.org guidance reviewed on 2026-03-13

### Definition of Done

- Project entries follow one canonical authored structure that supports previews, detail pages, and truthful discoverability metadata.
- The projects index and project detail pages share a recurring information pattern that improves comparison without making project content feel generic.
- Built project HTML exposes meaningful headings, semantic structure, and unique metadata without requiring client-side rendering for core understanding.
- Canonical URLs are absolute and generated consistently from shared layout logic using configured Astro `site` value `https://www.fahey.vip`.
- Any structured data added is server-rendered, generated from real project fields, and accurately reflects visible page content.
- New project entries can be added by following the same schema and rendering contract without redesigning the project experience.
- `npm run check`, `npm test`, and `npm run build` pass, and manual QA confirms the recurring structure improves scanability on mobile, tablet, and desktop.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `2.3` and resolved to `2-3-structured-project-presentation-for-credibility-and-discoverability`.
- Workflow resources loaded and fully read: `workflow.yaml`, `instructions.xml`, `template.md`, `checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Previous story context reviewed from `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`.
- Current repo implementation baseline reviewed across `astro.config.mjs`, `package.json`, `src/layouts/BaseLayout.astro`, `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/content/projects/`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectIndexList.astro`, `src/components/projects/ProjectDetailPage.astro`, and current Node-based project tests.
- Git intelligence gathered from recent commit history, relevant recent commit diffs, and current working tree status.
- Current standards research gathered for Astro content collections, canonical URL handling, and structured-data guidance on 2026-03-13.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation must be completed manually.
- User later provided the production site origin `https://www.fahey.vip`, which resolves the canonical URL TODO from the initial draft.

### Implementation Plan

- Tighten the canonical project schema/helper so one normalized project contract drives card previews, detail sections, and discoverability metadata.
- Refine shared project components and thin routes so the recurring project structure is obvious across `/projects/` and `/projects/[slug]/`, with one reusable summary component carrying the same evaluator-facing hierarchy into both contexts.
- Add shared discoverability improvements through `astro.config.mjs`, `BaseLayout.astro`, and reusable SEO helpers only where they map to real page content.
- Extend Node-based regression coverage for structure, metadata, canonical URLs, and static discoverability behavior.

### Completion Notes List

- Production origin resolved: `https://www.fahey.vip`.
- Established a canonical normalized project contract in `src/lib/content/get-projects.ts` with grouped `preview`, `detail`, and `discoverability` shapes while preserving the existing evaluator-facing fields for compatibility.
- Added explicit authored `slug` values to current project entries and kept schema validation focused on truthful, rendered metadata only.
- Added Story 2.3 regression coverage for canonical contract structure, stable detail href generation, and centralized recurring narrative section shaping.
- Added `src/components/projects/ProjectStructureSummary.astro` so index and detail pages share one evaluator-facing hierarchy for summary, context, relevance, proof focus, and next steps without route-local duplication.
- Updated project presentation styling in `src/styles/global.css` so recurring structure stays consistent while project-specific proof content remains distinct.
- Configured `astro.config.mjs` with the canonical production origin and kept canonical URL generation centralized in `src/layouts/BaseLayout.astro`.
- Added shared SEO helpers in `src/components/seo/StructuredData.astro` and `src/lib/seo/get-project-structured-data.ts` so project pages emit truthful `WebPage` and `BreadcrumbList` JSON-LD from real project data.
- Updated `src/pages/projects/[slug].astro` to consume discoverability metadata from the normalized project contract and inject shared structured data through the layout head slot.
- Extended Story 2.3 regression coverage to verify reusable project structure, absolute canonical URLs, truthful structured data, and absence of `client:*` hydration in both route source and built project HTML.
- Completed final verification with `npm run check`, `npm test`, and `npm run build`, then manually reviewed built output for `dist/projects/index.html`, `dist/projects/portfolio-refresh/index.html`, and `dist/projects/team-dashboard-modernization/index.html` for scanability, canonical output, and semantic structure.
- Code review follow-up fixes made the authored project slug mandatory, removed helper fallback to generated collection slugs, routed project index CTAs through the canonical preview contract, hardened JSON-LD escaping, and tightened Story 2.3 regression coverage around those guarantees.

### File List

 - `_bmad-output/implementation-artifacts/2-3-structured-project-presentation-for-credibility-and-discoverability.md`
 - `_bmad-output/implementation-artifacts/sprint-status.yaml`
 - `src/content/config.ts`
 - `src/lib/content/get-projects.ts`
 - `src/content/projects/portfolio-refresh.md`
 - `src/content/projects/team-dashboard-modernization.md`
- `src/components/projects/ProjectStructureSummary.astro`
- `src/components/projects/ProjectIndexList.astro`
- `src/components/projects/ProjectDetailPage.astro`
- `src/styles/global.css`
- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`
 - `src/components/seo/StructuredData.astro`
 - `src/lib/seo/get-project-structured-data.ts`
 - `src/pages/projects/[slug].astro`
 - `tests/story-2-3-project-structure-and-discoverability.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-15
- Outcome: Approve
- Acceptance Criteria: All 4 acceptance criteria are implemented and verified against the current source and built output.
- Fixes applied during review:
  - Made authored project `slug` required in `src/content/config.ts` and removed generated-slug fallback from `src/lib/content/get-projects.ts`.
  - Updated `src/components/projects/ProjectIndexList.astro` to consume `project.preview.href` and `project.preview.ctaLabel` from the canonical normalized contract.
  - Escaped JSON-LD script-closing sequences in `src/components/seo/StructuredData.astro`.
  - Hardened `tests/story-2-3-project-structure-and-discoverability.test.mjs` so it catches optional slug drift, generated-slug fallback, preview contract bypasses, and structured-data escaping regressions.
  - Synced the story file list and sprint tracker with the reviewed implementation state.
- Remaining low-severity note:
  - `tests/story-2-3-project-structure-and-discoverability.test.mjs` still rebuilds the site multiple times; this is acceptable for now but worth consolidating later if suite time grows.
- Validation: `npm run check`, `npm test`, and `npm run build` all pass after the review fixes.

## Change Log

- 2026-03-15: Implemented Story 2.3 structured project presentation and discoverability improvements, including canonical project normalization, shared project structure rendering, absolute canonical URLs, truthful structured data, and regression coverage.
- 2026-03-15: Completed adversarial code review, fixed slug-contract and canonical-preview drift, hardened structured-data rendering, synced story tracking files, and approved the story.
