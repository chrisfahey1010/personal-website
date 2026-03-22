# Story 1.8: Integrate Approved Professional Portrait

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a first-time visitor,
I want to see a professional portrait of Chris on the home page,
so that the site feels personal, credible, and immediately trustworthy.

## Acceptance Criteria

1. Given an approved portrait asset is available, when the home page hero renders, then the portrait appears in the intended hero position on supported desktop and mobile layouts, and it loads as part of the static-first experience without requiring client-side enhancement.
2. Given the portrait is rendered in the hero, when accessibility and responsive behavior are reviewed, then the image uses meaningful alt text, appropriate dimensions, and responsive presentation, and the experience retains a clear fallback only when the canonical portrait asset is unavailable.
3. Given a visitor lands on the home page under normal launch conditions, when they form a first impression, then the portrait strengthens professional trust without crowding the core identity copy, and it feels integrated with the site's visual system rather than decorative.

## Tasks / Subtasks

- [x] Add the canonical portrait asset and content references (AC: 1, 2)
  - [x] Place the approved portrait in the `public/` image boundary using the repo's static asset conventions.
  - [x] Add or update homepage content fields for the portrait path and alt text so the hero consumes one canonical source.
- [x] Wire the portrait into the homepage hero cleanly (AC: 1, 2, 3)
  - [x] Update the homepage route/composition to pass the portrait fields into `HeroSection.astro`.
  - [x] Preserve the existing fallback behavior only for true missing-asset cases.
- [x] Verify responsive, accessibility, and visual fit (AC: 2, 3)
  - [x] Review desktop and mobile hero layouts for balance, cropping, and first-screen scanability through responsive regression coverage and hero style checks.
  - [x] Confirm alt text, dimensions, and loading behavior remain aligned with the site's static-first quality bar.

## Dev Notes

- `HeroSection.astro` already supports `portraitSrc` and `portraitAlt`, so this story should complete the content/asset contract rather than invent a new component pattern. [Source: `src/components/sections/HeroSection.astro`:16]
- The UX spec already positions the portrait in the upper-right hero area and now treats it as a required launch trust signal. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:199]
- Architecture guidance now defines homepage portrait assets as `public/` static assets referenced from canonical homepage content. [Source: `_bmad-output/planning-artifacts/architecture.md`:474]
- The current homepage content and implementation ship without a real portrait, so this story closes an explicit launch gap. [Source: `src/content/pages/home.md`:1, `src/components/sections/HeroSection.astro`:66]

### Project Structure Notes

- Expected touchpoints: `public/images/`, `src/content/pages/home.md`, `src/pages/index.astro`, and `src/components/sections/HeroSection.astro`.
- Keep the route thin and continue using the existing hero props instead of moving asset logic into the component.

### References

- `_bmad-output/planning-artifacts/epics.md`:417
- `_bmad-output/planning-artifacts/prd.md`:98
- `_bmad-output/planning-artifacts/ux-design-specification.md`:199
- `_bmad-output/planning-artifacts/architecture.md`:474
- `src/components/sections/HeroSection.astro`:16
- `src/content/pages/home.md`:1

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Draft created from corrected-course workflow outputs and approved artifact changes.
- Added `tests/story-1-8-professional-portrait.test.mjs` first, confirmed it failed, then implemented the portrait content and route wiring until the new coverage passed.
- Updated the legacy portrait pairing regression in `tests/story-1-3-homepage-hero.test.mjs` so it still validates missing-alt behavior now that homepage content includes portrait fields by default.

### Implementation Plan

- Use the approved asset from `public/images/profile/chris-fahey-portrait.jpg` as the canonical portrait source for the homepage hero.
- Keep homepage content as the single source of truth for `portraitSrc` and `portraitAlt`.
- Keep `HeroSection.astro` unchanged and keep the homepage route thin by passing the portrait props explicitly.
- Tighten content validation so portrait paths must resolve to a real static asset inside the `public/images/` boundary.
- Verify the result with focused portrait tests plus full repo validation (`npm test`, `npm run check`, `npm run build`).

### Completion Notes List

- Added the approved portrait asset at `public/images/profile/chris-fahey-portrait.jpg` and wired canonical portrait metadata into `src/content/pages/home.md`.
- Updated `src/content/config.ts` so homepage portrait paths stay inside the `/images/` static boundary while letting the route-level homepage helper preserve the monogram fallback for true missing-asset cases only.
- Updated `src/lib/content/get-home-page.ts` to omit portrait props when the canonical asset is missing so the existing hero fallback remains truthful.
- Added `tests/story-1-8-professional-portrait.test.mjs` to verify canonical asset usage, missing-asset fallback behavior, and responsive hero portrait styling, and refreshed `tests/story-1-3-homepage-hero.test.mjs` to keep portrait-pairing regression coverage valid.
- Validation completed with `npm test`, `npm run check`, and `npm run build`.

### File List

- `_bmad-output/implementation-artifacts/1-8-integrate-approved-professional-portrait.md`
- `public/images/profile/chris-fahey-portrait.jpg`
- `src/content/config.ts`
- `src/content/pages/home.md`
- `src/lib/content/get-home-page.ts`
- `tests/story-1-3-homepage-hero.test.mjs`
- `tests/story-1-8-professional-portrait.test.mjs`

## Change Log

- 2026-03-22: Added the approved homepage portrait asset, connected canonical portrait content to the hero route, tightened portrait asset validation, and added regression coverage for rendered portrait output and portrait metadata handling.
- 2026-03-22: Code review fixes aligned the story file list with git reality, restored the documented missing-asset fallback path, expanded responsive portrait regression coverage, and removed internal-process copy from the homepage journey text.

## Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-22
- Outcome: Approve
- Notes:
  - Removed the false claim that `src/pages/index.astro` changed and aligned the story File List with the actual implementation.
  - Restored truthful missing-asset fallback behavior by moving the existence check into `src/lib/content/get-home-page.ts` while keeping homepage portrait paths inside the `/images/` static boundary.
  - Expanded Story 1.8 regression coverage to verify responsive hero portrait styling and the monogram fallback when the canonical portrait asset is unavailable.
  - Replaced homepage journey copy that used internal-process language so the public-facing wording stays aligned with the architecture copy guardrails.
