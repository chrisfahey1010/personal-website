# Story 2.5: Rewrite Project Copy for Recruiter-Friendly Clarity

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a hiring evaluator,
I want project summaries and details written in direct, outcome-oriented language,
so that I can understand Chris's role, impact, and relevance without decoding meta commentary.

## Acceptance Criteria

1. Given a visitor scans the projects index, when they compare project entries, then each summary communicates the project's value, Chris's role, and the reason it matters, and the copy avoids internal language about proof frameworks, evaluation flows, or storytelling structure.
2. Given a visitor opens a project detail page, when they read the overview, problem, role, and supporting sections, then the language stays concise, confident, and recruiter-friendly, and section labels and supporting text describe user value rather than internal intent.
3. Given project content is updated for launch, when it is reviewed across multiple entries, then the tone remains consistent across index and detail surfaces, and the revised copy preserves substantive credibility without sounding self-conscious or over-explained.

## Tasks / Subtasks

- [x] Rewrite project content at the source (AC: 1, 2, 3)
  - [x] Update `src/content/projects/portfolio-refresh.md` to replace meta framing with direct value, outcome, and role language.
  - [x] Update `src/content/projects/team-dashboard-modernization.md` with the same tone constraints.
- [x] Remove UI labels that reinforce meta framing (AC: 1, 2)
  - [x] Review project-facing components for labels like `proof`, `evaluation`, or similarly inward-facing copy and replace them where needed.
  - [x] Keep substantive structure intact while simplifying headings and next-step text.
- [x] Review consistency across project surfaces (AC: 3)
  - [x] Verify the projects index and both project detail pages read as one editorial system.
  - [x] Preserve scanability, substance, and onward navigation.

## Dev Notes

- Current project content is strong structurally but still uses phrases like `proof`, `evaluation`, and `storytelling system` that read more like internal rationale than visitor-facing language. [Source: `src/content/projects/portfolio-refresh.md`:3, `src/content/projects/portfolio-refresh.md`:42, `src/content/projects/team-dashboard-modernization.md`:3]
- `ProjectStructureSummary.astro` currently includes the labels `Proof focus` and `Next step`, so this component is part of the rewrite scope. [Source: `src/components/projects/ProjectStructureSummary.astro`:36]
- Epic and UX guidance now explicitly require direct, outcome-oriented project copy. [Source: `_bmad-output/planning-artifacts/epics.md`:541, `_bmad-output/planning-artifacts/ux-design-specification.md`:345]

### Project Structure Notes

- Primary touchpoints: `src/content/projects/*.md`, `src/components/projects/ProjectStructureSummary.astro`, `src/components/projects/ProjectIndexList.astro`, and `src/components/projects/ProjectDetailPage.astro` if any shared labels need tightening.
- Preserve the canonical content model and route-thin architecture while changing tone.

### References

- `_bmad-output/planning-artifacts/epics.md`:541
- `_bmad-output/planning-artifacts/prd.md`:300
- `_bmad-output/planning-artifacts/ux-design-specification.md`:345
- `_bmad-output/planning-artifacts/architecture.md`:523
- `src/content/projects/portfolio-refresh.md`:1
- `src/content/projects/team-dashboard-modernization.md`:1
- `src/components/projects/ProjectStructureSummary.astro`:18

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Draft created from corrected-course workflow outputs and approved artifact changes.
- Added `tests/story-2-5-project-copy-clarity.test.mjs` for source and built-output coverage of recruiter-friendly project copy.
- Updated existing project regression tests to match the revised public-facing project language.
- Validation run: `npm test`
- Validation run: `npm run check`
- Validation run: `npm run build`

### Completion Notes List

- Story drafted and ready for implementation planning.
- Rewrote both project entries to foreground role, outcomes, and visitor value without meta framing about proof systems or storytelling structure.
- Simplified projects index and detail labels, headings, CTA copy, and metadata so the project experience reads in direct recruiter-friendly language.
- Added story-specific copy regression coverage and aligned existing project discoverability/story-module tests with the updated wording.
- Review follow-up removed remaining detail-page phrases like `inspect the proof`, `Proof in practice`, and `deep proof pages` so recruiter-facing project copy stays consistent across index and detail views.
- Full validation passed with `npm test`, `npm run check`, and `npm run build`.

### File List

- `_bmad-output/implementation-artifacts/2-5-rewrite-project-copy-for-recruiter-friendly-clarity.md`
- `src/content/projects/portfolio-refresh.md`
- `src/content/projects/team-dashboard-modernization.md`
- `src/components/projects/ProjectStructureSummary.astro`
- `src/components/projects/ProjectDetailPage.astro`
- `src/pages/projects/index.astro`
- `src/pages/projects/[slug].astro`
- `src/lib/content/get-projects.ts`
- `src/lib/seo/site-metadata.ts`
- `tests/story-2-5-project-copy-clarity.test.mjs`
- `tests/story-2-1-projects-index.test.mjs`
- `tests/story-2-3-project-structure-and-discoverability.test.mjs`
- `tests/story-2-4-extensible-project-storytelling-foundation.test.mjs`
- `tests/story-4-2-structured-search-signals.test.mjs`

### Change Log

- 2026-03-22: Rewrote project source copy, simplified project-facing UI labels and CTA text, and added regression coverage for recruiter-friendly project language.
- 2026-03-22: Fixed review follow-up regressions by removing remaining proof-centric detail-page phrases and strengthening story 2.5 copy tests.
