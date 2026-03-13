# Story 2.2: Project Detail Pages with Substantive Proof

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a technical evaluator,
I want each project to have a dedicated detail page with substantive context,
so that I can assess Chris's technical capability and decision-making from real work examples.

## Acceptance Criteria

1. Given a visitor opens an individual project page, when the detail content renders, then the page explains what the project is, what problem it addressed, and Chris's role or contribution, and the information is understandable without assuming insider knowledge.
2. Given a visitor is evaluating technical credibility, when they review a project detail page, then they can identify concrete proof such as scope, constraints, outcomes, decisions, or implementation evidence, and the content goes beyond a superficial gallery-style summary.
3. Given a project includes external references such as a live link, repository, or related artifact, when those references are shown, then they are clearly labeled and optional to use for deeper evaluation, and the page still communicates value even if an external artifact is unavailable.
4. Given a visitor moves between project detail pages and other primary pages, when navigation and layout render, then the project detail experience remains consistent with the broader site, and it supports continued progression toward resume review or contact.

## Tasks / Subtasks

- [x] Expand the canonical project content contract so detail pages can carry substantive proof without introducing a second data path (AC: 1, 2, 3)
  - [x] Extend `src/content/config.ts` so the `projects` collection captures the detail-page proof fields Story 2.2 needs, with strict Zod validation and clear optionality for external references. The schema should support project explanation, role/contribution, problem framing, proof sections, and optional labeled external artifacts while preserving Story 2.1 list fields. [Source: `_bmad-output/planning-artifacts/architecture.md`:126, `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:489, `_bmad-output/planning-artifacts/epics.md`:461]
  - [x] Update `src/lib/content/get-projects.ts` to normalize and expose the new detail-page fields from the canonical collection helper rather than re-parsing frontmatter in routes or components. Keep duplicate-slug protection intact. [Source: `_bmad-output/planning-artifacts/architecture.md`:493, `_bmad-output/planning-artifacts/architecture.md`:805, `src/lib/content/get-projects.ts`:1]
  - [x] Enrich the authored project entries in `src/content/projects/` with real substantive proof that covers what the project is, the problem addressed, Chris's role, and concrete evidence such as scope, constraints, decisions, outcomes, or implementation details. Keep the content understandable without insider shorthand. [Source: `_bmad-output/planning-artifacts/epics.md`:461, `_bmad-output/planning-artifacts/epics.md`:468, `_bmad-output/planning-artifacts/prd.md`:165, `src/content/projects/portfolio-refresh.md`:1]

- [x] Rework the project detail route into a real evaluator-facing proof page using the existing static-first shell (AC: 1, 2, 4)
  - [x] Replace the Story 2.1 placeholder language in `src/pages/projects/[slug].astro` with substantive sections that clearly explain the project, problem, role, and proof points. Keep the route thin by loading normalized content and composing presentation instead of embedding content rules in the page file. [Source: `_bmad-output/planning-artifacts/epics.md`:461, `_bmad-output/planning-artifacts/epics.md`:468, `_bmad-output/planning-artifacts/architecture.md`:448, `_bmad-output/planning-artifacts/architecture.md`:887, `src/pages/projects/[slug].astro`:1]
  - [x] Preserve normal static routing with `getStaticPaths`, loud failure on invalid slugs, and no client-side routing or unnecessary hydration for core browsing behavior. [Source: `_bmad-output/planning-artifacts/architecture.md`:448, `_bmad-output/planning-artifacts/architecture.md`:577, `_bmad-output/planning-artifacts/architecture.md`:951, `src/pages/projects/[slug].astro`:7]
  - [x] Keep the detail-page experience visually and structurally consistent with the broader site by continuing to use the shared layout, navigation, and editorial route-shell patterns already established in Epic 1 and Story 2.1. [Source: `_bmad-output/planning-artifacts/epics.md`:476, `_bmad-output/planning-artifacts/ux-design-specification.md`:149, `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:98, `src/layouts/BaseLayout.astro`:1]

- [x] Present concrete proof in a structured, understandable way that supports technical evaluation without depending on external links (AC: 1, 2, 3)
  - [x] Introduce reusable detail-page presentation under `src/components/` if needed so proof sections, evidence blocks, or external-reference groups are shared cleanly instead of hard-coded in the route. Follow the existing PascalCase component convention. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:830, `_bmad-output/planning-artifacts/ux-design-specification.md`:383]
  - [x] Ensure any external references such as live URLs, repository links, or related artifacts are clearly labeled, visibly optional, and never required to understand the project's value. If no external artifact exists, the detail page should still feel complete. [Source: `_bmad-output/planning-artifacts/epics.md`:471, `_bmad-output/planning-artifacts/prd.md`:446, `_bmad-output/planning-artifacts/ux-design-specification.md`:297]
  - [x] Keep Story 2.2 focused on substantive proof and evaluator clarity, not on inventing a full reusable cross-project presentation framework that belongs in Story 2.3. Differences between projects should still come from the work itself, but any broader structure-hardening beyond what this story needs should be deferred. [Source: `_bmad-output/planning-artifacts/epics.md`:481, `_bmad-output/planning-artifacts/epics.md`:491, `_bmad-output/planning-artifacts/prd.md`:117]
  - [x] Prefer content structure that emphasizes explanation and evidence over decorative gallery treatment. The page should help evaluators move from summary to proof and then onward to resume or contact without losing orientation. [Source: `_bmad-output/planning-artifacts/prd.md`:53, `_bmad-output/planning-artifacts/prd.md`:117, `_bmad-output/planning-artifacts/ux-design-specification.md`:99, `_bmad-output/planning-artifacts/ux-design-specification.md`:295]

- [x] Preserve accessibility, responsiveness, metadata, and evaluation-path clarity on project detail pages (AC: 1, 3, 4)
  - [x] Maintain semantic heading order, readable prose, visible focus states, keyboard-usable links, and motion restraint consistent with the repo's accessibility baseline and the site's `WCAG 2.2 AA` target. [Source: `_bmad-output/planning-artifacts/prd.md`:281, `_bmad-output/planning-artifacts/ux-design-specification.md`:462, `_bmad-output/implementation-artifacts/1-6-accessibility-baseline-for-core-browsing.md`:103, `src/styles/global.css`:881]
  - [x] Extend shared styles in `src/styles/global.css` only where necessary to support richer project-detail typography, section hierarchy, and responsive layout across mobile, tablet, and desktop widths without breaking the established visual system. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:125, `_bmad-output/planning-artifacts/ux-design-specification.md`:447, `_bmad-output/planning-artifacts/ux-design-specification.md`:458, `src/styles/global.css`:557]
  - [x] Keep metadata and canonical-path behavior in place for generated project pages so detail routes remain crawlable and semantically clear. If canonical behavior is improved, do it within the existing metadata pattern instead of inventing a parallel system. [Source: `_bmad-output/planning-artifacts/architecture.md`:52, `_bmad-output/planning-artifacts/architecture.md`:523, `_bmad-output/planning-artifacts/architecture.md`:799, `src/layouts/BaseLayout.astro`:5]
  - [x] Preserve obvious onward paths to `/projects/`, `/resume/`, and `/contact/` so deeper proof feels like part of one calm evaluation journey instead of a dead-end subexperience. [Source: `_bmad-output/planning-artifacts/epics.md`:476, `_bmad-output/planning-artifacts/prd.md`:377, `_bmad-output/planning-artifacts/ux-design-specification.md`:301, `src/pages/projects/[slug].astro`:62]

- [x] Add regression coverage for substantive proof pages and static-first behavior (AC: 1, 2, 3, 4)
  - [x] Add or extend Node-based regression tests under `tests/` to verify the source contract and generated detail-page HTML include substantive project explanation, labeled proof sections, optional external reference handling, metadata, and no unnecessary `client:*` hydration. [Source: `tests/story-2-1-projects-index.test.mjs`:1, `_bmad-output/planning-artifacts/architecture.md`:933, `_bmad-output/planning-artifacts/architecture.md`:951]
  - [x] Keep the existing repo verification baseline by passing `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:6, `_bmad-output/planning-artifacts/architecture.md`:951]
  - [x] Perform manual QA on at least one project detail page at mobile, tablet, and desktop widths to confirm readability, proof clarity, navigation continuity, and reduced-motion resilience. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468, `_bmad-output/planning-artifacts/ux-design-specification.md`:303, `_bmad-output/planning-artifacts/prd.md`:455]

## Dev Notes

- Story 2.1 already established the canonical project path for this epic: `src/content/projects/` holds authored entries, `src/content/config.ts` defines the schema, `src/lib/content/get-projects.ts` is the canonical read layer, `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro` are the public routes, and the current detail page is intentionally thin and static-first. Story 2.2 should deepen that existing path instead of creating a second project data flow or a parallel route/layout stack. [Source: `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:830, `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:98, `src/pages/projects/[slug].astro`:1]
- The current detail route already has the right foundation: `getStaticPaths`, slug validation, `render(project.entry)`, shared `BaseLayout`, canonical path generation, and persistent onward links to `/projects/`, `/resume/`, and `/contact/`. The main implementation job is to replace placeholder framing with substantive evaluator-facing proof while preserving those route guarantees. [Source: `src/pages/projects/[slug].astro`:7, `src/pages/projects/[slug].astro`:27, `src/pages/projects/[slug].astro`:30, `src/pages/projects/[slug].astro`:62]
- The architecture is content-led and static-first. Project detail pages should continue to rely on Astro content collections, typed schemas, build-time validation, crawlable output, and minimal JavaScript. Build-time failure is preferred over silent content drift. [Source: `_bmad-output/planning-artifacts/architecture.md`:126, `_bmad-output/planning-artifacts/architecture.md`:156, `_bmad-output/planning-artifacts/architecture.md`:577, `_bmad-output/planning-artifacts/architecture.md`:951]
- UX intent matters as much as raw information density: the page should feel like proof, not packaging. The content must explain the project in plain language, reward deeper evaluation with concrete evidence, and maintain orientation within the broader recruiter/technical-evaluator flow. [Source: `_bmad-output/planning-artifacts/prd.md`:53, `_bmad-output/planning-artifacts/prd.md`:165, `_bmad-output/planning-artifacts/ux-design-specification.md`:99, `_bmad-output/planning-artifacts/ux-design-specification.md`:295]
- Keep Story 2.2 scoped to substantive detail-page proof. Do not prematurely generalize into a full reusable multi-project presentation system that belongs to Story 2.3, and do not add placeholder “future case study” clutter that belongs to Story 2.4. [Source: `_bmad-output/planning-artifacts/epics.md`:481, `_bmad-output/planning-artifacts/epics.md`:511]

### Technical Requirements

- Extend the existing `projects` collection schema rather than creating a parallel detail-page content source. New required fields should cover project explanation, problem framing, Chris's role, and concrete proof; external references may remain optional, but if present they must be structured and labeled clearly enough to render without ad hoc parsing. [Source: `src/content/config.ts`:40, `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/epics.md`:471]
- Preserve the canonical content-loading flow: Astro content collection -> `src/lib/content/get-projects.ts` normalization -> route/component consumption. Do not move project shaping into `src/pages/projects/[slug].astro` or duplicate frontmatter access logic across multiple files. [Source: `src/lib/content/get-projects.ts`:16, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:887]
- Keep the route static-first and server-rendered at build time. Story 2.2 should not add `client:*` hydration, client-side routing, or interactive dependencies just to present project proof. [Source: `src/pages/projects/[slug].astro`:7, `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:951]
- The rendered detail page must communicate value without assuming external artifacts exist or that the visitor has insider context. A repository link, live site, or related artifact can deepen evaluation, but the page itself must stand on its own. [Source: `_bmad-output/planning-artifacts/epics.md`:463, `_bmad-output/planning-artifacts/epics.md`:473, `_bmad-output/planning-artifacts/prd.md`:446]
- Treat accessibility, responsiveness, metadata, and calm navigation continuity as implementation constraints, not polish passes. Any new proof layout or evidence component must preserve semantic HTML, visible focus, readable hierarchy, and dependable onward navigation to the rest of the evaluation journey. [Source: `_bmad-output/planning-artifacts/prd.md`:281, `_bmad-output/planning-artifacts/ux-design-specification.md`:297, `_bmad-output/planning-artifacts/ux-design-specification.md`:468, `src/layouts/BaseLayout.astro`:31]

### Architecture Compliance

- Keep route files thin and composition-focused. `src/pages/projects/[slug].astro` should continue to orchestrate loading and rendering, while reusable proof UI belongs in `src/components/` and data shaping stays in `src/lib/content/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:467, `_bmad-output/planning-artifacts/architecture.md`:805, `src/pages/projects/[slug].astro`:1]
- Respect the existing layered structure: `src/content/` for authored entries and schema, `src/lib/content/` for canonical reads, `src/pages/projects/` for routes, `src/layouts/` for shared shells, `src/components/` for reusable presentation, `src/styles/` for shared styling, and `tests/` for regression coverage. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:919]
- Use `src/content/config.ts` as the single schema-definition boundary and `BaseLayout` as the shared page shell. Do not duplicate schema rules in helper modules or create a one-off detail-page shell that bypasses the site's established metadata and navigation patterns. [Source: `src/content/config.ts`:40, `src/layouts/BaseLayout.astro`:5, `_bmad-output/planning-artifacts/architecture.md`:489, `_bmad-output/planning-artifacts/architecture.md`:799]
- Preserve canonical metadata conventions and route structure. Project detail pages should remain standard Astro routes at `src/pages/projects/[slug].astro` with stable canonical paths and build-generated HTML output. [Source: `_bmad-output/planning-artifacts/architecture.md`:448, `_bmad-output/planning-artifacts/architecture.md`:523, `_bmad-output/planning-artifacts/architecture.md`:830, `src/pages/projects/[slug].astro`:30]
- Avoid architecture drift from neighboring future stories. Story 2.2 should not introduce CMS workflows, analytics dependencies, alternate content vocabularies, or a generalized project framework that conflicts with the current content-collection terminology and launch scope. [Source: `_bmad-output/planning-artifacts/architecture.md`:425, `_bmad-output/planning-artifacts/architecture.md`:807, `_bmad-output/planning-artifacts/prd.md`:323]

### Library / Framework Requirements

- Stay within the current validated repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, and `typescript@^5.9.3`. Current npm registry versions show Astro has moved to `6.0.4`, but this story should not fold a framework upgrade into feature work. [Source: `package.json`:14, npm registry checked 2026-03-13]
- Continue using Astro content collections and `render()` for authored Markdown project entries. Astro's current content-collection guidance still reinforces schema-backed collections, explicit querying with `getCollection()`, and generated routes from collection data, which matches the repo's architecture. [Source: Astro content collections docs reviewed 2026-03-13, `src/pages/projects/[slug].astro`:2, `src/lib/content/get-projects.ts`:1]
- Continue using Zod 4 for schema validation with TypeScript strictness preserved. New project-detail fields should be expressed through the existing schema object in `src/content/config.ts`, not by runtime validation libraries or ad hoc guards in components. [Source: Zod docs reviewed 2026-03-13, `package.json`:18, `src/content/config.ts`:40]
- Keep styling aligned with the repo's current Tailwind v4 + authored global CSS setup. Tailwind's Astro setup guidance still uses the Vite plugin plus imported global CSS, so Story 2.2 should extend `src/styles/global.css` rather than introducing a CSS-in-JS layer, component-scoped styling sprawl, or a UI library dependency. [Source: Tailwind Astro install docs reviewed 2026-03-13, `package.json`:15, `src/styles/global.css`:1]
- Do not add a client router, CMS SDK, animation package, markdown-rendering replacement, or card/component framework for this story. The existing stack already covers schema validation, static routing, and content rendering needs. [Source: `_bmad-output/planning-artifacts/architecture.md`:977, `package.json`:14]

### File Structure Requirements

- Required schema touchpoint: `src/content/config.ts` must remain the canonical place to extend the `projects` collection contract for detail-page proof fields. [Source: `src/content/config.ts`:40]
- Required authored-content touchpoints: the existing project entries under `src/content/projects/` should be expanded with substantive detail-page content rather than creating shadow content in route files, JSON data files, or docs-only references. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `src/content/projects/portfolio-refresh.md`:1, `src/content/projects/team-dashboard-modernization.md`:1]
- Required content-access touchpoint: `src/lib/content/get-projects.ts` should remain the single normalization layer for list/detail consumption, including any new proof-oriented fields added by this story. [Source: `src/lib/content/get-projects.ts`:1, `_bmad-output/planning-artifacts/architecture.md`:805]
- Required route touchpoint: `src/pages/projects/[slug].astro` should be updated in place as the canonical project detail route. Keep `src/pages/projects/index.astro` untouched except where a stronger handoff or labels are naturally needed for continuity. [Source: `src/pages/projects/[slug].astro`:1, `_bmad-output/planning-artifacts/architecture.md`:830]
- Likely presentation touchpoints: add or evolve project-detail presentation components under `src/components/projects/` if the proof UI becomes dense enough to justify extraction. Reuse the site's shared shell through `src/layouts/BaseLayout.astro`. [Source: `_bmad-output/planning-artifacts/architecture.md`:695, `src/layouts/BaseLayout.astro`:1]
- Shared styling touchpoint: extend `src/styles/global.css` for proof-section layout, evidence blocks, external-reference groups, and responsive detail-page hierarchy while preserving the existing editorial system. [Source: `src/styles/global.css`:533]
- Required testing touchpoints: add or extend Node-based regression coverage under `tests/`, reusing the existing test runner rather than introducing a second test harness. [Source: `tests/story-2-1-projects-index.test.mjs`:1, `package.json`:12]

### Testing Requirements

- Keep the repo's baseline verification gates: `npm run check`, `npm test`, and `npm run build`. Story 2.2 should be considered incomplete until all three pass with the richer detail-page content and schema changes in place. [Source: `package.json`:6]
- Reuse the existing Node-based regression pattern from Story 2.1. Add or extend tests under `tests/` to assert both source-level contracts and built HTML output for generated project detail pages. [Source: `tests/story-2-1-projects-index.test.mjs`:1]
- Verify that each generated `/projects/<slug>/index.html` includes page metadata, a canonical link, substantive project explanation, proof-oriented sections or labels, and clearly labeled optional external references when present. [Source: `_bmad-output/planning-artifacts/epics.md`:461, `_bmad-output/planning-artifacts/epics.md`:471, `src/pages/projects/[slug].astro`:30]
- Assert that project detail pages remain static-first and do not introduce `client:load`, `client:idle`, `client:visible`, or `client:only` directives for core proof browsing. [Source: `tests/story-2-1-projects-index.test.mjs`:79, `_bmad-output/planning-artifacts/architecture.md`:951]
- Validate that authored project entries include the required new proof fields so the content model cannot silently regress back to thin summary-only entries. [Source: `src/content/config.ts`:40, `_bmad-output/planning-artifacts/architecture.md`:577]
- Manual QA should cover at least one project detail page on mobile, tablet, and desktop widths, checking reading flow, heading hierarchy, keyboard navigation, visible focus, onward links to `/projects/`, `/resume/`, and `/contact/`, and reduced-motion behavior. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468, `src/styles/global.css`:881, `src/pages/projects/[slug].astro`:62]

### Previous Story Intelligence

- Story 2.1 already created the canonical foundation this story must extend: a validated `projects` content collection, authored Markdown entries in `src/content/projects/`, the `src/lib/content/get-projects.ts` helper, a thin static route at `src/pages/projects/[slug].astro`, shared styling in `src/styles/global.css`, and Node-based regression coverage in `tests/story-2-1-projects-index.test.mjs`. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:168]
- Story 2.1 deliberately kept the detail page thin and deferred substantive proof to Story 2.2. That means placeholder copy about case-study depth being reserved for the next story should now be removed or replaced, not preserved as launch copy. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:34, `src/pages/projects/[slug].astro`:41]
- Reuse Story 2.1's established implementation pattern: keep routes thin, centralize project shaping in `src/lib/content/get-projects.ts`, preserve static navigation behavior, and extend shared editorial styling instead of introducing a new page shell. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:175, `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:188]
- Carry forward the same regression strategy: source-contract checks plus built-output assertions, with no new test framework. This story should deepen those checks around substantive proof and optional references instead of replacing them. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:189]
- Anti-patterns already identified in Story 2.1 still apply here: do not create a second project data path, do not hydrate detail pages for presentation polish, and do not break the shared visual system with a one-off projects experience. [Source: `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:123]

### Git Intelligence Summary

- Recent repository work is tightly aligned to Epic 2 foundations: the latest relevant commits added the projects content collection, the canonical content helper, the projects index/detail routes, shared styling extensions, and Node-based regression tests. Story 2.2 should build directly on those same files and conventions instead of relocating the feature surface. [Source: git history reviewed 2026-03-13]
- The repo is currently in a clean enough state to continue this story without compensating for unrelated structural churn; there was no evidence in recent commits of a shift away from Astro content collections, shared global styling, or Node-based regression testing. [Source: git status and recent commits reviewed 2026-03-13]
- Recent commit patterns reinforce a few conventions worth preserving: keep implementation incremental, favor shared route shells over isolated page scaffolds, and pair feature work with targeted regression coverage in `tests/`. [Source: git log and commit diff reviewed 2026-03-13]
- No recent commit suggested any dependency change relevant to this story. That lowers risk for staying on the current stack and avoiding opportunistic upgrades while implementing substantive proof pages. [Source: git history reviewed 2026-03-13, `package.json`:14]

### Latest Tech Information

- npm registry checks on 2026-03-13 show `astro` latest at `6.0.4`, while this repo is pinned to `^5.18.0`. The dev agent should preserve Astro 5 conventions for this story and avoid accidentally implementing against Astro 6-only guidance. [Source: npm registry checked 2026-03-13, `package.json`:16]
- Current Astro content-collections documentation still emphasizes schema-backed collections, `getCollection()` querying, `render()` for Markdown bodies, and generating routes from collection data. That aligns directly with the repo's existing `projects` architecture and reinforces using the current collection/helper/route pipeline rather than alternative loaders or runtime fetching. [Source: Astro content collections docs reviewed 2026-03-13, `src/lib/content/get-projects.ts`:16, `src/pages/projects/[slug].astro`:27]
- Current Tailwind Astro guidance remains compatible with the repo's setup: use the `@tailwindcss/vite` plugin and imported global CSS. For this story, the relevant takeaway is not to change styling architecture; continue extending `src/styles/global.css` within the existing system. [Source: Tailwind Astro install docs reviewed 2026-03-13, `package.json`:15, `src/styles/global.css`:1]
- Zod 4 remains the current stable validation layer, and its current docs continue to assume TypeScript-first strict schemas. That supports expanding the `projects` collection with richer proof fields while preserving compile-time guidance and validation failures for malformed content. [Source: Zod docs reviewed 2026-03-13, `package.json`:18]
- Current npm registry checks show `tailwindcss@4.2.1`, `@tailwindcss/vite@4.2.1`, `zod@4.3.6`, and `typescript@5.9.3`, which all match the repo's declared versions. No package-refresh work is needed for Story 2.2. [Source: npm registry checked 2026-03-13, `package.json`:15]

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, Story 2.1 artifact, current repo state, git history, and current standards research.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- Align with the architecture's canonical structure: content schemas in `src/content/config.ts`, project entries in `src/content/projects/`, content access in `src/lib/content/get-projects.ts`, route files in `src/pages/projects/`, shared layout in `src/layouts/BaseLayout.astro`, optional project UI components in `src/components/projects/`, and shared styling in `src/styles/global.css`. [Source: `_bmad-output/planning-artifacts/architecture.md`:472, `_bmad-output/planning-artifacts/architecture.md`:489, `_bmad-output/planning-artifacts/architecture.md`:805, `_bmad-output/planning-artifacts/architecture.md`:830]
- Naming should stay consistent with the current repo: Astro route conventions for page files, PascalCase for components, and a single canonical helper for project reads. Avoid duplicating schema helpers, metadata helpers, or content-normalization logic across folders. [Source: `_bmad-output/planning-artifacts/architecture.md`:448, `_bmad-output/planning-artifacts/architecture.md`:493, `_bmad-output/planning-artifacts/architecture.md`:641]
- No structural conflict is currently blocking the story. The existing `src/pages/projects/[slug].astro` route can be evolved in place, and `BaseLayout` already supports page metadata and canonical URLs. Only add a new project-specific layout if the route becomes materially too dense; otherwise preserve the established thin-route pattern. [Source: `src/pages/projects/[slug].astro`:1, `src/layouts/BaseLayout.astro`:5]

### References

- `_bmad-output/planning-artifacts/epics.md`:451
- `_bmad-output/planning-artifacts/prd.md`:53
- `_bmad-output/planning-artifacts/architecture.md`:126
- `_bmad-output/planning-artifacts/ux-design-specification.md`:99
- `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`:1
- `src/content/config.ts`:40
- `src/lib/content/get-projects.ts`:1
- `src/pages/projects/[slug].astro`:1
- `src/layouts/BaseLayout.astro`:1
- `src/styles/global.css`:533
- `tests/story-2-1-projects-index.test.mjs`:1

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Story target provided by user as `2.2` and resolved to `2-2-project-detail-pages-with-substantive-proof`.
- Workflow resources loaded and fully read: `workflow.yaml`, `instructions.xml`, `template.md`, `checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Previous story context reviewed from `_bmad-output/implementation-artifacts/2-1-projects-index-and-evaluation-oriented-browsing.md`.
- Current repo implementation baseline reviewed across `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/pages/projects/[slug].astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`, project content entries, `tests/story-2-1-projects-index.test.mjs`, and `package.json`.
- Git intelligence gathered from recent commit history, latest commit diff summary, and current working tree status.
- Current standards research gathered from Astro content collections docs, Tailwind Astro install docs, Zod docs, and npm registry version checks on 2026-03-13.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist execution could not be run through the referenced task runner.

### Implementation Plan

- Extend the canonical `projects` collection schema and helper so detail pages can consume proof-oriented fields from one validated content path.
- Replace the placeholder detail-page body with a reusable `src/components/projects/ProjectDetailPage.astro` presentation layer while keeping `src/pages/projects/[slug].astro` thin and static-first.
- Enrich both authored project entries with evaluator-facing explanation, problem framing, role clarity, structured evidence, and optional external references.
- Add regression coverage for schema, helper output, route composition, built HTML proof sections, optional references, metadata, and hydration constraints.
- Validate with `npm run check`, `npm test`, `npm run build`, plus manual review of built detail output and responsive/reduced-motion CSS behavior.

### Completion Notes List

- Extended `src/content/config.ts` and `src/lib/content/get-projects.ts` so project detail pages now read overview, problem, role, structured proof sections, and optional external references from the canonical content collection flow.
- Replaced the Story 2.1 placeholder detail page with a reusable `src/components/projects/ProjectDetailPage.astro` proof layout and kept `src/pages/projects/[slug].astro` thin, static, and metadata-aware.
- Expanded `src/content/projects/portfolio-refresh.md` and `src/content/projects/team-dashboard-modernization.md` with substantive evaluator-facing proof, including problem framing, direct contribution, evidence sections, and optional references where available.
- Extended `src/styles/global.css` only where needed for proof cards, reference lists, and responsive detail-page structure while preserving the shared editorial system and reduced-motion baseline.
- Added `tests/story-2-2-project-detail-pages.test.mjs` to verify schema fields, authored content, route composition, built metadata, proof labels, optional reference handling, and no `client:*` hydration on detail pages.
- Verified the story with `npm run check`, `npm test`, and `npm run build`, then manually reviewed built detail output plus mobile/tablet/desktop breakpoint and reduced-motion CSS rules for readability and navigation continuity.
- Definition of Done review passed against `checklist.md`; the workflow-level validation runner is still absent at `_bmad/core/tasks/validate-workflow.xml`, so checklist validation was completed manually.
- Code review follow-up fixes tightened Story 2.2 regression coverage around normalized helper fields, respected frontmatter slug overrides when checking built pages, and made the build assertion stable under the Node test runner by sanitizing `NODE_OPTIONS`.
- Code review follow-up fixes also removed the Astro internal runtime type import from `src/components/projects/ProjectDetailPage.astro` so the detail component no longer depends on a private framework path.

### File List

- `_bmad-output/implementation-artifacts/2-2-project-detail-pages-with-substantive-proof.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/projects/ProjectDetailPage.astro`
- `src/content/config.ts`
- `src/content/projects/portfolio-refresh.md`
- `src/content/projects/team-dashboard-modernization.md`
- `src/lib/content/get-projects.ts`
- `src/pages/projects/[slug].astro`
- `src/styles/global.css`
- `tests/story-2-2-project-detail-pages.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-13
- Outcome: Approve
- Acceptance Criteria: All 4 acceptance criteria are implemented and verified against the current source and built output.
- Fixes applied during review:
  - Hardened Story 2.2 regression coverage to assert helper normalization for `overview`, `problem`, and `role` in `tests/story-2-2-project-detail-pages.test.mjs`.
  - Updated built-output assertions to resolve route paths from frontmatter `slug` overrides instead of markdown filenames in `tests/story-2-2-project-detail-pages.test.mjs`.
  - Stabilized the Story 2.2 build regression by clearing inherited `NODE_OPTIONS` for the nested build command in `tests/story-2-2-project-detail-pages.test.mjs`.
  - Replaced the Astro internal runtime type import with a local component signature alias in `src/components/projects/ProjectDetailPage.astro`.
- Validation: `npm run check`, `npm test`, and `npm run build` all pass after the review fixes.

## Change Log

- 2026-03-13: Implemented Story 2.2 substantive project proof pages, added canonical detail-page content fields, introduced reusable proof presentation, enriched authored project entries, and added regression coverage for static detail behavior.
- 2026-03-13: Completed adversarial code review, fixed Story 2.2 regression gaps and test stability, removed Astro internal type coupling, and approved the story.
