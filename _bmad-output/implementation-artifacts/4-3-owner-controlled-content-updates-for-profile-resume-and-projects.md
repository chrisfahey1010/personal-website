# Story 4.3: Owner-Controlled Content Updates for Profile, Resume, and Projects

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want to update profile content, resume access, and project entries without unnecessary friction,
so that the site stays current as a long-term professional asset.

## Acceptance Criteria

1. Given Chris needs to update profile, resume, or project information, when he edits the source content for those areas, then the update path is clear and consistent across content types, and routine changes do not require restructuring page templates.
2. Given a content update is made to a core professional asset, when the site is rebuilt or republished, then the updated information appears in the correct public location, and existing browsing paths continue to work normally.
3. Given profile, resume, and project content changes over time, when Chris maintains the site across multiple updates, then the system continues to feel owner-controlled rather than dependent on a third-party editing workflow, and the site remains a durable professional asset under Chris's control.

## Tasks / Subtasks

- [x] Create one clear, source-controlled update path for homepage/profile, resume, and projects without introducing a CMS or third-party editing dependency (AC: 1, 3)
  - [x] Keep repository-owned authored content as the system of record and preserve the static-first, no-database architecture. Do not add a CMS, remote admin flow, database, or service-backed editing surface for this story. [Source: `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/architecture.md`:156, `_bmad-output/planning-artifacts/epics.md`:724, `_bmad-output/planning-artifacts/prd.md`:418]
  - [x] Ensure routine owner edits happen in obvious, durable locations: homepage/profile content should remain or become content-authored under `src/content/`, project updates should stay in `src/content/projects/*.md`, and resume updates should have an equally clear owner-edit seam instead of being split across helper logic and route copy. [Source: `src/content/pages/home.md`:1, `src/content/projects/portfolio-refresh.md`:1, `src/content/projects/team-dashboard-modernization.md`:1, `src/lib/content/get-resume.ts`:4, `src/pages/resume.astro`:14]
  - [x] If introducing new resume/profile content files or schemas, make the editing path consistent with the existing content-collection model rather than inventing a parallel data source. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:56]

- [x] Centralize schema and normalization contracts so content updates do not require template rewrites or route-specific data shaping (AC: 1, 2, 3)
  - [x] Keep `src/content/config.ts` as the single schema-definition boundary for authored content. Extend it if Story 4.3 introduces resume/profile collection fields; do not spread validation into routes or duplicate schema declarations. [Source: `_bmad-output/planning-artifacts/architecture.md`:481, `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:56]
  - [x] Keep `src/lib/content/` as the canonical normalization/read layer. Routes should consume shaped data from helpers instead of hand-assembling content contracts inline. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:885, `src/lib/content/get-projects.ts`:149, `src/lib/content/get-resume.ts`:43]
  - [x] Preserve stable naming conventions (`camelCase` content fields, typed helper contracts, route-thin composition) so future content edits do not create drift between content files, helper outputs, and rendered pages. [Source: `_bmad-output/planning-artifacts/architecture.md`:444, `_bmad-output/planning-artifacts/architecture.md`:517, `_bmad-output/planning-artifacts/architecture.md`:610]

- [x] Remove current owner-control weak spots in resume and profile content without breaking the established evaluation flow (AC: 1, 2, 3)
  - [x] Refactor the current resume implementation so important resume-page copy, freshness metadata, and fallback guidance are owner-maintainable through a clear content seam instead of being spread across `src/lib/content/get-resume.ts` and `src/pages/resume.astro`. [Source: `src/lib/content/get-resume.ts`:4, `src/pages/resume.astro`:14, `_bmad-output/planning-artifacts/prd.md`:183]
  - [x] Keep the canonical downloadable resume asset in the static public boundary (`public/resume/chris-resume.pdf`) and preserve truthful fallback behavior when the asset is missing or stale. [Source: `src/lib/content/get-resume.ts`:4, `tests/story-3-1-resume-access.test.mjs`:15, `_bmad-output/planning-artifacts/prd.md`:217]
  - [x] Consider whether hardcoded homepage/profile credibility bullets in `src/components/sections/HeroSection.astro` should move into content so profile updates do not require Astro component edits for routine copy changes. Preserve the same trust-first editorial structure if you make that move. [Source: `src/components/sections/HeroSection.astro`:35, `src/content/pages/home.md`:1, `_bmad-output/planning-artifacts/ux-design-specification.md`:199]

- [x] Preserve route-thin rendering and existing browsing paths after content updates (AC: 1, 2)
  - [x] Keep `src/pages/index.astro`, `src/pages/resume.astro`, and project routes thin: they should read normalized content and metadata, not become the place where owner-editable copy is manually recomposed. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/index.astro`:13, `src/pages/resume.astro`:9, `src/lib/content/get-projects.ts`:149]
  - [x] Ensure updated profile, resume, and project content still renders in the correct public routes with stable navigation, dependable browser behavior, and unchanged core evaluation handoffs between Home, Projects, Resume, and Contact. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:419, `src/config/navigation.ts`:6, `tests/story-3-1-resume-access.test.mjs`:88]
  - [x] Do not introduce client-side editing UI, hydration-dependent content loading, or runtime-only content sources. Content changes must remain visible in build output and preserve crawlable static HTML. [Source: `_bmad-output/planning-artifacts/architecture.md`:242, `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/prd.md`:230]

- [x] Protect long-term ownership, trust, and privacy constraints while making updates easier (AC: 2, 3)
  - [x] Keep updates repository-hosted wherever practical and avoid dependencies that weaken portability, ownership, privacy, or solo-maintainer simplicity. [Source: `_bmad-output/planning-artifacts/prd.md`:418, `_bmad-output/planning-artifacts/prd.md`:444, `_bmad-output/planning-artifacts/architecture.md`:171]
  - [x] Preserve current, reachable trust assets after edits: resume access, project links, metadata, and page hierarchy must remain truthful and intact after rebuilds. [Source: `_bmad-output/planning-artifacts/prd.md`:425, `_bmad-output/planning-artifacts/prd.md`:449, `_bmad-output/planning-artifacts/prd.md`:451]
  - [x] Keep third-party services, CMS workflows, analytics expansion, newsletter tooling, and other post-MVP seams explicitly out of scope for this story. This story is about owner-controlled source updates, not adding remote editorial platforms. [Source: `_bmad-output/planning-artifacts/architecture.md`:134, `_bmad-output/planning-artifacts/architecture.md`:141, `_bmad-output/planning-artifacts/prd.md`:114]

- [x] Add regression protection for the owner-update workflow and validation gates (AC: 1, 2, 3)
  - [x] Extend or add Node-based tests that verify the canonical content locations, schema/read-layer boundaries, and rendered output for homepage/profile, resume, and project updates. Favor the existing `node:test` plus build-output assertion style in `tests/`. [Source: `package.json`:14, `tests/run-node-tests.mjs`:1, `tests/story-1-3-homepage-hero.test.mjs`:34, `tests/story-3-1-resume-access.test.mjs`:15, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:23]
  - [x] Validate that routine update paths do not break core public browsing: homepage still builds with authored profile content, projects still use the normalized content contract, and resume behavior remains truthful for available and unavailable asset states. [Source: `tests/story-1-3-homepage-hero.test.mjs`:83, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:103, `tests/story-3-1-resume-access.test.mjs`:40]
  - [x] Run `npm run check`, `npm test`, and `npm run build` to confirm content-schema validation, regression coverage, and static output integrity before marking the story complete. [Source: `package.json`:8, `.github/workflows/ci.yml`:29]

## Dev Notes

### Developer Context

- Story 4.3 is the maintenance/ownership follow-on to Story 4.2, but it shifts from discoverability to update ergonomics. The goal is not a new product surface; it is making homepage/profile, resume, and project updates feel like a durable source-controlled workflow Chris can keep using after launch. [Source: `_bmad-output/planning-artifacts/epics.md`:704, `_bmad-output/planning-artifacts/prd.md`:181]
- The repo already has strong owner-edit seams for homepage/profile and projects: `src/content/pages/home.md` and `src/content/projects/*.md` are schema-backed, build-time validated, and routed through thin pages/helpers. Story 4.3 should preserve and likely extend that pattern rather than replacing it. [Source: `src/content/pages/home.md`:1, `src/content/projects/portfolio-refresh.md`:1, `src/content/projects/team-dashboard-modernization.md`:1, `src/content/config.ts`:56, `src/lib/content/get-projects.ts`:149]
- The biggest current gap is resume maintenance. The resume PDF asset is in the right public boundary, but freshness, summary text, and fallback guidance are code-owned in `src/lib/content/get-resume.ts` and `src/pages/resume.astro`, which makes routine updates less consistent than profile/project editing. [Source: `src/lib/content/get-resume.ts`:4, `src/pages/resume.astro`:14]
- There is also a smaller profile-content ownership gap: homepage hero data is content-authored, but `HeroSection.astro` still hardcodes several credibility bullets and signal lines. Decide whether those should remain implementation text or move into authored content for consistency with this story's acceptance criteria. [Source: `src/content/pages/home.md`:1, `src/components/sections/HeroSection.astro`:35]
- Success is not merely "content can be changed". Success means updates remain clear, consistent, schema-backed, route-thin, static-first, and trustworthy after rebuild, with no broken navigation or evaluation flow. [Source: `_bmad-output/planning-artifacts/prd.md`:185, `_bmad-output/planning-artifacts/prd.md`:451]

### Technical Requirements

- Preserve the static-first, no-database, no-auth, no-public-API launch architecture. Story 4.3 must not add a CMS, admin dashboard, external editor, or runtime write path. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:126, `_bmad-output/planning-artifacts/architecture.md`:240]
- Use Astro content collections plus Zod validation as the preferred owner-edit model wherever content is authored. New content seams should fail fast on invalid required data instead of silently publishing broken trust assets. [Source: `_bmad-output/planning-artifacts/architecture.md`:159, `_bmad-output/planning-artifacts/architecture.md`:162, `_bmad-output/planning-artifacts/architecture.md`:570]
- Keep routine edits repository-owned and Git-reviewable. Chris should be able to update profile, project, and resume-related content without changing page templates for normal content edits. [Source: `_bmad-output/planning-artifacts/prd.md`:183, `_bmad-output/planning-artifacts/prd.md`:418, `_bmad-output/planning-artifacts/architecture.md`:171]
- Maintain truthful rendering and fallback behavior for resume access. If the PDF is missing or stale, the route must stay useful and honest instead of exposing broken or misleading actions. [Source: `tests/story-3-1-resume-access.test.mjs`:61, `_bmad-output/planning-artifacts/prd.md`:217]
- Preserve the evaluation journey across Home, Projects, Resume, and Contact. Content maintenance improvements must not break navigation clarity, browser behavior, or next-step handoffs. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:419, `_bmad-output/planning-artifacts/ux-design-specification.md`:447]

### Architecture Compliance

- `src/content/config.ts` is the single schema-definition boundary. Add or extend content models there rather than scattering schema logic through helpers or routes. [Source: `_bmad-output/planning-artifacts/architecture.md`:813, `src/content/config.ts`:56]
- `src/lib/content/` remains the canonical read/normalization layer. If Story 4.3 adds a richer resume/profile helper, keep route logic thin by normalizing there. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `src/lib/content/get-resume.ts`:43, `src/lib/content/get-projects.ts`:149]
- `src/pages/` should stay route-thin. `src/pages/index.astro` and `src/pages/resume.astro` should consume shaped content and metadata rather than becoming bespoke composition layers for owner-edited copy. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/index.astro`:13, `src/pages/resume.astro`:37]
- `src/content/` remains the system of record for authored content, while `public/` remains the passthrough asset boundary for static files like the resume PDF and project media. [Source: `_bmad-output/planning-artifacts/architecture.md`:812, `_bmad-output/planning-artifacts/architecture.md`:814]
- Keep metadata and discoverability in shared boundaries. If moving resume/profile content into source files changes metadata inputs, continue using shared metadata helpers and layout boundaries instead of creating route-local SEO drift. [Source: `src/lib/seo/get-page-metadata.ts`:31, `src/lib/seo/site-metadata.ts`:8, `src/layouts/BaseLayout.astro`:14]

### Library / Framework Requirements

- Implement against the current repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 4.3 is not a framework-upgrade story. [Source: `package.json`:16]
- Latest stable versions reviewed during story creation are `astro@6.0.5`, `tailwindcss@4.2.1`, `zod@4.3.6`, `typescript@5.9.3`, and `wrangler@4.75.0`. Keep implementation compatible with the current pinned repo versions unless upgrade work is explicitly scoped separately. [Source: npm package registry reviewed 2026-03-17, `package.json`:16]
- Continue using Astro content collections and Markdown content entries for owner-authored content where practical. Do not replace that with a remote or runtime-managed system. [Source: `_bmad-output/planning-artifacts/architecture.md`:156, `_bmad-output/planning-artifacts/architecture.md`:159]

### File Structure Requirements

- Existing owner-edit content boundaries already in use: `src/content/pages/home.md` for homepage/profile entry content and `src/content/projects/*.md` for project entries. Build on these patterns. [Source: `src/content/pages/home.md`:1, `src/content/projects/portfolio-refresh.md`:1]
- Existing resume implementation boundaries: `public/resume/chris-resume.pdf`, `src/lib/content/get-resume.ts`, and `src/pages/resume.astro`. Story 4.3 likely needs to reorganize these into a more owner-editable pattern without losing current fallback behavior. [Source: `src/lib/content/get-resume.ts`:4, `src/pages/resume.astro`:9]
- Keep navigation scope unchanged in `src/config/navigation.ts`; this story is about owner-controlled updates to existing launch assets, not adding new launch destinations. [Source: `src/config/navigation.ts`:6]
- Preserve the `public/` asset boundary for downloadable resume files and project media. Do not move those into ad hoc directories or runtime-managed storage for MVP. [Source: `_bmad-output/planning-artifacts/architecture.md`:814, `_bmad-output/planning-artifacts/prd.md`:420]
- Tests should remain in `tests/` using the established Node-based regression pattern, with new Story 4.3 coverage added there if needed. [Source: `_bmad-output/planning-artifacts/architecture.md`:928, `tests/run-node-tests.mjs`:26]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. CI already enforces those three commands in that order. [Source: `package.json`:8, `.github/workflows/ci.yml`:29]
- Reuse the Story 1.3 pattern for homepage/profile contract testing: schema-backed authored content should fail fast when content drifts from the expected contract. [Source: `tests/story-1-3-homepage-hero.test.mjs`:34]
- Reuse the Story 2.3 pattern for project update safety: projects should continue to flow through canonical content schemas, normalized helpers, and truthful build output. [Source: `tests/story-2-3-project-structure-and-discoverability.test.mjs`:23]
- Reuse and extend the Story 3.1 pattern for resume access: validate both the happy path and fallback path so owner updates cannot silently break the resume route or its trust-preserving recovery behavior. [Source: `tests/story-3-1-resume-access.test.mjs`:15]
- Verify static output after content changes. Built HTML should remain crawlable, hydration-free for these content paths, and aligned with the rendered content and navigation flow. [Source: `_bmad-output/planning-artifacts/architecture.md`:950, `tests/story-2-3-project-structure-and-discoverability.test.mjs`:137]

### Previous Story Intelligence

- Story 4.2 reinforced a critical pattern: extend shared seams instead of inventing new systems. It centralized discoverability through shared SEO helpers and content normalization, and explicitly protected launch scope from becoming a broader publishing platform. Story 4.3 should apply the same discipline to content maintenance. [Source: `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`:51, `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`:165]
- Story 4.2 also documented an existing duplication/drift risk between shared metadata constants and route-specific overrides. If Story 4.3 touches resume/profile metadata while centralizing content, avoid deepening that drift. [Source: `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`:100]
- The accepted implementation style in the current codebase is helper-first and route-thin: shape content and metadata in shared helpers, then let routes render normalized data. Reuse that pattern instead of mixing content logic into Astro routes. [Source: `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`:98]
- Story 4.2 preserved future seams without making them launch-critical. For Story 4.3, preserve the same scope discipline around CMS, analytics, or other editing systems: document seams if necessary, but do not turn them into MVP dependencies. [Source: `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`:99]

### Git Intelligence Summary

- Recent commits show a story-scoped, surgical implementation pattern rather than broad refactors: `Add posts placeholder directory marker`, `Complete story 4.2 review fixes`, `Complete story 4.1 metadata rollout`, `Mark completed epics done`, and `Clarify contact fallback guidance`. Story 4.3 should similarly focus on content-update seams and tests without mixing unrelated design or infrastructure changes. [Source: `git log --pretty=format:'%h %s' -5` reviewed 2026-03-17]
- Recent touched files also show where current ownership and trust work has been concentrated: `src/content/config.ts`, `src/lib/content/get-projects.ts`, `src/lib/seo/*`, `src/pages/resume.astro`, and the story-scoped tests. That makes them likely extension points for Story 4.3. [Source: `git log -5 --name-only --pretty=format:'---%n%h %s'` reviewed 2026-03-17]

### Latest Tech Information

- `astro` latest stable: `6.0.5`; repo currently uses `^5.18.0`. Story 4.3 should stay within the current Astro 5 content-collection and route conventions already established in the repo. [Source: npm package registry reviewed 2026-03-17, `package.json`:18]
- `tailwindcss` latest stable: `4.2.1`; matches the repo. Story 4.3 is not a styling-system migration. [Source: npm package registry reviewed 2026-03-17, `package.json`:19]
- `zod` latest stable: `4.3.6`; matches the repo. Use the current Zod-backed schema approach for any new content contract introduced by this story. [Source: npm package registry reviewed 2026-03-17, `package.json`:20]
- `typescript` latest stable: `5.9.3`; matches the repo. Keep helper contracts typed and aligned with content schemas. [Source: npm package registry reviewed 2026-03-17, `package.json`:23]
- `wrangler` latest stable: `4.75.0`; repo currently uses `^4.73.0`. No deployment-tooling changes are required for this story. [Source: npm package registry reviewed 2026-03-17, `package.json`:24]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story file, git history, and direct repo analysis.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The real repo uses `src/content/config.ts` with a top-level `src/content.config.ts` re-export boundary, not just the aspirational architecture examples. Follow the real current structure. [Source: `src/content.config.ts`:1, `src/content/config.ts`:1]
- The strongest existing owner-edit pattern is content-file driven: homepage/profile content in `src/content/pages/home.md` and project content in `src/content/projects/*.md`, normalized through helpers and rendered by thin routes. Story 4.3 should align resume/profile maintenance to that pattern where practical. [Source: `src/pages/index.astro`:13, `src/lib/content/get-projects.ts`:149]
- The resume asset boundary is already correct in `public/resume/`, but the resume content boundary is not yet as clean as the pages/projects model. This is the main structural inconsistency the story should address. [Source: `src/lib/content/get-resume.ts`:24, `src/pages/resume.astro`:14]
- `HeroSection.astro` contains hardcoded profile/trust copy alongside content-driven hero props. Treat that as a likely maintainability variance from the architecture's content-as-system-of-record principle. [Source: `src/components/sections/HeroSection.astro`:27]
- Launch navigation remains intentionally narrow and typed to `Home`, `Projects`, `Resume`, and `Contact`. Do not use Story 4.3 as an excuse to widen launch IA. [Source: `src/config/navigation.ts`:1, `_bmad-output/planning-artifacts/ux-design-specification.md`:419]

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 4.3 requirements, Epic 4 context, and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - sustainable ownership journey, long-term ownership FRs/NFRs, trust and update constraints
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, schema/read-layer boundaries, and maintainability rules
- `_bmad-output/planning-artifacts/ux-design-specification.md` - trust-first navigation and stable evaluation-flow requirements
- `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md` - previous story learnings and helper-first implementation patterns
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `package.json`, `.github/workflows/ci.yml`, `src/content.config.ts`, `src/content/config.ts`, `src/content/pages/home.md`, `src/content/projects/*.md`, `src/components/sections/HeroSection.astro`, `src/lib/content/get-projects.ts`, `src/lib/content/get-resume.ts`, `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/resume.astro`, `src/config/navigation.ts`, `tests/story-1-3-homepage-hero.test.mjs`, `tests/story-2-3-project-structure-and-discoverability.test.mjs`, `tests/story-3-1-resume-access.test.mjs`, and `tests/run-node-tests.mjs` - current implementation baseline for Story 4.3
- npm package registry pages for `astro`, `tailwindcss`, `zod`, `typescript`, and `wrangler` reviewed on 2026-03-17

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target auto-discovered from `_bmad-output/implementation-artifacts/sprint-status.yaml` as `4-3-owner-controlled-content-updates-for-profile-resume-and-projects`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and previous story file `_bmad-output/implementation-artifacts/4-2-structured-search-signals-for-projects-and-future-publishing.md`.
- Repo analysis for Story 4.3 was delegated to explore subagents for codebase seams and planning-context extraction, then reconciled with direct file reads of the current content, route, SEO, and test boundaries.
- Additional repo files reviewed directly: `package.json`, `.github/workflows/ci.yml`, `src/content.config.ts`, `src/content/config.ts`, `src/content/pages/home.md`, `src/content/projects/portfolio-refresh.md`, `src/content/projects/team-dashboard-modernization.md`, `src/components/sections/HeroSection.astro`, `src/lib/content/get-projects.ts`, `src/lib/content/get-resume.ts`, `src/lib/seo/get-page-metadata.ts`, `src/lib/seo/site-metadata.ts`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/resume.astro`, `src/config/navigation.ts`, `tests/story-1-3-homepage-hero.test.mjs`, `tests/story-2-3-project-structure-and-discoverability.test.mjs`, `tests/story-3-1-resume-access.test.mjs`, and `tests/run-node-tests.mjs`.
- Git intelligence gathered from `git log -5 --pretty=format:'%h %s'` and `git log -5 --name-only --pretty=format:'---%n%h %s'` on 2026-03-17.
- Web research gathered from `npm view astro version`, `npm view tailwindcss version`, `npm view zod version`, `npm view typescript version`, and `npm view wrangler version` on 2026-03-17.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Implementation updated `src/content/config.ts` and `src/content/pages/home.md` to move homepage credibility, next-step, and signal copy into schema-backed content.
- Added `src/content/resume/overview.md`, normalized homepage/resume helpers in `src/lib/content/`, and kept `src/pages/index.astro` and `src/pages/resume.astro` route-thin.
- Added and updated regression coverage in `tests/story-3-1-resume-access.test.mjs`, `tests/story-3-2-guided-evaluation-path.test.mjs`, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`, and `tests/story-4-3-owner-controlled-content-updates.test.mjs`.
- Validation completed with `npm run check`, `npm test`, and `npm run build` on 2026-03-17.

### Implementation Plan

- Extend the existing content-collection boundary instead of introducing a parallel owner-edit system.
- Move homepage hero trust copy and resume route copy into authored content while keeping normalization in `src/lib/content/`.
- Keep `public/resume/chris-resume.pdf` as the canonical downloadable asset and preserve missing/stale fallback behavior.
- Expand Node-based regression tests to verify content seams, route-thin rendering, and truthful build output for both available and unavailable resume states.

### Completion Notes List

- Story context created for `4-3-owner-controlled-content-updates-for-profile-resume-and-projects` with emphasis on consistent owner-edit seams across homepage/profile, resume, and project content.
- Analysis confirms homepage/profile and project updates already follow the desired content-first pattern, while resume updates remain the main owner-control gap due to helper- and route-owned copy.
- The story explicitly protects launch scope by keeping CMS, third-party editing workflows, analytics expansion, and other remote authoring systems out of scope.
- The story highlights likely implementation seams: `src/content/config.ts`, `src/lib/content/get-resume.ts`, `src/pages/resume.astro`, `src/content/pages/home.md`, `src/components/sections/HeroSection.astro`, and the existing content-regression tests.
- Manual checklist validation confirmed the story includes business context, architecture rules, previous-story learnings, anti-pattern prevention, route/file guidance, testing commands, and latest-version notes relevant to implementation.
- Added schema-backed homepage hero support so credibility bullets, next-step guidance, and profile signal copy now live in `src/content/pages/home.md` and flow through `src/lib/content/get-home-page.ts` into a thinner `src/pages/index.astro`.
- Added `src/content/resume/overview.md` plus a normalized `getResumePageContent()` helper so resume metadata, freshness data, fallback messaging, and summary copy are owner-maintainable without editing route code.
- Preserved the canonical `public/resume/chris-resume.pdf` asset boundary and verified truthful fallback behavior when the PDF is unavailable.
- Added Story 4.3 regression coverage and updated related journey/metadata tests; passed `npm run check`, `npm test`, and `npm run build`.
- Review fixes completed: moved homepage journey handoff copy into content, wired the resume eyebrow and metadata title to owner-authored resume content, removed the unsafe resume content helper cast, and expanded regression coverage to catch those seams.

### File List

- `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/sections/HeroSection.astro`
- `src/content/config.ts`
- `src/content/pages/home.md`
- `src/content/resume/overview.md`
- `src/lib/content/get-home-page.ts`
- `src/lib/content/get-resume.ts`
- `src/pages/index.astro`
- `src/pages/resume.astro`
- `tests/story-3-1-resume-access.test.mjs`
- `tests/story-3-2-guided-evaluation-path.test.mjs`
- `tests/story-4-1-search-metadata-and-crawlability.test.mjs`
- `tests/story-4-3-owner-controlled-content-updates.test.mjs`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-19
- Outcome: Approve
- Findings addressed:
  - Fixed the broken resume owner-edit seam by rendering `eyebrow` from `src/content/resume/overview.md` and moving the resume metadata title to owner-authored `seoTitle`.
  - Fixed the incomplete homepage owner-edit seam by moving the homepage journey next-step title and intro into `src/content/pages/home.md` and normalizing them through `src/lib/content/get-home-page.ts`.
  - Removed the unsafe `getEntry as unknown as ...` cast from `src/lib/content/get-resume.ts`.
  - Strengthened regression coverage so Story 4.3 now asserts the rendered resume eyebrow, owner-authored resume metadata title, and owner-authored homepage journey framing.
- Verification:
  - `npm run check`
  - `npm test`
  - `npm run build`
- Notes:
  - Acceptance Criteria reviewed against implementation and now pass.
  - Route-thin composition remains intact for homepage and resume routes.
  - Astro still emits non-blocking duplicate-id warnings for `home` and `overview` during content sync, but validation and build output succeed.

## Change Log

- 2026-03-17: Moved homepage hero trust copy and resume route copy into schema-backed content, added shared normalization helpers, extended owner-update regression coverage, and validated with `npm run check`, `npm test`, and `npm run build`.
- 2026-03-19: Completed code-review fixes, updated owner-authored homepage and resume seams, expanded regression coverage, and approved the story as done.
