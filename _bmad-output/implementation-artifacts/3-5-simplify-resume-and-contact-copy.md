# Story 3.5: Simplify Resume and Contact Copy

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a hiring audience member,
I want resume and contact pages to use simple, direct language,
so that I can take the next step without wading through explanations of the site's internal flow.

## Acceptance Criteria

1. Given a visitor opens the resume page, when they scan the introduction, actions, and supporting text, then the page explains what is available and what to do next in concise recruiter-friendly language, and it avoids labels or descriptions centered on evaluation mechanics, handoffs, or system intent.
2. Given a visitor opens the contact page, when they look for outreach guidance, then the page prioritizes the direct action, fallback path, and useful context to include, and helper text stays focused on user value instead of narrating internal routing or recovery concepts unless recovery is actually needed.
3. Given the resume and contact routes are reviewed together, when their public-facing copy is compared with the homepage and projects pages, then the tone is consistent, confident, and easy to skim, and the core evaluation path remains clear without being explicitly explained to the visitor.

## Tasks / Subtasks

- [x] Rewrite resume content fields for direct action (AC: 1, 3)
  - [x] Update `src/content/resume/overview.md` headings, intros, summaries, and fallback copy to remove meta framing.
  - [x] Preserve clear resume actions and fallback behavior.
- [x] Simplify contact route copy and labels (AC: 2, 3)
  - [x] Replace internal labels like `Contact recovery guidance` with plain user-facing language.
  - [x] Tighten paragraphs and helper text around email action, fallback, and next steps.
- [x] Validate tone consistency (AC: 1, 2, 3)
  - [x] Review the resume and contact routes together against the homepage/project tone.
  - [x] Keep recovery text only where it materially helps the visitor complete the action.

## Dev Notes

- The current resume copy uses phrases such as `Evaluation handoff` and `A calm handoff from proof to formal experience`, which are polished but still inward-facing. [Source: `src/content/resume/overview.md`:5, `src/content/resume/overview.md`:33]
- The current contact route includes labels like `Contact recovery guidance` and multiple paragraphs explaining the interaction model instead of simply helping the visitor reach out. [Source: `src/pages/contact.astro`:38]
- UX and architecture guidance now explicitly discourage labels like `handoff`, `proof flow`, `recovery guidance`, and `evaluation path` unless a true recovery state requires them. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:345, `_bmad-output/planning-artifacts/architecture.md`:523]

### Project Structure Notes

- Primary touchpoints: `src/content/resume/overview.md` and `src/pages/contact.astro`.
- Keep the existing resume/link behavior and privacy-conscious contact path intact; this is a copy and framing story, not a feature rewrite.

### References

- `_bmad-output/planning-artifacts/epics.md`:701
- `_bmad-output/planning-artifacts/prd.md`:98
- `_bmad-output/planning-artifacts/ux-design-specification.md`:367
- `_bmad-output/planning-artifacts/architecture.md`:523
- `src/content/resume/overview.md`:1
- `src/pages/contact.astro`:1

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Implementation Plan

- Rewrite resume content fields to lead with direct actions, short descriptions, and plain fallback guidance.
- Simplify contact page copy so the email action, fallback path, and useful outreach context are immediately scannable.
- Add copy-focused regression coverage for resume and contact language, then rerun existing related suites plus full repo validation.

### Debug Log References

- Draft created from corrected-course workflow outputs and approved artifact changes.
- `node --test tests/story-3-5-simplify-resume-and-contact-copy.test.mjs` (red)
- `node --test tests/story-3-5-simplify-resume-and-contact-copy.test.mjs && node --test tests/story-3-1-resume-access.test.mjs && node --test tests/story-3-4-contact-feedback.test.mjs`
- `node --test tests/story-3-5-simplify-resume-and-contact-copy.test.mjs` (review fix validation)
- `npm test`
- `npm run check`
- `npm run build`

### Completion Notes List

- Story drafted and ready for implementation planning.
- Rewrote `src/content/resume/overview.md` to remove inward-facing language and keep resume actions, summaries, and fallback text recruiter-friendly.
- Simplified `src/pages/contact.astro` copy and labels so direct outreach, fallback email use, and next-step guidance are easier to scan.
- Added story-specific regression coverage and updated related resume/contact tests to validate the new public-facing copy without changing the static-first behavior.
- Follow-up review fixes aligned homepage and project copy with the same direct tone, removed remaining system-facing fallback wording, and expanded Story 3.5 coverage to catch cross-route tone drift.
- Full validation passed with `npm test`, `npm run check`, and `npm run build`.

### File List

- `_bmad-output/implementation-artifacts/3-5-simplify-resume-and-contact-copy.md`
- `src/components/projects/ProjectDetailPage.astro`
- `src/components/projects/ProjectStructureSummary.astro`
- `src/content/pages/home.md`
- `src/content/projects/portfolio-refresh.md`
- `src/content/resume/overview.md`
- `src/lib/content/get-home-page.ts`
- `src/lib/content/get-projects.ts`
- `src/lib/seo/site-metadata.ts`
- `src/pages/contact.astro`
- `src/pages/projects/[slug].astro`
- `src/pages/projects/index.astro`
- `src/content/config.ts`
- `tests/story-1-3-homepage-hero.test.mjs`
- `tests/story-3-1-resume-access.test.mjs`
- `tests/story-3-4-contact-feedback.test.mjs`
- `tests/story-3-5-simplify-resume-and-contact-copy.test.mjs`
- `tests/story-4-3-owner-controlled-content-updates.test.mjs`

## Senior Developer Review (AI)

### Reviewer

Chris

### Date

2026-03-22

### Outcome

Approve

### Review Notes

- Initial review found Story 3.5 tone drift against the homepage and project surfaces, plus an incomplete File List.
- Fixed the remaining inward-facing copy on `src/content/pages/home.md`, `src/content/projects/portfolio-refresh.md`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/ProjectDetailPage.astro`, and `src/components/projects/ProjectStructureSummary.astro`.
- Removed the last implementation-facing helper sentence from `src/pages/contact.astro` so fallback guidance stays user-facing.
- Expanded `tests/story-3-5-simplify-resume-and-contact-copy.test.mjs` to verify direct tone across homepage, project, resume, and contact outputs.
- Validation after fixes passed with `node --test tests/story-3-5-simplify-resume-and-contact-copy.test.mjs`, `npm test`, and `npm run build`.

## Change Log

- 2026-03-22: Simplified resume and contact copy, added story-specific copy regression coverage, and refreshed related tests to match the new public-facing language.
- 2026-03-22: Code review fixed homepage/project tone drift, removed remaining implementation-facing contact copy, expanded Story 3.5 regression coverage, and marked the story done.
