# Story 1.1: Set Up Initial Project from Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want the project initialized from the approved Astro starter template,
so that implementation begins from the intended architectural baseline for the site.

## Acceptance Criteria

1. Given the implementation work is beginning, when the project is initialized, then it is created from the approved Astro starter template defined by the architecture, and the baseline project structure supports the planned static-first implementation approach.
2. Given the starter project has been created, when dependencies and required initial integrations are installed, then the project can run locally using the standard development workflow, and the initial configuration matches the architecture's launch constraints.
3. Given the starter setup is complete, when the repository is reviewed, then only the foundation needed for the launch implementation is present, and no unnecessary runtime services, deployment automation, database setup, or unrelated scaffolding is introduced.

## Tasks / Subtasks

- [x] Initialize the Astro app in the existing repository root using the approved starter baseline (AC: 1)
  - [x] Create the app in `.` rather than a nested `personal-website/` directory because this repo already contains `_bmad/`, `_bmad-output/`, and `docs/`
  - [x] Use the minimal Astro starter approach from the architecture handoff, adapted to the existing repo layout
  - [x] Confirm the generated baseline includes only essential Astro files, package metadata, and a working `src/pages/index.astro`
- [x] Install and configure the minimum launch-approved foundation dependencies (AC: 2)
  - [x] Install Astro and Tailwind using the current Astro/Tailwind setup path
  - [x] Configure Tailwind through the Astro/Vite-compatible integration path and import the global stylesheet once
  - [x] Set TypeScript to a strict Astro-supported baseline and keep `strict` enabled for Zod-backed schema work
- [x] Establish the architecture-aligned starter structure without premature feature implementation (AC: 1, 3)
  - [x] Create the canonical top-level app structure needed for upcoming stories: `src/pages/`, `src/layouts/`, `src/components/`, `src/content/`, `src/config/`, `src/lib/`, `src/styles/`, `src/utils/`, `src/types/`, `public/`, `tests/`, and `infrastructure/` as justified by the architecture
  - [x] Add only lightweight placeholders where they preserve agreed boundaries; do not add fake content, app APIs, auth flows, CMS wiring, analytics, or deployment scripts in this story
  - [x] Preserve `docs/`, `_bmad/`, and `_bmad-output/` as existing repo assets rather than treating the repo as empty
- [x] Encode launch guardrails into the baseline config and starter files (AC: 2, 3)
  - [x] Keep the project static-first, content-first, and low-JS by default
  - [x] Do not introduce a database, authentication, global client state, or public application API
  - [x] Prepare the codebase for Astro content collections and Zod validation without overbuilding future content types
- [x] Verify the starter baseline works locally and remains intentionally small (AC: 2, 3)
  - [x] Run the standard local commands needed for the repo baseline such as install, dev, and production build verification
  - [x] Confirm the baseline can build successfully before Story 1.2 adds CI/CD and deployment concerns
  - [x] Review generated files and remove any non-essential sample/demo code that conflicts with the planned architecture

## Dev Notes

### Developer Context

- This repo is not an empty folder. Current root contents are `_bmad-output/`, `_bmad/`, `.git/`, `.opencode/`, and `docs/`. Initialize the Astro application in the repo root and keep existing planning/docs artifacts intact.
- Story 1.1 is foundation-only. It should create the implementation baseline that later stories extend, not ship homepage design, SEO, contact flows, deployment automation, or rich content.
- Epic 1 centers first-visit trust and identity, but this specific story only establishes the approved technical baseline for that work. Future stories 1.2+ add deployment, hero content, navigation, responsiveness, accessibility, and visual-system polish.
- No previous story file exists for this epic, so there are no prior implementation learnings to inherit.

### Technical Requirements

- Use a greenfield, static-first, content-first architecture with no database, no authentication, no public application API, and no global client state at launch.
- Use Astro with file-based routing, Astro content collections, and Zod-validated schemas as the canonical content model.
- Treat build-time content loading as the default communication pattern.
- Enforce hydration-by-exception and minimal non-essential JavaScript from the very beginning.
- Keep authored content in source control and make content/schema validation a build gate as the baseline evolves.
- Support latest stable Chrome, Safari, Firefox, and Edge on desktop, plus modern Chrome and Safari-class mobile browsers.

### Architecture Compliance

- Follow the architecture implementation sequence literally for this story's scope: initialize the Astro project, add Tailwind, establish TypeScript strictness, and create the bounded foundation that later stories will build on.
- Respect the architecture's restraint-first model: no runtime-heavy patterns, no speculative backend, no service layer beyond the documented seams, and no feature work disguised as scaffolding.
- Keep pages route-thin, preserve `src/content/` as the future system of record, and avoid building parallel data/content systems.
- Treat accessibility, metadata, and performance as definition-of-done constraints even in the starter baseline.
- Do not implement Story 1.2 concerns here: CI workflows, production deployment configuration, hosting-specific cache/header policy decisions, or secret management.

### Library / Framework Requirements

- Architecture-approved stack: Astro 5, TypeScript, Tailwind 4, Astro content collections, and Zod 4. [Source: `_bmad-output/planning-artifacts/architecture.md`:976]
- Latest stable versions checked during story creation: `astro@5.18.0`, `tailwindcss@4.2.1`, `zod@4.3.6`, `typescript@5.9.3`.
- Astro install guidance favors `npm create astro@latest` and supports starter templates; use that approach, but target the current repository root rather than creating a nested folder. [Source: Astro install docs, 2026-03-10]
- Tailwind 4 for Astro uses `@tailwindcss/vite`, plugin registration in `astro.config.mjs`, and a single `@import "tailwindcss"` stylesheet entry. Do not fall back to obsolete Tailwind v3 config patterns unless the generated starter explicitly requires them. [Source: Tailwind Astro guide, 2026-03-10]
- Zod 4 is stable and expects TypeScript strict mode; keep `strict` enabled so future content schemas behave predictably. [Source: Zod docs, 2026-03-10]

### File Structure Requirements

- Use the architecture's canonical structure as the target baseline, especially `src/pages/`, `src/layouts/`, `src/components/`, `src/content/`, `src/config/`, `src/lib/`, `src/styles/`, `src/utils/`, `src/types/`, `public/`, `tests/`, and `infrastructure/`. [Source: `_bmad-output/planning-artifacts/architecture.md`:646]
- Naming rules are mandatory:
  - reusable component files: `PascalCase`
  - route files: Astro route conventions such as `index.astro`
  - directories and utility files: `kebab-case`
  - functions/variables/frontmatter fields: `camelCase`
  - collection names: plural lowercase
- Keep route files focused on composition only; reusable UI belongs in shared component layers, and schema definitions must have a single canonical home.
- Reserve future seams carefully. Empty placeholders like `src/pages/api/.gitkeep` are acceptable only when they reinforce a documented boundary; avoid generating fake posts, analytics implementations, newsletter code, or contact backends.

### Testing Requirements

- The starter baseline must run locally with the standard development workflow and pass a production build before the story is considered complete.
- Prefer baseline verification that future stories can rely on: dependency install, `astro dev`, and `astro build`.
- If TypeScript/content validation is added in this story, ensure it fails the build on invalid required content rather than silently accepting bad state.
- Preserve room for later E2E coverage in `tests/e2e/`, but do not invent broad test suites before core pages/components exist.
- Validate that the starter baseline does not introduce regressions against the architecture's performance/accessibility posture: no unnecessary hydration, no loading theater, no unstable layout patterns.

### Project Structure Notes

- The architecture's example directory tree is the north star, but this story should create only the portion needed to establish the baseline cleanly.
- Because the repository already contains planning artifacts and resume/source documents, implementation work must coexist with those assets instead of replacing repo-level structure.
- `docs/Resume_ChrisFahey.pdf` already exists, but the architecture expects the eventual public asset path to be `public/resume/chris-resume.pdf`; do not move or duplicate resume assets in this story unless doing so is necessary for the starter baseline.

### Anti-Pattern Prevention

- Do not create a second nested Astro repo inside the current repo.
- Do not add a database, auth provider, CMS, analytics platform, server runtime, or public API.
- Do not add production deploy automation yet; that belongs to Story 1.2.
- Do not scaffold blog/writing features beyond minimal reserved boundaries.
- Do not leave starter demo branding, sample content, or placeholder sections that conflict with the personal-site information architecture.

### Latest Tech Information

- Astro docs currently recommend `npm create astro@latest` for project creation and document Node support beginning at `v18.20.8`, `v20.3.0`, or `v22.0.0+`; make sure the local environment satisfies that baseline before debugging setup issues.
- Tailwind's current Astro guide is written for Tailwind `v4.2` and uses the Vite plugin path instead of the older PostCSS-first setup.
- Zod 4 is the current stable major release and explicitly calls for TypeScript strict mode.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 1 and Story 1.1 requirements and acceptance criteria
- `_bmad-output/planning-artifacts/prd.md` - MVP scope, out-of-scope boundaries, static-first product goals, accessibility and performance requirements
- `_bmad-output/planning-artifacts/architecture.md` - stack decisions, project structure, naming conventions, boundaries, and implementation sequence
- `_bmad-output/planning-artifacts/ux-design-specification.md` - interaction restraint, mobile-first expectations, accessibility posture, and anti-interruption UX rules
- `docs/Resume_ChrisFahey.pdf` - existing repo asset relevant to future resume handling

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- No prior story context file exists for this epic.
- No `project-context.md` file was present under the repository.
- `node --test tests/story-1-1-foundation.test.mjs` used as the red/green structure verification loop for the baseline setup tasks.
- `npm install`, `npm run dev -- --host 127.0.0.1`, and `npm run build` verified the local starter workflow and production build baseline.
- Code review follow-up fixed the content collection baseline, strengthened future-safe foundation tests, and reconciled the story File List with the actual git change set.

### Implementation Plan

- Create the Astro starter files directly in the repo root so the implementation coexists with `_bmad/`, `_bmad-output/`, and `docs/`.
- Install only the approved Astro 5, Tailwind 4, TypeScript, and Zod foundation, then wire Tailwind through the Vite integration path.
- Establish the canonical directory boundaries with lightweight placeholders, add a shared layout, and reserve content-collection configuration without introducing future-scope features.
- Validate the baseline with Node test smoke checks plus local dev and production build commands before marking the story complete.

### Completion Notes List

- Initialized a minimal Astro 5 starter directly in the repository root with a working `src/pages/index.astro`, shared `BaseLayout`, scoped Tailwind import, and strict TypeScript baseline.
- Installed the launch-approved Astro, Tailwind, TypeScript, and Zod dependencies and wired the starter baseline to a shared Astro content collection config with Zod-backed schema preparation.
- Created the canonical starter directories and lightweight placeholders while preserving existing `_bmad/`, `_bmad-output/`, and `docs/` assets.
- Added a lightweight `src/content/pages/` placeholder so the canonical content collection path exists without introducing authored content early.
- Added Node-based foundation tests that validate the current source tree and future-safe guardrails, then verified `npm install`, `npm test`, `npm run dev -- --host 127.0.0.1`, and `npm run build` all succeed for the baseline.

### File List

- `.gitignore`
- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `astro.config.mjs`
- `infrastructure/README.md`
- `package-lock.json`
- `package.json`
- `public/.gitkeep`
- `src/components/.gitkeep`
- `src/content/config.ts`
- `src/config/.gitkeep`
- `src/content.config.ts`
- `src/content/.gitkeep`
- `src/content/pages/.gitkeep`
- `src/env.d.ts`
- `src/layouts/BaseLayout.astro`
- `src/lib/.gitkeep`
- `src/pages/index.astro`
- `src/styles/global.css`
- `src/types/.gitkeep`
- `src/utils/.gitkeep`
- `tests/story-1-1-foundation.test.mjs`
- `tsconfig.json`

## Change Log

- 2026-03-10: Initialized the Astro baseline in the repo root, added Tailwind/TypeScript/Zod foundation config, created canonical starter directories, and verified the baseline with local smoke tests plus a production build.
- 2026-03-10: Code review fixes added a canonical shared content collection config, corrected future-fragile foundation tests, and synchronized the story File List with the actual git changes.
- 2026-03-10: Added a lightweight `src/content/pages/` placeholder to remove collection-path warnings while keeping the baseline content-free.

## Senior Developer Review (AI)

### Reviewer

Chris

### Date

2026-03-10

### Outcome

Approve

### Review Notes

- Verified all Story 1.1 acceptance criteria against the current implementation and reran `npm test`, `npm run build`, and `npm run dev -- --host 127.0.0.1`.
- Fixed the missing Astro content collection and Zod-backed schema preparation by moving the canonical schema boundary to `src/content/config.ts` and re-exporting it from `src/content.config.ts`.
- Added a placeholder `src/content/pages/` directory so the prepared collection path exists cleanly during local dev and build.
- Updated the baseline tests so they validate a fresh build and do not block legitimate future stories from adding reserved content or API seams.
- Reconciled the story File List with the actual git change set, including `src/content/config.ts` and `_bmad-output/implementation-artifacts/sprint-status.yaml`.
