# Story 4.6: Establish Public Copy Guardrails

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Chris,
I want lightweight editorial rules for public-facing copy,
so that future updates stay concise, confident, and aligned with visitor value.

## Acceptance Criteria

1. Given homepage, project, resume, and contact content is updated over time, when Chris reviews or edits public-facing copy, then a lightweight set of editorial guardrails defines the expected tone and structure, and those guardrails favor concise, recruiter-friendly, user-value-first language.
2. Given a future content update introduces labels, helper text, or section framing, when the change is reviewed against the guardrails, then internal-process narration such as handoff mechanics, evaluation logic, or design rationale is avoided unless it materially helps recovery or comprehension, and public copy remains focused on relevance, clarity, and next steps.
3. Given the editorial guardrails are documented, when planning artifacts and future story work are created, then the guidance is easy to reference from the backlog and implementation context, and it helps prevent tone drift across the site's highest-visibility pages.

## Tasks / Subtasks

- [x] Document lightweight editorial rules in planning artifacts (AC: 1, 2, 3)
  - [x] Add or refine guidance in the PRD, UX spec, architecture, and epics so the rule set is easy to find from planning work.
  - [x] Keep the rules short and operational rather than turning them into a style-guide side project.
- [x] Define review triggers for high-visibility pages (AC: 1, 2)
  - [x] Identify homepage, projects, resume, and contact as explicit editorial-review surfaces.
  - [x] Clarify when meta/internal-intent language is acceptable only for recovery or error handling.
- [x] Make the guardrails reusable in future story context (AC: 3)
  - [x] Reference the guidance in new story drafts where copy changes are expected.
  - [x] Ensure future implementation work can cite one consistent baseline.

## Dev Notes

- This story is documentation/governance work, not a UI feature. Its value is preventing repeat drift after the current copy cleanup.
- The corrected-course workflow identified planning-artifact updates as the right place to keep this guidance lightweight and enforceable. [Source: `/_bmad-output/planning-artifacts/architecture.md`:597]
- PRD, UX, architecture, and epics now carry complementary language; implementation stories should treat that as the canonical editorial baseline. [Source: `_bmad-output/planning-artifacts/prd.md`:47, `_bmad-output/planning-artifacts/ux-design-specification.md`:213, `_bmad-output/planning-artifacts/architecture.md`:523, `_bmad-output/planning-artifacts/epics.md`:779]

### Project Structure Notes

- Primary touchpoints are planning artifacts under `/_bmad-output/planning-artifacts/` plus future story drafts under `/_bmad-output/implementation-artifacts/`.
- Avoid creating a separate long-form style guide unless future scope justifies it.

### References

- `_bmad-output/planning-artifacts/epics.md`:779
- `_bmad-output/planning-artifacts/prd.md`:47
- `_bmad-output/planning-artifacts/ux-design-specification.md`:213
- `_bmad-output/planning-artifacts/architecture.md`:523

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Implementation Plan

- Add one short `Public Copy Guardrails` baseline to the PRD, UX spec, architecture, and epics.
- Reuse the same three operational rules so future copy reviews have one consistent reference point.
- Extend the create-story template so future copy-touching stories cite the same baseline in Dev Notes.

### Debug Log References

- Draft created from corrected-course workflow outputs and approved artifact changes.
- `node --test tests/story-4-6-public-copy-guardrails.test.mjs` (red)
- `node --test tests/story-4-6-public-copy-guardrails.test.mjs`
- Follow-up review fix: aligned homepage, projects, and contact copy with the documented guardrails.
- `npm test`
- `npm run check`
- `npm run build`

### Completion Notes List

- Story drafted and ready for implementation planning.
- Added a short `Public Copy Guardrails` baseline to the PRD, UX spec, architecture, and epics so public-copy guidance is easy to find from planning and backlog work.
- Standardized the baseline around concise, confident, recruiter-friendly, user-value-first language; explicit review of homepage, projects, resume, and contact; and a narrow exception for recovery or error handling.
- Updated the create-story template so future story drafts can cite the same baseline directly in Dev Notes when they touch public-facing copy.
- Expanded `tests/story-4-6-public-copy-guardrails.test.mjs` so it now validates the homepage, projects, resume, and contact surfaces in source and built output.
- Aligned homepage, projects, and contact copy with the documented guardrails by removing process-heavy phrasing that was not needed for comprehension.

### File List

- `_bmad-output/implementation-artifacts/4-6-establish-public-copy-guardrails.md`
- `_bmad-output/planning-artifacts/prd.md`
- `_bmad-output/planning-artifacts/ux-design-specification.md`
- `_bmad-output/planning-artifacts/architecture.md`
- `_bmad-output/planning-artifacts/epics.md`
- `_bmad/bmm/workflows/4-implementation/create-story/template.md`
- `src/content/pages/home.md`
- `src/pages/projects/index.astro`
- `src/pages/contact.astro`
- `src/content/resume/overview.md`
- `src/components/projects/ProjectDetailPage.astro`
- `tests/story-4-6-public-copy-guardrails.test.mjs`

## Change Log

- 2026-03-22: Added a lightweight public-copy baseline to planning artifacts, wired the same guidance into the story template, added regression coverage, and marked the story ready for review.
- 2026-03-22: Fixed follow-up review findings by removing process-heavy wording from public surfaces and expanding Story 4.6 regression coverage to validate source and built output.
