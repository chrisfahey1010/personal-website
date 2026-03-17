# Story 3.4: Calm Contact Feedback and Action Clarity

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor using a contact action,
I want clear feedback or action clarity when I try to reach Chris,
so that I know what happened and what to do next without stress.

## Acceptance Criteria

1. Given the launch contact pathway uses a lightweight interaction such as a mail action, email link, or simple form, when the visitor uses that interaction, then the interface makes the intended next step or current state clear, and the experience remains calm, concise, and non-disruptive.
2. Given the visitor encounters incomplete input, a failed handoff, or another contact-related issue, when feedback appears, then the message explains what went wrong in plain language, and it tells the visitor how to recover without blaming or confusing them.
3. Given a contact action cannot complete through the intended lightweight mechanism, when the failure state is shown, then the site preserves at least one clear next step for outreach, and the failure does not strand the visitor without a trustworthy recovery option.
4. Given contact-related feedback or guidance is shown, when it is rendered, then color is not the only signal used to convey meaning, and the feedback remains understandable for assistive technology and keyboard users.

## Tasks / Subtasks

- [x] Turn `/contact/` into the canonical calm-feedback surface for launch contact actions without adding a heavyweight workflow (AC: 1, 2, 3)
  - [x] Keep `src/pages/contact.astro` route-thin under `BaseLayout.astro`, but make the primary email action's state and next step explicit before and after the click. Use plain-language guidance that explains what should happen when the `mailto:` link works and what to do if the handoff does not open a mail app. [Source: `_bmad-output/planning-artifacts/epics.md`:630, `_bmad-output/planning-artifacts/ux-design-specification.md`:407, `src/pages/contact.astro`:17]
  - [x] Preserve the current launch interaction as lightweight and static-first. Do not add a backend, API route, third-party form service, or client-side submission orchestration just to manufacture feedback states. [Source: `_bmad-output/planning-artifacts/prd.md`:137, `_bmad-output/planning-artifacts/architecture.md`:237, `_bmad-output/planning-artifacts/architecture.md`:545]
  - [x] Reuse the existing calm editorial route pattern so contact feedback feels like a continuation of the evaluation journey rather than a detached app-like error system. [Source: `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:50, `src/pages/contact.astro`:11, `src/pages/resume.astro`:65]

- [x] Add explicit recovery guidance for mailto failure and other lightweight-contact edge cases (AC: 2, 3)
  - [x] Provide an always-available fallback path that does not depend on the mail app handoff succeeding, such as clearly copyable email text and direct instructions for what to do if the mail client does not open. [Source: `_bmad-output/planning-artifacts/epics.md`:640, `_bmad-output/planning-artifacts/epics.md`:643, `src/config/contact.ts`:1, `src/pages/contact.astro`:46]
  - [x] If the implementation introduces any user-entered fields or richer lightweight form controls, keep validation local, minimal, and near the relevant field, with calm recovery copy in plain language. If no form is introduced, do not invent generic validation states just to satisfy the story. [Source: `_bmad-output/planning-artifacts/epics.md`:635, `_bmad-output/planning-artifacts/ux-design-specification.md`:413, `_bmad-output/planning-artifacts/ux-design-specification.md`:415]
  - [x] Preserve at least one trustworthy onward path when contact friction occurs, such as retrying email, reviewing the visible address, or continuing through resume/project routes without losing orientation. [Source: `_bmad-output/planning-artifacts/epics.md`:642, `src/pages/resume.astro`:98, `src/config/navigation.ts`:16]

- [x] Keep contact feedback accessible, calm, and non-color-dependent (AC: 1, 4)
  - [x] Use semantic headings, explanatory text, and stable layout treatment for guidance blocks. Do not rely on accent color alone to communicate status, severity, or success. [Source: `_bmad-output/planning-artifacts/epics.md`:647, `_bmad-output/planning-artifacts/ux-design-specification.md`:409, `src/styles/global.css`:183]
  - [x] Keep all feedback keyboard-reachable, screen-reader-readable, and visually stable, with visible focus states and no motion or layout shift required to understand the contact state. [Source: `_bmad-output/planning-artifacts/epics.md`:648, `_bmad-output/planning-artifacts/ux-design-specification.md`:464, `_bmad-output/planning-artifacts/architecture.md`:597]
  - [x] Reuse the existing fallback/recovery visual language already established on the resume route instead of introducing toast notifications, modal alerts, or noisy banners. [Source: `src/pages/resume.astro`:65, `src/styles/global.css`:613]

- [x] Keep privacy, ownership, and architecture boundaries intact while improving action clarity (AC: 1, 2, 3, 4)
  - [x] Continue exposing no more than one direct email address and keep `src/config/contact.ts` as the canonical source of truth for public contact values and any approved fallback metadata. [Source: `_bmad-output/planning-artifacts/prd.md`:442, `_bmad-output/planning-artifacts/epics.md`:615, `src/config/contact.ts`:1]
  - [x] Do not introduce analytics hooks, hidden tracking, or third-party contact widgets to infer whether the handoff succeeded. The recovery path should remain transparent and privacy-conscious. [Source: `_bmad-output/planning-artifacts/prd.md`:217, `_bmad-output/planning-artifacts/architecture.md`:196, `_bmad-output/planning-artifacts/architecture.md`:223]
  - [x] Keep the route graph and shared journey language consistent with Stories 3.2 and 3.3 so contact remains the terminal trust-preserving step in the evaluation path. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:31, `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:24, `src/components/journey/JourneyNextStep.astro`:19]

- [x] Add regression coverage for calm feedback and recovery behavior (AC: 1, 2, 3, 4)
  - [x] Add or extend Node-based build-output tests to verify that `/contact/` now explains the intended handoff, includes a plain-language fallback when the lightweight action fails, and still exposes at least one trustworthy recovery path. [Source: `tests/story-3-3-contact-pathways.test.mjs`:33, `_bmad-output/planning-artifacts/epics.md`:637]
  - [x] Add accessibility-oriented assertions proving contact guidance uses text structure and not just color, and that the page preserves one `main`, one `h1`, normal anchor behavior, and reduced-motion-safe presentation. [Source: `tests/story-1-6-accessibility.test.mjs`:109, `_bmad-output/planning-artifacts/epics.md`:647]
  - [x] Validate the repo with `npm run check`, `npm test`, and `npm run build`, then manually test the contact handoff on mobile and desktop with at least one scenario where the mail client does not open automatically. [Source: `package.json`:7, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

## Dev Notes

### Developer Context

- Story 3.3 already established discoverability and a clear contact destination. Story 3.4 should not re-solve discoverability; it should make the contact action itself calmer and more explicit when the `mailto:` handoff works imperfectly or not at all. [Source: `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:21, `_bmad-output/planning-artifacts/epics.md`:620]
- The current repo has no real feedback-state UI for contact. The contact page explains what to send before the action, but it does not yet tell visitors what happened if the handoff fails or how to recover without guesswork. [Source: `src/pages/contact.astro`:28, `src/pages/contact.astro`:46]
- The resume route already provides the closest in-repo model for calm recovery messaging through a static fallback box. That pattern is more aligned with the codebase than introducing runtime alerts or a client-heavy interaction layer. [Source: `src/pages/resume.astro`:65, `src/styles/global.css`:613]
- The strongest current reuse seam for route-to-route follow-up remains `JourneyNextStep.astro`, while the strongest current recovery seam is the resume fallback presentation. Story 3.4 should build from those instead of inventing new primitives. [Source: `src/components/journey/JourneyNextStep.astro`:19, `src/pages/resume.astro`:108]

### Technical Requirements

- Keep the launch contact interaction lightweight and static-first: no database, no auth, no public app API, and no server-backed submission workflow unless a later story explicitly expands scope. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:240, `_bmad-output/planning-artifacts/prd.md`:137]
- The contact page must make the expected handoff state explicit. Visitors should understand both the intended happy path and the recovery path without relying on browser quirks or hidden assumptions about installed mail clients. [Source: `_bmad-output/planning-artifacts/epics.md`:632, `_bmad-output/planning-artifacts/epics.md`:642]
- Error or recovery copy must stay plain-language, calm, and recovery-oriented. Do not blame the visitor, overexplain technical failure, or use alarmist language. [Source: `_bmad-output/planning-artifacts/epics.md`:637, `_bmad-output/planning-artifacts/ux-design-specification.md`:409]
- Preserve privacy-conscious exposure: one direct email max, no unnecessary personal details, and no tracking-based heuristics to infer whether the contact action succeeded. [Source: `_bmad-output/planning-artifacts/prd.md`:427, `_bmad-output/planning-artifacts/prd.md`:442, `_bmad-output/planning-artifacts/architecture.md`:201]

### Architecture Compliance

- Keep route files thin. `src/pages/contact.astro` should remain a composition layer inside `BaseLayout.astro`, not a home for app-state machinery or contact-workflow orchestration. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/contact.astro`:7]
- Keep `src/config/contact.ts` as the single bounded config surface for public email data and any story-specific fallback metadata. Do not scatter hardcoded contact strings across pages and tests. [Source: `_bmad-output/planning-artifacts/architecture.md`:808, `src/config/contact.ts`:1]
- Reuse the canonical route contract in `src/config/navigation.ts` for any recovery links back into resume, projects, or contact-related follow-up. [Source: `_bmad-output/planning-artifacts/architecture.md`:807, `src/config/navigation.ts`:13]
- Preserve hydration-by-exception. A calm contact-feedback story is still compatible with plain HTML/CSS and should stay that way unless a specific interaction earns runtime behavior. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553]

### Library / Framework Requirements

- Implement against the current validated repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 3.4 does not justify an upgrade. [Source: `package.json`:16]
- Latest stable package versions reviewed during story creation are `astro@6.0.5`, `tailwindcss@4.2.1`, `zod@4.3.6`, and `wrangler@4.74.0`. The repo should stay on its current pinned versions unless upgrade work is explicitly scoped. [Source: npm package registry reviewed 2026-03-16, `package.json`:16]
- Current Astro docs still recommend content collections for repeated structured content and `public/` for passthrough static assets; this reinforces keeping the single contact route lightweight instead of forcing it into a heavier content or runtime subsystem. [Source: Astro content collections docs reviewed 2026-03-16]
- Current Cloudflare Pages docs still document `npm run build` with `dist` output as the standard deployment path for Astro on Pages, which matches keeping this story centered on built routes, plain anchors, and static guidance. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-16]

### File Structure Requirements

- Primary implementation touchpoint: `src/pages/contact.astro`. This is the canonical route for contact action clarity, feedback copy, and recovery guidance. [Source: `src/pages/contact.astro`:1]
- Canonical contact config touchpoint: `src/config/contact.ts`. Keep direct email and any bounded fallback labels or helper strings here if centralization improves reuse. [Source: `src/config/contact.ts`:1]
- Shared recovery/presentation touchpoints: `src/styles/global.css`, `src/pages/resume.astro`, and the existing fallback-card pattern. Prefer extension over a parallel feedback component system. [Source: `src/styles/global.css`:613, `src/pages/resume.astro`:65]
- Shared journey continuity touchpoints: `src/components/journey/JourneyNextStep.astro`, `src/pages/index.astro`, `src/pages/projects/index.astro`, and `src/pages/resume.astro`. If recovery links are added, they should stay aligned with this route graph. [Source: `src/components/journey/JourneyNextStep.astro`:19, `src/pages/index.astro`:47, `src/pages/resume.astro`:108]
- Testing touchpoints: `tests/story-3-3-contact-pathways.test.mjs`, `tests/story-1-6-accessibility.test.mjs`, and a dedicated Story 3.4 test file if that is the cleanest way to protect the new expectations. [Source: `tests/story-3-3-contact-pathways.test.mjs`:19, `tests/story-1-6-accessibility.test.mjs`:109]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:7]
- Verify the built contact page explains the intended mailto handoff, includes a plain-language fallback path, and preserves at least one reachable next step when the primary handoff fails. [Source: `_bmad-output/planning-artifacts/epics.md`:632, `_bmad-output/planning-artifacts/epics.md`:642]
- Verify contact guidance remains static-first and anchor-based unless the implementation deliberately introduces a scoped, tested lightweight form. If no form is added, tests should continue rejecting accidental form/runtime creep. [Source: `tests/story-3-3-contact-pathways.test.mjs`:52, `_bmad-output/planning-artifacts/prd.md`:137]
- Verify color is not the only feedback signal by checking for textual labels, semantic grouping, and accessible structure in the built output. [Source: `_bmad-output/planning-artifacts/epics.md`:647, `_bmad-output/planning-artifacts/ux-design-specification.md`:409]
- Manual QA should cover both the normal `mailto:` path and at least one recovery scenario where the mail client does not open automatically on mobile and desktop. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

### Previous Story Intelligence

- Story 3.2 established the route-to-route evaluation journey and explicitly kept contact lightweight. Story 3.4 should extend that bounded contact finish, not replace it with an application flow. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:33, `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:99]
- Story 3.3 established `src/config/contact.ts` as the canonical source of truth and positioned `/contact/` as the canonical outreach destination. Reuse those exact seams. [Source: `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:31, `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:78]
- Story 3.3 also explicitly avoided promising richer feedback or delivery confirmation. Story 3.4 can now add calmer action-clarity and recovery guidance, but it still should not imply a backend workflow that does not exist. [Source: `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:34, `_bmad-output/planning-artifacts/epics.md`:630]
- Existing test strategy is still Node-based and build-output-focused. Extending that style is safer than adding browser automation or runtime-only checks for this story. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:98, `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`:127]

### Git Intelligence Summary

- Recent work stays story-sized and sequential: `Complete contact pathway review fixes`, `Strengthen evaluation journey handoffs`, and `Complete resume access review fixes`. Story 3.4 should follow the same surgical pattern with focused route, config, style, and test changes. [Source: commits `e929719`, `642201a`, `2d7702e` reviewed 2026-03-16]
- The working tree was clean during story creation, so this story can assume the current repo reflects accepted Story 3.3 behavior without unrelated local churn. [Source: `git status --short` reviewed 2026-03-16]
- The most relevant recent commits already touched `src/pages/contact.astro`, `src/pages/index.astro`, `src/styles/global.css`, `src/config/contact.ts`, `src/pages/resume.astro`, and contact/journey tests. Those are the highest-value files to inspect before implementation begins. [Source: commits `e929719`, `642201a`, `2d7702e` reviewed 2026-03-16]

### Latest Tech Information

- Astro's latest stable npm release is `6.0.5`, but this repo is intentionally pinned to `astro@^5.18.0`. Story 3.4 should use already-proven Astro 5 route and content patterns. [Source: npm `astro` package registry reviewed 2026-03-16, `package.json`:18]
- Tailwind's latest stable npm release remains `4.2.1`, matching the repo. Story 3.4 can continue using the existing tokenized styling foundation without toolchain changes. [Source: npm `tailwindcss` package registry reviewed 2026-03-16, `package.json`:19]
- Zod's latest stable npm release remains `4.3.6`, also matching the repo. If contact config structure grows, keep it small and compatible with the current stack. [Source: npm `zod` package registry reviewed 2026-03-16, `package.json`:20]
- Wrangler's latest stable npm release is `4.74.0` while the repo currently uses `^4.73.0`. There is no Story 3.4 reason to change deployment tooling right now. [Source: npm `wrangler` package registry reviewed 2026-03-16, `package.json`:23]
- Current Astro docs still emphasize build-time content collections for repeated structured content and explicitly note that static files such as PDFs belong in `public/`; that reinforces keeping contact feedback route-first and not inventing a new content subsystem for this single page. [Source: Astro content collections docs reviewed 2026-03-16]
- Current Cloudflare Pages Astro guidance still uses `npm run build` and `dist`, which aligns with keeping contact action clarity visible in built HTML rather than hiding it behind runtime behavior. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-16]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story files, current repo implementation, recent git history, and current framework/platform documentation.

### Story Completion Status

- Status: `ready-for-dev`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The real repo already has the route shells needed for this story: `index`, `projects`, `projects/[slug]`, `resume`, and `contact`. Story 3.4 should strengthen contact clarity within that existing graph instead of redesigning information architecture. [Source: `src/pages/`]
- Contact data currently lives in a tiny config module, not a broader content or settings system. Extending that narrow seam is preferable to forcing the architecture document's aspirational `src/content/pages/contact.md` shape into the codebase prematurely. [Source: `src/config/contact.ts`:1, `_bmad-output/planning-artifacts/architecture.md`:843]
- The current repo already has a proven fallback-message pattern on the resume route and a proven journey-CTA pattern across home/projects/resume. Story 3.4 should reuse those actual patterns before introducing new abstractions. [Source: `src/pages/resume.astro`:65, `src/components/journey/JourneyNextStep.astro`:19]
- The current test suite remains Node-based and build-output-focused. Keep that style unless a real implementation requirement makes runtime-browser coverage necessary. [Source: `tests/`]

### Anti-Pattern Prevention

- Do not introduce a contact form backend, API route, modal workflow, toast stack, or third-party contact SaaS just to simulate feedback.
- Do not hardcode contact strings, email addresses, or route URLs across pages and tests when `src/config/contact.ts` and `src/config/navigation.ts` can stay canonical.
- Do not rely on color alone, animation alone, or iconography alone to communicate success, warning, or recovery meaning.
- Do not promise delivery confirmation, guaranteed response timing, or richer submission state that the static `mailto:` flow cannot actually prove.
- Do not strand the visitor in failure copy without at least one obvious next outreach step.
- Do not regress the calm, trust-first tone by adding noisy alerts, error jargon, or app-like chrome that breaks the site's editorial character.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 3.4 requirements, acceptance criteria, and Epic 3 context
- `_bmad-output/planning-artifacts/prd.md` - MVP contact scope, privacy limits, and trust requirements
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, route-thin rules, canonical boundaries, and accessibility/performance guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm feedback patterns, lightweight form guidance, navigation stability, and accessibility expectations
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md` - route continuity and contact-boundary learnings
- `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md` - existing contact-path baseline and constraints
- `package.json`, `src/pages/contact.astro`, `src/pages/resume.astro`, `src/config/contact.ts`, `src/config/navigation.ts`, `src/components/journey/JourneyNextStep.astro`, `src/pages/index.astro`, `src/styles/global.css`, and current `tests/` files - actual implementation baseline for Story 3.4
- Astro content collections docs, Cloudflare Pages Astro deployment guide, and npm package registry pages reviewed on 2026-03-16

### Definition of Done

- `/contact/` makes the intended lightweight contact handoff clear and calm.
- The contact experience explains recovery in plain language when the primary handoff fails or does not open automatically.
- Visitors always have at least one trustworthy next outreach step and are not stranded by failure copy.
- Feedback/guidance remains accessible, non-color-dependent, and compatible with keyboard and assistive-technology use.
- The implementation remains static-first, privacy-conscious, and aligned with the existing route shell and journey patterns.
- Regression coverage proves the guidance and recovery behavior, and `npm run check`, `npm test`, and `npm run build` pass.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `3.4` and resolved to `3-4-calm-contact-feedback-and-action-clarity` from `_bmad-output/planning-artifacts/epics.md` and `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Previous-story intelligence reviewed from `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md` and `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`.
- Repo exploration for Story 3.4 current-state analysis was delegated to an explore subagent and incorporated into this story context.
- Git intelligence gathered from `git log --oneline -5`, `git show --stat --oneline e929719`, `git show --stat --oneline 642201a`, `git show --stat --oneline 2d7702e`, and `git status --short`.
- Web research gathered from the npm package registry, Astro content collections docs, and Cloudflare Pages Astro deployment guide on 2026-03-16.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.
- Story implementation work completed for `src/pages/contact.astro`, `src/styles/global.css`, and `tests/story-3-4-contact-feedback.test.mjs`.
- Automated validation completed with `node --test tests/story-3-4-contact-feedback.test.mjs`, `npm run check`, `npm test`, and `npm run build`.
- Automated validation completed in-repo; manual QA is now explicitly confirmed for desktop/mobile mail-client handoff, including a recovery scenario.

### Implementation Plan

- Keep `src/pages/contact.astro` route-thin and static-first while making the `mailto:` handoff explicit in calm, plain language.
- Reuse the existing resume fallback presentation language for contact recovery blocks instead of adding a new runtime feedback system.
- Add build-output regression coverage for handoff clarity, fallback text, semantic structure, anchor behavior, and reduced-motion-safe presentation.

### Completion Notes List

- Story context created for `3-4-calm-contact-feedback-and-action-clarity` with detailed implementation guardrails, actual repo touchpoints, anti-pattern prevention, and verification expectations.
- Analysis identified the key repo gap: discoverability is already strong, but explicit calm feedback and recovery guidance for contact actions is still mostly absent.
- Story guidance keeps implementation aligned with the real repo shape by favoring route-thin updates, canonical config reuse, existing recovery-card styling, and Node-based build-output tests.
- Manual checklist validation confirmed the story includes technical requirements, previous-story learnings, reuse opportunities, accessibility expectations, privacy boundaries, and anti-pattern prevention for the dev agent.
- `/contact/` now explains the expected `mailto:` handoff, exposes a plain-text email fallback that does not depend on `mailto:`, and preserves onward navigation back through resume or projects without adding a heavier workflow.
- Added a dedicated Story 3.4 regression test that validates built contact guidance, the non-`mailto:` fallback, semantic grouping, visible text-based recovery cues, normal anchor behavior, and reduced-motion-safe presentation.
- Automated verification passed with `npm run check`, `npm test`, and `npm run build`; manual QA is now explicitly confirmed for desktop and mobile mail-client behavior, including recovery.

### File List

- `_bmad-output/implementation-artifacts/3-4-calm-contact-feedback-and-action-clarity.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/pages/contact.astro`
- `src/styles/global.css`
- `tests/story-3-4-contact-feedback.test.mjs`

### Change Log

- 2026-03-16: Added calm `mailto:` handoff guidance, explicit recovery copy, onward navigation, and Story 3.4 regression coverage.
- 2026-03-17: Review fixes added a plain-text non-`mailto:` fallback path, strengthened accessibility-oriented regression coverage, and reset the manual-QA checkbox until explicit confirmation is captured.
- 2026-03-17: Manual QA explicitly confirmed after review fixes for desktop/mobile contact handoff and fallback behavior.
