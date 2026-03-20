# Story 4.4: Sustainable Site Architecture with Minimal Third-Party Dependence

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the site's core value to remain operable without unnecessary external dependencies,
so that it stays maintainable, private, and resilient over time.

## Acceptance Criteria

1. Given the MVP architecture is implemented, when core identity, projects, resume, and contact pathways are delivered, then they function without requiring optional third-party services for their basic value, and non-core integrations remain isolated from the primary browsing experience.
2. Given an optional external dependency is unavailable or removed, when a visitor uses the site, then the core site remains usable for browsing and evaluation, and the failure does not block access to identity, projects, resume, or primary contact pathways.
3. Given privacy-conscious operation is a product requirement, when external services or scripts are considered, then only necessary third-party behavior is included in the core experience, and unnecessary exposure of visitor or personal data is avoided.

## Tasks / Subtasks

- [x] Codify the static-first core path so homepage, projects, resume, and contact remain independent of optional third-party services (AC: 1, 2)
  - [x] Preserve the existing repo-owned content flow for Home, Projects, and Resume through `src/content/` plus shared helpers in `src/lib/content/`; do not move core rendering to remote services, runtime APIs, or client-fetched data. [Source: `src/pages/index.astro`:13, `src/lib/content/get-home-page.ts`:33, `src/lib/content/get-projects.ts`:149, `src/lib/content/get-resume.ts`:126, `_bmad-output/planning-artifacts/architecture.md`:243]
  - [x] Keep the launch navigation contract narrow and dependable (`Home`, `Projects`, `Resume`, `Contact`) so optional integrations cannot reshape the main evaluation journey. [Source: `src/config/navigation.ts`:2, `_bmad-output/planning-artifacts/ux-design-specification.md`:59]
  - [x] If this story introduces future integration seams, make them explicitly optional and removable without changing the route-thin core pages or breaking the build output for launch routes. [Source: `_bmad-output/planning-artifacts/architecture.md`:134, `_bmad-output/planning-artifacts/architecture.md`:806, `_bmad-output/planning-artifacts/epics.md`:744]

- [x] Harden privacy-conscious and failure-tolerant boundaries around optional third-party behavior (AC: 2, 3)
  - [x] Keep contact as the lightweight, anchor-based baseline rather than introducing a form SaaS, widget, or script-dependent workflow for MVP. [Source: `src/pages/contact.astro`:28, `src/config/contact.ts`:1, `_bmad-output/planning-artifacts/epics.md`:749, `_bmad-output/planning-artifacts/ux-design-specification.md`:51]
  - [x] Ensure optional external references on project pages remain non-blocking evidence only; project proof, navigation, resume handoff, and contact handoff must still work when any external artifact is missing or ignored. [Source: `src/lib/content/get-projects.ts`:175, `_bmad-output/planning-artifacts/epics.md`:744, `_bmad-output/planning-artifacts/prd.md`:450]
  - [x] Audit shared layout and route code so no unnecessary third-party scripts, embeds, client secrets, or runtime-only SDK assumptions are introduced into the core page shell. [Source: `src/layouts/BaseLayout.astro`:32, `_bmad-output/planning-artifacts/architecture.md`:196, `_bmad-output/planning-artifacts/architecture.md`:203]

- [x] Align deployment and configuration guidance with the actual Cloudflare static-hosting baseline instead of drifting toward unnecessary infrastructure dependencies (AC: 1, 3)
  - [x] Keep `astro.config.mjs` static output, `dist/` as the deploy artifact, and the current Cloudflare-oriented baseline intact; do not add server runtime, database, auth, or public API scaffolding in this story. [Source: `astro.config.mjs`:4, `wrangler.jsonc`:5, `_bmad-output/planning-artifacts/architecture.md`:125, `tests/story-1-1-foundation.test.mjs`:72]
  - [x] Reconcile documented deployment/config guidance so it consistently reflects Cloudflare Pages plus the existing Wrangler fallback, and remove stale AWS-oriented references that weaken ownership and architectural clarity. [Source: `infrastructure/README.md`:3, `infrastructure/cloudflare/README.md`:30, `.env.example`:2]
  - [x] Keep deployment credentials and platform-specific secrets out of application env files and core site code. [Source: `infrastructure/README.md`:21, `infrastructure/cloudflare/README.md`:21, `_bmad-output/planning-artifacts/architecture.md`:203]

- [x] Add regression coverage that makes optional-dependency creep and core-path breakage hard to reintroduce (AC: 1, 2, 3)
  - [x] Add a Story 4.4 regression test that asserts the core launch routes remain static-first, do not rely on client hydration or third-party script loading, and still expose crawlable internal navigation across Home, Projects, Resume, and Contact. [Source: `tests/story-1-1-foundation.test.mjs`:72, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:59, `_bmad-output/planning-artifacts/epics.md`:739]
  - [x] Extend contact and resume safety coverage where needed so failure of optional behavior still leaves a truthful, usable recovery path. [Source: `tests/story-3-3-contact-pathways.test.mjs`:33, `tests/story-3-4-contact-feedback.test.mjs`:28, `tests/story-3-1-resume-access.test.mjs`:66]
  - [x] Run `npm run check`, `npm test`, and `npm run build` before marking the story complete so type safety, regression coverage, and static output integrity remain the release gate. [Source: `package.json`:8, `.github/workflows/ci.yml`:29]

## Dev Notes

### Developer Context

- Story 4.4 is not a feature-expansion story. The repo already follows most of the desired shape: static Astro output, repo-owned content, thin routes, direct contact, and minimal dependencies. The work here is to harden that posture, remove drift, and add guardrails that stop optional integrations from becoming core-path requirements. [Source: `astro.config.mjs`:6, `package.json`:16, `src/pages/contact.astro`:37, `_bmad-output/planning-artifacts/epics.md`:729]
- The most important product behavior to protect is the evaluation journey across Home, Projects, Resume, and Contact. Optional integrations may exist later, but they must never become prerequisites for identity, proof, resume access, or outreach. [Source: `src/config/navigation.ts`:6, `_bmad-output/planning-artifacts/prd.md`:84, `_bmad-output/planning-artifacts/ux-design-specification.md`:295]
- Privacy and ownership are part of the product value, not afterthoughts. Avoid solutions that add tracking-heavy scripts, remote editing dependencies, or runtime services just to create future flexibility. [Source: `_bmad-output/planning-artifacts/prd.md`:213, `_bmad-output/planning-artifacts/prd.md`:223, `_bmad-output/planning-artifacts/architecture.md`:225]
- There is real repo drift to account for: infrastructure docs are Cloudflare-oriented, but `.env.example` still references AWS, and planning artifacts still contain some older S3/CloudFront language. Follow the current repo reality, not stale examples. [Source: `infrastructure/README.md`:3, `infrastructure/cloudflare/README.md`:5, `.env.example`:2, `_bmad-output/planning-artifacts/architecture.md`:957]
- Success is not “no third parties anywhere.” Success is a clear rule: optional integrations stay optional, removable, and isolated, while core browsing and evaluation remain complete and trustworthy without them. [Source: `_bmad-output/planning-artifacts/epics.md`:739, `_bmad-output/planning-artifacts/epics.md`:744, `_bmad-output/planning-artifacts/epics.md`:749]

### Technical Requirements

- Preserve the launch architecture: static Astro output, no database, no auth, no public application API, and no global client state. Story 4.4 should reinforce these boundaries rather than introducing new runtime surface area. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:127, `_bmad-output/planning-artifacts/architecture.md`:129, `astro.config.mjs`:6]
- Treat source-controlled content plus Astro content collections and Zod validation as the system of record for core site content. Do not move primary content rendering to remote stores, third-party CMS platforms, or ad hoc data fetches. [Source: `_bmad-output/planning-artifacts/architecture.md`:150, `_bmad-output/planning-artifacts/architecture.md`:159, `src/content/config.ts`:67]
- Keep build-time content loading as the default communication pattern. Build failures are preferable to silently shipping invalid or dependency-broken core content. [Source: `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:248, `_bmad-output/planning-artifacts/architecture.md`:570]
- Keep contact and other recovery paths truthful. If an optional dependency disappears, the UI should explain the situation plainly and preserve a usable next step rather than failing closed. [Source: `src/pages/contact.astro`:37, `src/lib/content/get-resume.ts`:172, `_bmad-output/planning-artifacts/epics.md`:744]
- Treat third-party scripts and embeds as security/privacy-sensitive changes. No client secrets in shipped code, and no script should be added unless it clearly earns its place without weakening the core experience. [Source: `_bmad-output/planning-artifacts/architecture.md`:196, `_bmad-output/planning-artifacts/architecture.md`:203]

### Architecture Compliance

- `src/pages/` must remain route-thin. Core routes should keep composing already-shaped data from shared helpers and config boundaries rather than growing route-local integration logic. [Source: `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/index.astro`:13, `src/pages/resume.astro`:5]
- `src/lib/content/` remains the canonical read/normalization layer for repo-owned content; `src/content/` remains the system of record. Optional external data, if introduced later, should not bypass those boundaries to become page-critical. [Source: `_bmad-output/planning-artifacts/architecture.md`:804, `_bmad-output/planning-artifacts/architecture.md`:812, `src/lib/content/get-home-page.ts`:33, `src/lib/content/get-projects.ts`:149]
- `src/layouts/BaseLayout.astro` is the global shell. Any third-party script or shared runtime addition there affects every launch page, so changes must be held to a much higher standard than page-local copy updates. [Source: `src/layouts/BaseLayout.astro`:32]
- `public/` remains the static passthrough boundary for trustworthy assets like the resume PDF, `robots.txt`, and share imagery. Do not move normal site assets into object storage or other services for MVP. [Source: `_bmad-output/planning-artifacts/architecture.md`:814, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:105, `tests/story-3-1-resume-access.test.mjs`:17]
- Follow the current repo structure over aspirational architecture examples when they differ. The real repo does not yet contain `src/lib/integrations/` or `src/pages/api/`, so do not invent them unless the story truly needs a small, justified seam. [Source: `tests/story-1-1-foundation.test.mjs`:177, `infrastructure/cloudflare/README.md`:45]

### Library / Framework Requirements

- Implement against the current repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 4.4 is not a framework-upgrade story. [Source: `package.json`:16]
- Latest stable versions reviewed during story creation are `astro@6.0.7`, `tailwindcss@4.2.2`, `zod@4.3.6`, `typescript@5.9.3`, and `wrangler@4.75.0`. Keep implementation compatible with current pinned repo versions unless upgrade work is explicitly scoped separately. [Source: npm package registry reviewed 2026-03-19, `package.json`:16]
- Keep Astro static output and the current Wrangler static-assets fallback aligned with `dist/`. Do not add server adapters, workers logic, or runtime platform coupling unless separately justified. [Source: `astro.config.mjs`:6, `wrangler.jsonc`:5, `infrastructure/cloudflare/README.md`:30]

### File Structure Requirements

- Core routes and shells most sensitive to this story: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/resume.astro`, and `src/pages/contact.astro`. [Source: `src/layouts/BaseLayout.astro`:32, `src/pages/index.astro`:18, `src/pages/resume.astro`:8, `src/pages/contact.astro`:10]
- Core content/config seams to preserve: `src/content/config.ts`, `src/content/pages/home.md`, `src/content/projects/*.md`, `src/content/resume/overview.md`, `src/config/navigation.ts`, and `src/config/contact.ts`. [Source: `src/content/config.ts`:67, `src/config/navigation.ts`:6, `src/config/contact.ts`:1]
- Infrastructure/config files likely to need alignment in this story: `astro.config.mjs`, `wrangler.jsonc`, `.env.example`, `infrastructure/README.md`, and `infrastructure/cloudflare/README.md`. [Source: `astro.config.mjs`:4, `wrangler.jsonc`:1, `.env.example`:1, `infrastructure/README.md`:1, `infrastructure/cloudflare/README.md`:1]
- If you add a Story 4.4 test, keep it in `tests/` using the established Node-based pattern rather than introducing a new test runner or service-dependent smoke suite. [Source: `package.json`:14, `tests/story-1-1-foundation.test.mjs`:19]
- Do not widen launch IA or add new launch destinations in this story. Preserve the existing narrow navigation and future-posts-as-seam approach. [Source: `src/config/navigation.ts`:2, `_bmad-output/planning-artifacts/epics.md`:764]

### Testing Requirements

- Reuse the Story 1.1 foundation tests to protect the static-first baseline, absence of API/auth/database scaffolding, and Cloudflare-oriented deployment posture. [Source: `tests/story-1-1-foundation.test.mjs`:69, `tests/story-1-1-foundation.test.mjs`:121, `tests/story-1-1-foundation.test.mjs`:158]
- Reuse Story 4.1 discoverability tests to ensure launch pages stay server-rendered, crawlable, and free of hydration-dependent discoverability assumptions. [Source: `tests/story-4-1-search-metadata-and-crawlability.test.mjs`:59]
- Reuse Story 3.3 and 3.4 tests to preserve the lightweight email-based contact path and prevent regression into a heavier third-party workflow. [Source: `tests/story-3-3-contact-pathways.test.mjs`:33, `tests/story-3-4-contact-feedback.test.mjs`:17]
- Reuse Story 3.1 tests to preserve truthful resume fallback behavior when a non-core asset is unavailable. [Source: `tests/story-3-1-resume-access.test.mjs`:66]
- Run `npm run check`, `npm test`, and `npm run build` as the definition-of-done verification sequence. [Source: `.github/workflows/ci.yml`:29, `package.json`:8]

### Previous Story Intelligence

- Story 4.3 already tightened owner-controlled content seams around homepage and resume content, reinforcing the rule that core site value should stay repo-authored and route-thin. Story 4.4 should preserve that pattern rather than replacing it with remote editorial or integration dependencies. [Source: `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`:55, `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`:63]
- Story 4.3 also highlighted the real current seams that matter most for sustainability: `src/content/config.ts`, `src/lib/content/get-resume.ts`, `src/pages/resume.astro`, `src/content/pages/home.md`, and related tests. Those remain likely touchpoints here. [Source: `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`:181]
- A key learning from Story 4.3 is that truthful fallback behavior is part of trust preservation. Story 4.4 should apply the same thinking to any optional dependency boundary, not just the resume asset. [Source: `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`:66, `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`:185]

### Git Intelligence Summary

- Recent commits continue the repo's story-scoped, surgical pattern: `Complete story 4.3 review fixes`, `Add posts placeholder directory marker`, `Complete story 4.2 review fixes`, `Complete story 4.1 metadata rollout`, and `Mark completed epics done`. Keep Story 4.4 similarly focused on architecture guardrails, docs/config alignment, and regression coverage rather than broad redesign work. [Source: `git log --oneline -5` reviewed 2026-03-19]
- Recent changed files show where Epic 4 work has concentrated: metadata/shared layout, content config, resume/home helpers, posts placeholder seams, and tests. These are the most credible extension points for Story 4.4. [Source: `git log -5 --name-only --pretty=format:'---%n%h %s'` reviewed 2026-03-19]

### Latest Tech Information

- `astro` latest stable: `6.0.7`; repo currently uses `^5.18.0`. Stay within existing Astro 5 route/content conventions for this story. [Source: npm package registry reviewed 2026-03-19, `package.json`:18]
- `tailwindcss` latest stable: `4.2.2`; repo currently uses `^4.2.1`. No styling-stack migration is required here. [Source: npm package registry reviewed 2026-03-19, `package.json`:19]
- `zod` latest stable: `4.3.6`; matches the repo. Continue using Zod-backed content validation for core content contracts. [Source: npm package registry reviewed 2026-03-19, `package.json`:20]
- `typescript` latest stable: `5.9.3`; matches the repo. Keep any new guardrail code/test logic typed and simple. [Source: npm package registry reviewed 2026-03-19, `package.json`:23]
- `wrangler` latest stable: `4.75.0`; repo currently uses `^4.73.0`. Treat Wrangler as an aligned fallback for static deployment, not as a reason to introduce runtime complexity. [Source: npm package registry reviewed 2026-03-19, `package.json`:24, `infrastructure/cloudflare/README.md`:30]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story file, git history, npm registry checks, infrastructure docs, and direct repo analysis.

### Story Completion Status

- Status: `done`
- Completion note: Review fixes applied, regression coverage expanded, and the validation gate passed.

### Project Structure Notes

- The real deployment baseline is Cloudflare-oriented: `astro.config.mjs` emits static output, infrastructure docs prefer Cloudflare Pages Git deployment, and `wrangler.jsonc` provides a fallback static-assets deploy path. [Source: `astro.config.mjs`:6, `infrastructure/README.md`:3, `infrastructure/cloudflare/README.md`:26, `wrangler.jsonc`:5]
- `.env.example` still contains a stale AWS note even though the active infrastructure baseline is Cloudflare. Story 4.4 is a good place to remove that mismatch so future maintainers do not infer the wrong platform dependency. [Source: `.env.example`:2]
- Contact currently keeps the email address in one canonical config file and renders a static page with plain-language fallback. That is the correct launch pattern to preserve. [Source: `src/config/contact.ts`:1, `src/pages/contact.astro`:37, `tests/story-3-4-contact-feedback.test.mjs`:17]
- `BaseLayout.astro` currently contains no third-party script tags or runtime SDK setup. Protect that global shell from optional-integration creep because any addition there would affect every launch page. [Source: `src/layouts/BaseLayout.astro`:34]
- The repo does not currently have `src/pages/api/`, `src/auth/`, `src/db/`, or `src/stores/`. Keep Story 4.4 aligned with that intentionally small launch surface. [Source: `tests/story-1-1-foundation.test.mjs`:65, `tests/story-1-1-foundation.test.mjs`:74, `tests/story-1-1-foundation.test.mjs`:177]

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 4.4 requirements, Epic 4 context, and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - long-term ownership, privacy, reliability, and anti-lock-in requirements
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, optional integration seams, and security/performance guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm, trust-preserving interaction rules and anti-patterns to avoid
- `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md` - previous story learnings about owner-controlled core seams and truthful fallbacks
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `package.json`, `.github/workflows/ci.yml`, `astro.config.mjs`, `wrangler.jsonc`, `.env.example`, `infrastructure/README.md`, `infrastructure/cloudflare/README.md`, `src/layouts/BaseLayout.astro`, `src/config/navigation.ts`, `src/config/contact.ts`, `src/content/config.ts`, `src/lib/content/get-home-page.ts`, `src/lib/content/get-projects.ts`, `src/lib/content/get-resume.ts`, `src/pages/index.astro`, `src/pages/resume.astro`, `src/pages/contact.astro`, `tests/story-1-1-foundation.test.mjs`, `tests/story-3-1-resume-access.test.mjs`, `tests/story-3-3-contact-pathways.test.mjs`, `tests/story-3-4-contact-feedback.test.mjs`, `tests/story-4-1-search-metadata-and-crawlability.test.mjs`, and `tests/story-4-3-owner-controlled-content-updates.test.mjs` - current implementation baseline and regression guardrails for Story 4.4
- npm package registry pages for `astro`, `tailwindcss`, `zod`, `typescript`, and `wrangler` reviewed on 2026-03-19

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `4.4` and reconciled to sprint tracker key `4-4-sustainable-site-architecture-with-minimal-third-party-dependence` via `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`, and previous story file `_bmad-output/implementation-artifacts/4-3-owner-controlled-content-updates-for-profile-resume-and-projects.md`.
- Repo analysis for Story 4.4 was delegated to explore subagents for current third-party seams and planning-context extraction, then reconciled with direct reads of the repo's actual content, route, config, infrastructure, and test boundaries.
- Additional repo files reviewed directly: `package.json`, `.github/workflows/ci.yml`, `astro.config.mjs`, `wrangler.jsonc`, `.env.example`, `infrastructure/README.md`, `infrastructure/cloudflare/README.md`, `src/layouts/BaseLayout.astro`, `src/config/navigation.ts`, `src/config/contact.ts`, `src/content/config.ts`, `src/lib/content/get-home-page.ts`, `src/lib/content/get-projects.ts`, `src/lib/content/get-resume.ts`, `src/lib/seo/site-metadata.ts`, `src/pages/index.astro`, `src/pages/resume.astro`, `src/pages/contact.astro`, and the existing story tests.
- Git intelligence gathered from `git log --oneline -5` and `git log -5 --name-only --pretty=format:'---%n%h %s'` on 2026-03-19.
- Web research gathered from `npm view astro version`, `npm view tailwindcss version`, `npm view zod version`, `npm view typescript version`, and `npm view wrangler version` on 2026-03-19.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md` before finalizing the story.

### Implementation Plan

- Lock the launch-path guardrails into source-level regression coverage so route-thin pages, narrow navigation, and optional-reference boundaries stay enforceable.
- Reconcile deployment documentation and env guidance around the actual Cloudflare Pages plus Wrangler static fallback baseline.
- Re-run the full repo validation gate with `npm run check`, `npm test`, and `npm run build` before moving the story to review.

### Completion Notes List

- Story context created for `4-4-sustainable-site-architecture-with-minimal-third-party-dependence` with emphasis on keeping optional integrations isolated from the core evaluation journey.
- Analysis confirms the current repo already satisfies much of the story intent through static Astro output, repo-owned content, direct email contact, and minimal runtime dependencies.
- The story identifies the main risks as optional-integration creep in global layout/shell code, stale deployment/config drift, and future adoption of scripts or services that weaken privacy or make core routes dependency-sensitive.
- The story highlights likely implementation seams in infrastructure docs/config, `BaseLayout.astro`, contact/config boundaries, and regression tests rather than broad product-surface changes.
- Manual checklist validation confirmed the story includes business context, architecture rules, previous-story learnings, anti-pattern prevention, route/file guidance, testing commands, and latest-version notes relevant to implementation.
- Added `tests/story-4-4-sustainable-site-architecture.test.mjs` to lock in the static-first launch-route contract, the absence of third-party script/widget creep, and crawlable internal navigation across Home, Projects, Resume, and Contact.
- Updated `.env.example`, `infrastructure/README.md`, and `infrastructure/cloudflare/README.md` to remove stale AWS-oriented drift, clarify `dist/` plus `wrangler.jsonc` as the static deployment fallback, and keep deployment credentials out of app env files.
- Verified the existing contact and resume recovery paths still satisfy the optional-dependency resilience requirement by passing the full validation gate: `npm run check`, `npm test`, and `npm run build`.
- Applied code-review fixes by clarifying that the bounded launch contract is the primary navigation contract, extending Story 4.4 regression coverage to built project detail pages, and removing the remaining Wrangler/Workers wording drift from Cloudflare deployment notes.

## Change Log

- 2026-03-19: Added Story 4.4 architecture guardrail regression coverage and aligned deployment/env documentation with the Cloudflare static-hosting baseline.
- 2026-03-20: Completed code-review fixes, tightened Story 4.4 review notes, expanded regression coverage to project detail pages, and marked the story done.

### File List

- `.env.example`
- `infrastructure/README.md`
- `infrastructure/cloudflare/README.md`
- `tests/story-4-4-sustainable-site-architecture.test.mjs`
- `_bmad-output/implementation-artifacts/4-4-sustainable-site-architecture-with-minimal-third-party-dependence.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-20
- Outcome: Approve
- Findings addressed:
  - Clarified the story task language so the bounded launch contract refers to the primary navigation path rather than every reserved future route seam.
  - Expanded Story 4.4 regression coverage to include built project detail pages, where optional external references actually appear.
  - Removed the remaining Wrangler fallback wording drift that implied a Worker-centric deployment path.
  - Reconciled story status metadata with the completed review outcome.
- Verification:
  - `npm run check`
  - `npm test`
  - `npm run build`
- Notes:
  - Acceptance Criteria reviewed against implementation and now pass.
  - Optional external references remain isolated to project detail evidence and do not block the core evaluation journey.
