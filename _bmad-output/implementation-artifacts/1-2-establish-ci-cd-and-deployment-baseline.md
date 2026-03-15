# Story 1.2: Establish CI/CD and Deployment Baseline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the project connected to a minimal CI/CD and deployment baseline,
so that implementation happens on top of a repeatable, validated, production-shaped foundation.

> Status note: This story now reflects the approved `Cloudflare Pages` deployment baseline for the project. Earlier AWS-oriented implementation details were superseded after the hosting-direction change.

## Acceptance Criteria

1. Given the starter project is initialized, when the implementation foundation is prepared, then a Git-based CI workflow runs the agreed validation and build steps for pull requests or pushes, and failures are visible before deployment activity continues.
2. Given the production hosting approach is part of the approved architecture, when deployment foundations are configured, then the project includes a bounded setup for `Cloudflare Pages` deployment for the static Astro site, and deployment responsibilities are separated from application content and code.
3. Given the deployment path is reviewed before feature work expands, when the repository and planning artifacts are checked, then the CI/CD and deployment setup matches the static-first architecture, and it does not introduce unnecessary runtime services, databases, or optional integrations.
4. Given Story 1.2 is complete, when later implementation stories begin, then they can rely on a working local build and CI validation baseline, and they do not need to redefine deployment strategy, hosting shape, or pipeline ownership.

## Tasks / Subtasks

- [x] Add a bounded CI workflow for validation on push and pull request (AC: 1, 4)
  - [x] Create `.github/workflows/ci.yml` with pinned third-party actions, explicit Node setup, `npm ci`, `npm run check`, `npm test`, and `npm run build`
  - [x] Pin the workflow to the current supported Node line for Astro 5 and make failures stop the job before any deploy path can run
  - [x] Keep permissions minimal and avoid adding publish credentials to the CI-only job
- [x] Add a bounded deployment baseline and deployment notes for `Cloudflare Pages` (AC: 2, 3, 4)
  - [x] Prefer native Git-connected deployment from `main` in `Cloudflare Pages` as the MVP production path
  - [x] Keep GitHub Actions focused on CI validation unless a later need justifies a custom deploy workflow
  - [x] Document the minimum production shape for `fahey.vip` in Cloudflare without introducing unnecessary platform add-ons
- [x] Separate environment/deployment responsibilities from application code (AC: 2, 3)
  - [x] Add or update `.env.example` with public build-time placeholders only (`PUBLIC_*` if needed); keep deployment credentials out of app env files
  - [x] Expand `infrastructure/README.md` with the minimum production shape and ownership boundaries: `Cloudflare Pages`, `fahey.vip`, HTTPS/custom-domain responsibility, secure-header responsibility, versioned-asset preference, and repository-hosted content expectations
  - [x] Document that protected-branch enforcement lives in GitHub repository settings and that any future custom deploy workflow must publish only the exact CI-validated commit for `main`
  - [x] Add a narrowly scoped Cloudflare note under `infrastructure/cloudflare/` that captures hosting target, domain setup, Git-connected deployment, and optional future dynamic seams without introducing infrastructure-as-code scope
- [x] Extend verification so future stories inherit a reliable baseline (AC: 1, 4)
  - [x] Add or update tests to assert the static-first baseline remains intact: `npm ci`, `npm run check`, `npm test`, `npm run build`, CI guardrails, Cloudflare-oriented deployment notes, no committed deployment secrets, and no drift back to AWS hosting assumptions
  - [x] Fix the `npm test` script so CI discovers Story 1.2 guardrail tests without relying on a literal recursive glob in GitHub Actions shells
  - [x] Run `npm test` and `npm run build` locally after workflow-related changes
  - [x] Review the final diff to confirm no runtime services, database scaffolding, auth, or optional integrations were added
  - [x] Ensure deployment guidance stays explicit and readable without introducing unnecessary platform credentials into the repo
  - [x] Keep this story out of scope for feature UI, content modeling, blog/posts work, analytics, CMS, or serverless application endpoints

## Dev Notes

### Developer Context

- Story 1.2 exists because the architecture already expects CI/CD plus a bounded production deployment baseline early in the sequence; this story prevents Story 1.1 from becoming an infrastructure catch-all and gives later feature stories a stable foundation. [Source: `_bmad-output/planning-artifacts/architecture.md`:378]
- Epic 1 is still about first-visit trust and identity, but this story serves that goal indirectly by making the implementation baseline repeatable, reviewable, and deployable without changing the app architecture. [Source: `_bmad-output/planning-artifacts/epics.md`:187]
- Keep the scope tightly bounded to validation/build automation and minimum deployment-safe configuration. Do not absorb content-modeling, design-system, route, SEO, contact, or feature UI work here. [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md`:260]
- Story 1.1 already established the Astro baseline and intentionally deferred CI/deployment concerns to this story. Reuse that baseline instead of restructuring the app. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:66]

### Technical Requirements

- Preserve the greenfield, static-first, content-first architecture: no database, no authentication, no public application API, and no global client state at launch. [Source: `_bmad-output/planning-artifacts/epics.md`:95]
- The production hosting baseline is `Cloudflare Pages` for the static Astro site with managed delivery, HTTPS-only access, repository-hosted content where practical, and Git-based CI/CD. [Source: `_bmad-output/planning-artifacts/epics.md`:99]
- CI must run the agreed validation and build steps for pushes or pull requests so failures are visible before deployment continues. [Source: `_bmad-output/planning-artifacts/epics.md`:228]
- Deployment configuration must keep secrets and environment responsibilities separate from application code and content. [Source: `_bmad-output/planning-artifacts/epics.md`:233]
- Environment handling should stay minimal: local development values, build-time public configuration, and CI/CD deployment secrets only. Do not invent broader runtime configuration. [Source: `_bmad-output/planning-artifacts/architecture.md`:331]
- Deployments should prefer native `Cloudflare Pages` Git integration for MVP launch rather than a custom publish pipeline. [Source: `_bmad-output/planning-artifacts/architecture.md`:324]
- The deploy path must be gated on successful CI for the protected branch so deployment cannot bypass validation. [Source: `_bmad-output/planning-artifacts/epics.md`:230; `_bmad-output/planning-artifacts/architecture.md`:324]
- Keep deployment credentials, if ever needed for a custom workflow, in platform or repository settings rather than application env files.

### Architecture Compliance

- Follow the implementation sequence literally: Story 1.2 comes after starter initialization and before content-model work, design-system work, and user-facing page implementation. [Source: `_bmad-output/planning-artifacts/architecture.md`:379]
- Keep the stack static-first and route-thin. This story should touch delivery plumbing, not page composition or content schemas unless test coverage needs a small update. [Source: `_bmad-output/planning-artifacts/architecture.md`:467]
- Prefer `Cloudflare Pages` as the primary managed delivery layer for the static site. [Source: `_bmad-output/planning-artifacts/architecture.md`:322]
- Avoid drift-prone manual deployment steps. The architecture expects install -> validate/build -> deploy the static site through the approved hosting path. [Source: `_bmad-output/planning-artifacts/architecture.md`:324]
- Keep future integrations optional. Do not use this story to introduce serverless APIs, analytics, CMS wiring, newsletter tooling, or writing/blog launch features. [Source: `_bmad-output/planning-artifacts/architecture.md`:134]

### Library / Framework Requirements

- Existing repo baseline to preserve: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`. [Source: `package.json`:13]
- Astro 5 currently requires Node `v18.20.8`, `v20.3.0`, or `v22.0.0+`. Choose one supported CI runtime explicitly instead of relying on runner defaults. [Source: Astro install docs, 2026-03-10]
- Current GitHub Actions references favor `actions/checkout@v6` and `actions/setup-node@v6`; `setup-node` recommends specifying an explicit Node version and can cache npm dependencies when configured. [Source: `https://github.com/actions/checkout`, 2026-03-10; `https://github.com/actions/setup-node`, 2026-03-10]
- Current implementation guidance favors keeping GitHub Actions focused on validation while letting the hosting platform own production deploy orchestration for MVP.
- Managed static hosting still benefits from file versioning as the primary cache strategy for frequently changing static assets.

### File Structure Requirements

- Add CI workflow under `.github/workflows/`. If a custom deploy workflow is introduced later, keep it minimal and justified.
- Keep deployment notes and any narrow supporting documentation in `infrastructure/`, not mixed into app source folders. [Source: `_bmad-output/planning-artifacts/architecture.md`:912]
- Keep `.env.example` minimal and root-level if added. It should document only safe placeholders and public build-time fields, never live secrets. [Source: `_bmad-output/planning-artifacts/architecture.md`:915]
- Add a focused Cloudflare note under `infrastructure/cloudflare/` so hosting and deployment expectations have one canonical home.
- Treat `dist/` as build output only. Deployment publishes from it; do not commit generated artifacts or make it a source directory. [Source: `_bmad-output/planning-artifacts/architecture.md`:908]
- Avoid expanding `src/pages/api/`, `src/data/`, or integration seams in this story. Those are reserved boundaries, not launch requirements. [Source: `_bmad-output/planning-artifacts/architecture.md`:789]

### Testing Requirements

- Reuse the existing baseline verification path: `npm test` and `npm run build` are already the canonical local checks. [Source: `package.json`:6]
- Preserve and extend the foundation tests in `tests/story-1-1-foundation.test.mjs` rather than replacing them with unrelated tooling. [Source: `tests/story-1-1-foundation.test.mjs`:11]
- CI should at minimum validate install, test, and production build. Future stories will rely on this baseline, so it must be simple and dependable. [Source: `_bmad-output/planning-artifacts/epics.md`:243]
- Keep accessibility/performance posture intact: no unnecessary hydration, no runtime-heavy deployment helpers in the site, and no changes that undermine the mobile-first fast-load target. [Source: `_bmad-output/planning-artifacts/architecture.md`:290; `_bmad-output/planning-artifacts/prd.md`:431]
- Review the final repository state to ensure no runtime services, databases, or optional integrations were introduced under the banner of deployment work. [Source: `_bmad-output/planning-artifacts/epics.md`:238]
- Verification should fail if the repo drifts back toward AWS-hosting assumptions, if deployment credentials move into app env files, or if the baseline stops matching the static-first Cloudflare deployment direction. These are story-level regressions, not optional review comments.

### Previous Story Intelligence

- Story 1.1 already created the root-level Astro app, strict TypeScript config, Tailwind Vite integration, canonical `src/content/config.ts`, and the `infrastructure/` directory placeholder. Build on those exact choices rather than redoing setup. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:147]
- Story 1.1 review work fixed a content-config placement issue by making `src/content/config.ts` the canonical schema boundary with a re-export shim from `src/content.config.ts`. Do not regress that file ownership while updating tests or docs. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:202]
- The previous story used Node-based tests as lightweight guardrails and verified `npm test`, `npm run dev -- --host 127.0.0.1`, and `npm run build`. Keep Story 1.2 verification similarly small and reliable. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:134]
- Story 1.1 explicitly excluded CI workflows, deploy workflows, cache/header policy automation, and secret management from its scope. Those deferred items are the core of this story. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:66]

### Git Intelligence Summary

- Recent commit pattern is short and imperative, for example: `Complete Story 1.1 Astro foundation baseline`, `Updated initial sprint status tracker`, `Fix planning artifacts`. Follow that terse style if this story is committed later. [Source: `git log -5 --oneline`, 2026-03-10]
- The working tree was clean during story creation, so this story can assume the current repo reflects the approved Story 1.1 baseline without unrelated local drift. [Source: `git status --short`, 2026-03-10]
- Most likely files to touch are new workflow files in `.github/workflows/`, root env/example files, `infrastructure/README.md`, and a small extension of the existing foundation test. Keep app source changes minimal. [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`:155]

### Latest Tech Information

- `actions/checkout@v6` is the current major line and recommends `permissions: contents: read` by default. [Source: `https://github.com/actions/checkout`, 2026-03-10]
- `actions/setup-node@v6` is the current major line; latest release shown during story creation was `v6.3.0`, and it recommends explicit `node-version` plus committed lockfiles. [Source: `https://github.com/actions/setup-node`, 2026-03-10]
- Managed static hosting still benefits from immutable, versioned assets as the primary cache strategy for frequently changed static files.

### Project Context Reference

- No `project-context.md` file was present anywhere in the repository during workflow execution, so this story relies on the PRD, architecture, UX specification, sprint change proposal, implementation readiness report, and previous story file as its full context set.

### Story Completion Status

- Status: `done`
- Completion note: CI/CD baseline reviewed, hardened, and verified against the implemented guardrails.

### Project Structure Notes

- The repo already contains planning artifacts, BMAD workflow files, and implementation artifacts at the root. CI/deploy setup must coexist with those assets instead of assuming a brand-new empty application repository.
- `infrastructure/README.md` currently only reserves space for later deployment notes, so Story 1.2 should turn it into the canonical bounded deployment handoff rather than creating duplicate ad hoc docs elsewhere.

### Anti-Pattern Prevention

- Do not add a runtime server, SSR adapter, database, auth provider, CMS, analytics platform, or public API.
- Do not reintroduce AWS deployment assumptions, `S3`, `CloudFront`, or `Route 53` into the canonical MVP baseline.
- Do not commit deployment credentials or API tokens into `.env`, workflow files, or docs.
- Do not create manual one-off deployment steps that diverge from the Git-based workflow.
- Do not replace the simple `Cloudflare Pages` baseline with a custom deployment workflow unless there is a clear need.
- Do not use this story to introduce blog/posts launch scope, optional integrations, or user-facing feature work.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 1 and Story 1.2 requirements and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - static-first product goals, NFRs, and ownership constraints
- `_bmad-output/planning-artifacts/architecture.md` - CI/CD, `Cloudflare Pages`, file structure, and implementation sequence
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm, dependable UX posture that the baseline must protect
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md` - scope-boundary warnings for Story 1.2
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md` - rationale for adding Story 1.2 early in Epic 1
- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md` - previous-story learnings and implementation baseline

### Definition of Done

- `ci.yml` validates `npm ci`, `npm run check`, `npm test`, and `npm run build` on pull requests and pushes with third-party actions pinned to immutable SHAs.
- The documented deployment baseline uses `Cloudflare Pages` with Git-connected deployment from `main`.
- Docs define `Cloudflare Pages` hosting, `fahey.vip` ownership, repository-hosted content preference, and versioned-asset preference.
- `.env.example` contains no deployment credentials.
- Tests fail if workflow security, deploy gating, or static-only constraints regress.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- No `project-context.md` file was present under the repository.
- Story target auto-discovered from `_bmad-output/implementation-artifacts/sprint-status.yaml` as the first backlog story: `1-2-establish-ci-cd-and-deployment-baseline`.
- Recent git history reviewed: `Complete Story 1.1 Astro foundation baseline`, `Updated initial sprint status tracker`, `Fix planning artifacts`, `Add brainstorming and project docs`, `Add generated planning artifacts`.
- Latest technical references checked during story creation included Astro install docs, `actions/checkout`, `actions/setup-node`, and current managed static-hosting guidance.
- Added failing test coverage for the CI workflow guardrails before implementing `.github/workflows/ci.yml`.
- Added failing test coverage for deployment baseline guardrails before updating the infrastructure docs and tests.
- Added failing test coverage for deployment documentation boundaries and `.env.example` separation before updating infrastructure docs.
- Ran the full local verification pass with `npm test`, `npm run build`, and a targeted final diff review for scope drift.
- Reproduced the GitHub Actions regression locally by asserting the `npm test` script must not rely on a literal `**` glob in CI shells.
- Revalidated the baseline after changing the test script to `node --test tests/*.test.mjs` and reran `npm run check`, `npm test`, and `npm run build`.

### Implementation Plan

- Add the CI workflow first with explicit Node pinning, minimal permissions, and no deployment credentials.
- Extend the existing foundation test file with workflow guardrails before each workflow/doc change.
- Add the deployment notes and environment examples in the story task order while preserving the static-first baseline.
- Replace the recursive test glob with a CI-safe pattern and lock the regression down with a package-script assertion in the existing guardrail test file.

### Completion Notes List

- Story file created for future implementation. No production code changed by this create-story workflow.
- Implemented `.github/workflows/ci.yml` for `main` pushes and pull requests with immutable action pins, `npm ci`, `npm run check`, `npm test`, and `npm run build` using Node `20.3.0`.
- Added a root `npm run check` script using `astro sync && tsc --noEmit` so CI can enforce Astro/type/content validation without extra dependency audit debt.
- Verified the CI-only workflow keeps `contents: read` permissions and does not introduce deployment credentials.
- Documented the approved `Cloudflare Pages` deployment baseline, domain ownership boundaries for `fahey.vip`, and repository-hosted content preference in `infrastructure/README.md` and `infrastructure/cloudflare/README.md`.
- Added a minimal `.env.example` with no deployment credentials and kept deployment concerns out of application env files.
- Extended the foundation guardrail tests to cover the Cloudflare-oriented deployment baseline, deployment-secret absence, and continued static-only scope boundaries.
- Final validation passed with `npm test` and `npm run build`, and the resulting baseline remains static-first with no runtime services, database scaffolding, auth, analytics, CMS wiring, or serverless endpoints added.
- Fixed the `npm test` script for GitHub Actions by replacing the literal recursive glob with `node --test tests/*.test.mjs` and added a regression assertion so the CI-safe pattern stays in place.

### File List

- `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `infrastructure/cloudflare/README.md`
- `package.json`
- `tests/story-1-1-foundation.test.mjs`
- `_bmad-output/implementation-artifacts/tests/test-summary.md`

## Senior Developer Review (AI)

### Reviewer

- Chris

### Review Date

- 2026-03-10

### Outcome

- Approve

### Findings Summary

- Replaced the previous AWS-oriented deployment assumptions with `Cloudflare Pages` hosting guidance and matching guardrails.
- Extended `tests/story-1-1-foundation.test.mjs` so the deployment guardrails enforce the new Cloudflare-oriented baseline.
- Reconciled the story File List with the actual current workspace changes and documented the generated test summary artifact.
- After the review fixes, Story 1.2 now satisfies the approved deployment-baseline expectations and remains within the static-first architecture boundary.

### Change Log

- 2026-03-10: Added the bounded CI workflow baseline and matching workflow guardrail tests for Story 1.2.
- 2026-03-10: Added the initial deployment baseline and documented deployment ownership boundaries.
- 2026-03-15: Replaced the AWS-oriented deployment baseline with the approved `Cloudflare Pages` direction and updated docs/tests to match.
- 2026-03-10: Tightened post-review guardrails by adding Astro validation, exact validated-commit deployment checkout, and explicit branch-protection ownership notes.
- 2026-03-10: Hardened the review fixes by pinning third-party actions, replacing `astro check` with a zero-audit-debt validation script, and broadening baseline deployment guardrails.
- 2026-03-10: Senior developer review approved the story after verification passed and no HIGH or MEDIUM issues remained.
- 2026-03-10: Completed final verification, marked Story 1.2 ready for review, and confirmed the implementation stayed within the static-first architecture boundary.
- 2026-03-10: Reopened Story 1.2 to fix GitHub Actions test discovery by replacing the literal recursive Node test glob and revalidating the CI baseline.
- 2026-03-10: Review fix: restricted deploy to successful push-triggered CI runs, extended the guardrail tests for that gate, and reconciled the story File List with the current workspace state.
