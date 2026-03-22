# Story 4.5: Future-Ready Content and Integration Boundaries

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the site's structure to support future content and integrations without disturbing the launch experience,
so that the product can evolve cleanly while preserving performance, clarity, and maintainability.

## Acceptance Criteria

1. Given the MVP information architecture and content model are defined, when future enhancements are considered, then the current structure supports growth in projects and future content areas without redefining the site's core purpose, and the launch experience remains coherent on its own without requiring future writing surfaces to be present.
2. Given a future capability such as analytics, a CMS, or richer content sections is introduced, when it is added after launch, then it can be integrated through defined extension boundaries, and the primary browsing journey remains understandable and trustworthy.
3. Given the site evolves over time, when Chris continues to add or refine content and features, then core trust signals remain visible and understandable, and future additions do not materially compromise core performance or maintainability.
4. Given implementation work is planned for MVP only, when stories are selected for sprint planning, then reserved future-writing routes, content types, and UI sections are treated as post-launch seams rather than required deliverables, and sprint scope remains limited to homepage, projects, resume, contact, accessibility, SEO, and deployment-ready foundations.

## Tasks / Subtasks

- [x] Codify the launch-vs-future information architecture boundary so future seams stay real but non-launch (AC: 1, 4)
  - [x] Preserve `src/config/navigation.ts` as the canonical launch navigation contract (`Home`, `Projects`, `Resume`, `Contact`) and do not add `Posts`, `Writing`, `Blog`, or other future surfaces to launch navigation in this story. [Source: `src/config/navigation.ts`:2, `src/config/navigation.ts`:6, `tests/story-1-4-navigation.test.mjs`:13, `_bmad-output/planning-artifacts/ux-design-specification.md`:201]
  - [x] Keep reserved writing/content seams explicitly dormant and explanatory so the posts surface remains extension-ready without becoming part of the first-minute trust path. [Source: `src/content/posts/future-writing-seam.md`:2, `src/pages/posts/index.astro`:21, `tests/story-4-2-structured-search-signals.test.mjs`:72, `_bmad-output/planning-artifacts/epics.md`:779]
  - [x] If any IA copy or repo docs are touched, reinforce that launch scope remains homepage, projects, resume, contact, accessibility, SEO, and deployment-ready foundations only. [Source: `_bmad-output/planning-artifacts/epics.md`:779, `_bmad-output/planning-artifacts/prd.md`:298, `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md`:231]

- [x] Define and protect extension boundaries for future integrations and content growth (AC: 1, 2)
  - [x] Treat `src/content/` as the only canonical authored-content source, `src/content/config.ts` as the schema boundary, and `src/lib/content/` as the normalization layer; do not create a shadow content system in `src/data/`, route files, or ad hoc remote fetches. [Source: `src/content/config.ts`:67, `src/content/config.ts`:141, `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:812]
  - [x] Keep future dynamic or third-party capabilities behind explicit seams only: `src/lib/integrations/` for optional service adapters and `src/pages/api/` for future dynamic endpoints, without making either directory a launch dependency. [Source: `_bmad-output/planning-artifacts/architecture.md`:787, `_bmad-output/planning-artifacts/architecture.md`:788, `_bmad-output/planning-artifacts/architecture.md`:806, `tests/story-1-1-foundation.test.mjs`:177]
  - [x] Require any future CMS or external content source to map into the existing `src/content/` domain model instead of bypassing schemas or shaping page contracts directly. [Source: `_bmad-output/planning-artifacts/architecture.md`:816, `_bmad-output/planning-artifacts/architecture.md`:817, `_bmad-output/planning-artifacts/prd.md`:217]

- [x] Preserve route-thin, trust-preserving launch behavior while allowing future extension (AC: 2, 3)
  - [x] Keep launch routes (`src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, `src/pages/contact.astro`) focused on composition of already-shaped data rather than new integration logic or runtime fetch paths. [Source: `src/pages/index.astro`:13, `src/pages/projects/index.astro`:9, `src/pages/projects/[slug].astro`:11, `src/pages/resume.astro`:5, `_bmad-output/planning-artifacts/architecture.md`:793]
  - [x] Protect `src/layouts/BaseLayout.astro` and the shared metadata helpers as stable global seams; future analytics or widgets must not land in the shell in a way that makes the main browsing journey dependent on them. [Source: `src/layouts/BaseLayout.astro`:32, `src/lib/seo/get-page-metadata.ts`:31, `tests/story-4-4-sustainable-site-architecture.test.mjs`:22, `_bmad-output/planning-artifacts/prd.md`:217]
  - [x] Keep optional references, richer narrative modules, and future post detail pages additive only; they may deepen proof or publishing later, but they must not become necessary for basic understanding of identity, projects, resume access, or contact. [Source: `src/components/projects/ProjectDetailPage.astro`:127, `src/content/config.ts`:164, `src/pages/posts/[slug].astro`:32, `_bmad-output/planning-artifacts/epics.md`:769]

- [x] Add regression coverage that prevents scope creep and broken extension seams (AC: 1, 2, 3, 4)
  - [x] Extend the existing Node-based regression suite to assert that launch navigation remains narrow even while reserved future posts routes and schemas continue to exist. [Source: `tests/story-1-4-navigation.test.mjs`:13, `tests/story-4-2-structured-search-signals.test.mjs`:72]
  - [x] Add or extend tests that verify future seams stay build-safe: draft placeholder post content should validate schemas without publishing accidental launch content, and optional integration boundaries must not become required for static build success. [Source: `src/content/posts/future-writing-seam.md`:6, `tests/story-4-2-structured-search-signals.test.mjs`:78, `_bmad-output/planning-artifacts/architecture.md`:947, `_bmad-output/planning-artifacts/architecture.md`:953]
  - [x] Re-run `npm run check`, `npm test`, and `npm run build` before moving the story out of implementation so schema integrity, regression coverage, and static output remain the quality gate. [Source: `package.json`:8, `package.json`:9, `package.json`:14, `.github/workflows/ci.yml`:29]

## Dev Notes

### Developer Context

- Story 4.5 is a guardrail-and-clarity story, not a launch-scope expansion story. The repo already contains real future seams for posts, richer project storytelling, and generalized discoverability metadata; the work is to keep those seams intentional, isolated, and non-disruptive. [Source: `src/content/config.ts`:141, `src/lib/content/get-posts.ts`:20, `src/pages/posts/index.astro`:21, `src/content/config.ts`:164]
- The launch trust path is already narrow and deliberate: homepage, projects, resume, and contact. That path must stay legible even as future routes and integrations are prepared in the codebase. [Source: `src/config/navigation.ts`:6, `src/pages/index.astro`:25, `_bmad-output/planning-artifacts/ux-design-specification.md`:201]
- Planning artifacts intentionally reserve future writing/blog capability, but multiple documents warn that agents could mistake those seams for MVP commitments. This story should remove that ambiguity in code, tests, and any touched guidance. [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md`:222, `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md`:227, `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md`:239]
- Long-term ownership is part of the product promise. Future analytics, CMS, newsletter, or social-feed ideas only belong if they preserve performance, privacy, and replaceability rather than turning the site into a brittle service wrapper. [Source: `_bmad-output/planning-artifacts/prd.md`:213, `_bmad-output/planning-artifacts/prd.md`:217, `_bmad-output/planning-artifacts/prd.md`:224]
- The real repo should win over aspirational architecture placeholders when they differ. `src/pages/api/` and `src/lib/integrations/` are documented future seams, but they do not exist today, so do not invent broad scaffolding unless the story needs a small, justified boundary. [Source: `_bmad-output/planning-artifacts/architecture.md`:787, `_bmad-output/planning-artifacts/architecture.md`:806, `tests/story-1-1-foundation.test.mjs`:177]

### Technical Requirements

- Preserve the current static-first launch architecture: `astro.config.mjs` stays `output: 'static'`, launch pages remain server-rendered, and no database, auth, or global client-state surface is introduced by this story. [Source: `astro.config.mjs`:4, `tests/story-1-1-foundation.test.mjs`:72, `_bmad-output/planning-artifacts/architecture.md`:783]
- Keep build-time content loading as the default contract. Core content should continue to flow through content collections and shared loaders, with build failures preferred over silently shipping invalid canonical content. [Source: `src/content/config.ts`:199, `src/lib/content/get-posts.ts`:20, `_bmad-output/planning-artifacts/architecture.md`:900, `_bmad-output/planning-artifacts/architecture.md`:952]
- Future content parity should reuse existing discoverability patterns instead of creating a second metadata system. Posts already normalize `seoTitle`, `seoDescription`, and canonical paths through the same shared helper shape used elsewhere. [Source: `src/lib/content/get-posts.ts`:32, `src/lib/seo/get-page-metadata.ts`:47, `tests/story-4-2-structured-search-signals.test.mjs`:11]
- Future extensions must degrade safely. Draft or placeholder seams may exist to keep contracts validated, but they cannot force runtime credentials, publish accidental launch content, or make the primary browsing journey harder to understand. [Source: `src/content/posts/future-writing-seam.md`:6, `src/pages/posts/index.astro`:23, `_bmad-output/planning-artifacts/architecture.md`:946, `_bmad-output/planning-artifacts/epics.md`:771]
- Guard against shadow systems and duplicated truths: do not let `src/data/`, route-local transforms, or repo docs become a second source of content or IA truth alongside `src/content/` and `src/config/navigation.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md`:809, `_bmad-output/planning-artifacts/architecture.md`:815, `_bmad-output/planning-artifacts/architecture.md`:968]

### Architecture Compliance

- `src/pages/` stays route-thin and composition-only. Any future content or integration work should enter through shared helpers, not route-local fetching or schema decisions. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `_bmad-output/planning-artifacts/architecture.md`:800, `src/pages/projects/[slug].astro`:11]
- `src/lib/content/` and `src/lib/seo/` are the canonical shaping layers. Extend them when new content types need normalization or metadata, instead of pushing that responsibility into components or page files. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:805, `src/lib/content/get-posts.ts`:20, `src/lib/seo/get-page-metadata.ts`:31]
- `src/content/config.ts` remains the single schema boundary. New content types, future CMS mappings, and richer project storytelling modules must preserve schema-enforced contracts here first. [Source: `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:141, `src/content/config.ts`:164]
- `src/config/navigation.ts` is the launch-scope guardrail. Do not let reserved future routes silently become first-class navigation unless planning scope changes later. [Source: `src/config/navigation.ts`:2, `tests/story-1-4-navigation.test.mjs`:26]
- `public/` remains the passthrough asset boundary for trustworthy static assets; future integrations should not move the site's core proof or resume path behind external storage/services for MVP. [Source: `_bmad-output/planning-artifacts/architecture.md`:814, `tests/story-4-4-sustainable-site-architecture.test.mjs`:65]

### Library / Framework Requirements

- Implement against the current repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 4.5 is not an upgrade story. [Source: `package.json`:16]
- Latest stable versions reviewed during story creation are `astro@6.0.7`, `tailwindcss@4.2.2`, `zod@4.3.6`, `typescript@5.9.3`, and `wrangler@4.75.0`. Keep implementation compatible with the currently pinned repo versions unless upgrade work is scoped separately. [Source: npm package registry reviewed 2026-03-20, `package.json`:16]
- Keep the implementation aligned with Astro content collections and Zod validation rather than introducing CMS SDK dependencies, client data layers, or analytics packages into the launch baseline. [Source: `src/content/config.ts`:4, `_bmad-output/planning-artifacts/architecture.md`:126, `_bmad-output/planning-artifacts/architecture.md`:134]

### File Structure Requirements

- Most relevant canonical seams for this story are `src/config/navigation.ts`, `src/content/config.ts`, `src/content/posts/future-writing-seam.md`, `src/lib/content/get-posts.ts`, `src/lib/seo/get-page-metadata.ts`, `src/pages/posts/index.astro`, and `src/pages/posts/[slug].astro`. [Source: `src/config/navigation.ts`:6, `src/content/config.ts`:141, `src/lib/content/get-posts.ts`:20, `src/pages/posts/index.astro`:6]
- Launch routes whose trust path must remain stable are `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. [Source: `src/pages/index.astro`:18, `src/pages/projects/index.astro`:13, `src/pages/projects/[slug].astro`:36, `src/pages/resume.astro`:8]
- Shared shell and high-risk integration surfaces are `src/layouts/BaseLayout.astro`, `src/components/navigation/`, and any future `src/lib/integrations/` or `src/pages/api/` directories if they are introduced narrowly in this story. [Source: `src/layouts/BaseLayout.astro`:32, `_bmad-output/planning-artifacts/architecture.md`:787, `_bmad-output/planning-artifacts/architecture.md`:806]
- Tests should stay in `tests/` using the established Node-based pattern. Extend existing Story 1.4, 4.2, and 4.4 tests before inventing a new test harness. [Source: `package.json`:14, `tests/story-1-4-navigation.test.mjs`:13, `tests/story-4-2-structured-search-signals.test.mjs`:72, `tests/story-4-4-sustainable-site-architecture.test.mjs`:22]

### Testing Requirements

- Reuse Story 1.4 navigation tests to keep future writing/blog routes out of launch navigation and preserve the bounded primary route contract. [Source: `tests/story-1-4-navigation.test.mjs`:13]
- Reuse Story 4.2 tests to keep posts as a valid but dormant future seam, preserve shared discoverability contracts, and ensure draft placeholder content does not publish accidentally. [Source: `tests/story-4-2-structured-search-signals.test.mjs`:11, `tests/story-4-2-structured-search-signals.test.mjs`:72]
- Reuse Story 4.4 tests to protect the static-first global shell, the absence of third-party script creep, and the rule that optional integrations stay removable from the core evaluation journey. [Source: `tests/story-4-4-sustainable-site-architecture.test.mjs`:22, `tests/story-4-4-sustainable-site-architecture.test.mjs`:65]
- Reuse Story 1.1 foundation tests to preserve the absence of `src/pages/api/`, `src/db/`, and `src/auth/` unless this story introduces a tightly scoped seam with matching guardrails. [Source: `tests/story-1-1-foundation.test.mjs`:72, `tests/story-1-1-foundation.test.mjs`:177]
- Run `npm run check`, `npm test`, and `npm run build` as the definition-of-done gate. [Source: `package.json`:8, `package.json`:9, `package.json`:14]

### Previous Story Intelligence

- Story 4.4 established the key rule that optional integrations must stay optional, removable, and isolated while Home, Projects, Resume, and Contact remain complete and trustworthy without them. Story 4.5 should extend that same logic to future writing/content seams and CMS-style expansion paths. [Source: `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:45, `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:49]
- Story 4.4 also emphasized following the real repo over stale or aspirational examples. That matters here because some architecture references describe future directories that do not yet exist. [Source: `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:48, `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:65]
- The most relevant working seams from Story 4.4 remain `src/content/config.ts`, `src/config/navigation.ts`, `src/layouts/BaseLayout.astro`, and the cross-story regression tests. Story 4.5 should build on those instead of inventing a parallel mechanism. [Source: `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:61, `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:75, `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`:83]

### Git Intelligence Summary

- Recent commit history stays story-scoped and surgical: `Complete story 4.4 review fixes`, `Complete story 4.3 review fixes`, `Add posts placeholder directory marker`, `Complete story 4.2 review fixes`, and `Complete story 4.1 metadata rollout`. Keep Story 4.5 similarly focused on guardrails, seams, and regression protection rather than broad redesign. [Source: `git log --oneline -5` reviewed 2026-03-20]
- Recent changed files show that the most credible extension points are navigation config, content schemas, posts helpers/routes, metadata helpers, deployment notes, and tests. Story 4.5 should stay in those established patterns. [Source: `git log -5 --name-only --pretty=format:'---%n%h %s'` reviewed 2026-03-20]

### Latest Tech Information

- `astro` latest stable: `6.0.7`; repo currently uses `^5.18.0`. Keep Story 4.5 within Astro 5 conventions for content collections, static routing, and page composition. [Source: npm package registry reviewed 2026-03-20, `package.json`:18]
- `tailwindcss` latest stable: `4.2.2`; repo currently uses `^4.2.1`. No styling-stack migration is required here. [Source: npm package registry reviewed 2026-03-20, `package.json`:19]
- `zod` latest stable: `4.3.6`; repo already matches. Continue using Zod-backed schema validation as the hard quality gate for future content seams. [Source: npm package registry reviewed 2026-03-20, `package.json`:20]
- `typescript` latest stable: `5.9.3`; repo already matches. Keep any new seam-protection helpers or tests simple and typed. [Source: npm package registry reviewed 2026-03-20, `package.json`:23]
- `wrangler` latest stable: `4.75.0`; repo currently uses `^4.73.0`. Treat Wrangler as deployment support only, not as justification for runtime platform complexity in this story. [Source: npm package registry reviewed 2026-03-20, `package.json`:24]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story file, git history, npm registry checks, and direct repo analysis.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The repo already contains a valid dormant publishing seam: a `posts` collection, a hidden draft placeholder entry, a normalized posts helper, and reserved posts routes. The implementation should strengthen this seam without promoting it into launch navigation. [Source: `src/content/config.ts`:141, `src/content/posts/future-writing-seam.md`:1, `src/lib/content/get-posts.ts`:20, `src/pages/posts/index.astro`:14]
- The current metadata layer is already generalized enough for future content types. Reuse `createPageMetadata` and `createMetadataFromDiscoverability` rather than branching into route-specific metadata utilities. [Source: `src/lib/seo/get-page-metadata.ts`:31, `src/lib/seo/get-page-metadata.ts`:47]
- Project detail pages already model the right principle for future depth: optional references and richer story modules may exist, but they are framed as additive proof rather than baseline comprehension requirements. [Source: `src/components/projects/ProjectDetailPage.astro`:124, `src/content/config.ts`:164]
- The architecture document still contains stale AWS deployment language, but the real repo baseline is Cloudflare Pages plus a Wrangler fallback. Follow the real deployment baseline, not outdated planning text, if Story 4.5 touches docs or integration notes. [Source: `_bmad-output/planning-artifacts/architecture.md`:957, `astro.config.mjs`:6, `infrastructure/cloudflare/README.md`:1]

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 4.5 requirements, Epic 4 context, and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - long-term ownership, scope, privacy, and integration constraints
- `_bmad-output/planning-artifacts/architecture.md` - route-thin architecture, content boundaries, and extension seam rules
- `_bmad-output/planning-artifacts/ux-design-specification.md` - launch IA priorities and future-writing-out-of-launch guidance
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md` - rationale for clarifying Story 4.5 scope boundaries
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md` - warnings about future-writing seams being mistaken for MVP scope
- `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md` - previous story learnings about optional integrations and repo-reality guardrails
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `package.json`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/config/navigation.ts`, `src/content/config.ts`, `src/content/posts/future-writing-seam.md`, `src/lib/content/get-posts.ts`, `src/lib/seo/get-page-metadata.ts`, `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`, `src/components/projects/ProjectDetailPage.astro`, `tests/story-1-1-foundation.test.mjs`, `tests/story-1-4-navigation.test.mjs`, `tests/story-4-2-structured-search-signals.test.mjs`, and `tests/story-4-4-sustainable-site-architecture.test.mjs` - current implementation baseline and seam-protection coverage
- npm package registry pages for `astro`, `tailwindcss`, `zod`, `typescript`, and `wrangler` reviewed on 2026-03-20

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `4.5` and reconciled to sprint tracker key `4-5-future-ready-content-and-integration-boundaries` via `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md`, `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md`, and previous story file `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`.
- Repo analysis for Story 4.5 was delegated to explore subagents for planning-context extraction and repo seam analysis, then reconciled with direct reads of the repo's actual content, routes, config, shell, helpers, and tests.
- Additional repo files reviewed directly: `package.json`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/config/navigation.ts`, `src/content/config.ts`, `src/content/posts/future-writing-seam.md`, `src/lib/content/get-posts.ts`, `src/lib/seo/get-page-metadata.ts`, `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`, `src/components/projects/ProjectDetailPage.astro`, and the existing story tests.
- Git intelligence gathered from `git log --oneline -5` and `git log -5 --name-only --pretty=format:'---%n%h %s'` on 2026-03-20.
- Web research gathered from `npm view astro version`, `npm view tailwindcss version`, `npm view zod version`, `npm view typescript version`, and `npm view wrangler version` on 2026-03-20.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md` before finalizing the story.
- Implemented Story 4.5 seam guardrails by adding `src/config/future-seams.ts`, wiring dormant posts copy through the shared seam policy, and tightening the future-writing placeholder wording.
- Extended regression coverage in `tests/story-1-4-navigation.test.mjs`, `tests/story-4-2-structured-search-signals.test.mjs`, and `tests/story-4-4-sustainable-site-architecture.test.mjs`, then verified the red-green cycle with an initial failing `npm test` run before re-running the suite successfully.
- Final validation commands completed successfully on 2026-03-20: `npm run check`, `npm test`, and `npm run build`.

### Implementation Plan

- Codify launch-only navigation and future-extension boundaries in a shared source file so tests and dormant route copy can reference one repo-owned policy surface.
- Keep the reserved posts seam explanatory and non-launch by routing posts index copy through the shared boundary policy and reinforcing the placeholder draft intent.
- Extend existing Node-based regression tests to lock launch navigation, schema-first content ownership, optional integration seams, and static-build safety before validating with the full quality gate.

### Completion Notes List

- Story context created for `4-5-future-ready-content-and-integration-boundaries` with emphasis on keeping future content and integration seams extension-ready without widening MVP scope.
- Analysis confirms the repo already contains the core future-writing seam and shared discoverability contracts; the main implementation risk is scope creep or accidental promotion of those seams into launch-critical behavior.
- The story identifies the most credible implementation surfaces as navigation config, content schemas, posts helpers/routes, shared metadata helpers, and regression tests.
- Manual checklist validation confirmed the story includes business context, architecture rules, previous-story learnings, anti-pattern prevention, file guidance, testing commands, and latest-version notes relevant to implementation.
- Added `src/config/future-seams.ts` as a single repo-owned boundary policy for launch navigation, launch scope, authored-content ownership, future integration directories, CMS mapping, route-thin launch behavior, and shell independence.
- Updated `src/pages/posts/index.astro` and `src/content/posts/future-writing-seam.md` so the reserved writing seam stays explanatory, dormant, and explicitly outside the launch trust path.
- Extended the existing Node regression suite to cover Story 4.5 guardrails and verified the implementation with `npm run check`, `npm test`, and `npm run build`.
- Code review fixes removed the duplicate launch-navigation source of truth by deriving future seam labels from `src/config/navigation.ts`, routed the full posts seam status through the shared policy, and strengthened regression checks to verify the canonical dependency and shipped output.

### File List

- `_bmad-output/implementation-artifacts/4-5-future-ready-content-and-integration-boundaries.md`
- `src/config/future-seams.ts`
- `src/content/posts/future-writing-seam.md`
- `src/pages/posts/index.astro`
- `tests/story-1-4-navigation.test.mjs`
- `tests/story-4-2-structured-search-signals.test.mjs`
- `tests/story-4-4-sustainable-site-architecture.test.mjs`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-20: Codified future seam guardrails in source, reinforced dormant posts copy, extended regression coverage, and re-validated with `npm run check`, `npm test`, and `npm run build`.
- 2026-03-20: Completed AI code review fixes by removing the duplicate navigation truth, wiring the full shared seam status into the posts route, strengthening regression coverage, and syncing story tracking to done.

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-20
- Outcome: Approve
- Findings addressed:
  - Derived future seam launch labels from `src/config/navigation.ts` so the story keeps a single canonical launch navigation contract.
  - Updated `src/pages/posts/index.astro` to render the entire shared seam-status policy and eliminate route-local copy drift.
  - Strengthened Story 4.5 regression coverage to assert canonical navigation reuse, reusable seam guards, and built-output messaging instead of only checking for dead string literals.
  - Reconciled the story file list and status metadata with the reviewed implementation outcome.
- Verification:
  - `npm run check`
  - `npm test`
  - `npm run build`
- Notes:
  - Acceptance Criteria reviewed against implementation and now pass.
  - Future content and integration seams remain reserved, schema-first, and non-blocking for the launch journey.
