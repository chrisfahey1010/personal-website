# Story 3.3: Clear Contact Pathways for Professional Outreach

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor who wants to reach Chris,
I want a clear and low-friction way to initiate contact,
so that I can follow up after evaluation without confusion.

## Acceptance Criteria

1. Given a visitor wants to contact Chris, when they look for outreach options on primary public pages, then they can find at least one clear contact pathway without extensive searching, and the contact option is presented in a professional and trustworthy way.
2. Given a visitor uses the contact destination or contact action, when they review the available outreach information, then they understand what action to take next, and the site does not require advanced communication features to complete the basic outreach path.
3. Given public contact information is exposed in the MVP, when it is rendered on the site, then it follows the project's privacy-conscious constraints, and it avoids unnecessary exposure of personal information beyond the intended contact pathway.

## Tasks / Subtasks

- [x] Strengthen contact discoverability across the primary evaluation journey without relying on navigation alone (AC: 1)
  - [x] Audit the existing handoff points on the homepage, projects index, project detail pages, resume page, and contact page so at least one clear contact path is visible where evaluators naturally finish each stage. Reuse the existing route-level journey pattern instead of inventing a parallel contact CTA system. [Source: `_bmad-output/planning-artifacts/epics.md`:605, `src/pages/projects/index.astro`:47, `src/components/projects/ProjectDetailPage.astro`:144, `src/pages/resume.astro`:103]
  - [x] Keep global navigation as orientation support, but make sure the final outreach step is also legible through page-level content or actions on key public routes. Visitors should not need to infer that contact is the next move from the top nav alone. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:417, `_bmad-output/planning-artifacts/epics.md`:607, `src/config/navigation.ts`:13]
  - [x] Preserve the same calm, evaluative tone established in Stories 3.1 and 3.2 so contact feels like the natural final stage of the profile -> proof -> resume journey instead of a disconnected utility page. [Source: `_bmad-output/planning-artifacts/epics.md`:612, `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:31]

- [x] Turn `/contact/` into the canonical low-friction outreach destination for launch without overbuilding Story 3.4 (AC: 1, 2)
  - [x] Keep `src/pages/contact.astro` route-thin under `BaseLayout.astro`, but sharpen the copy and action hierarchy so the page explains exactly how to reach out and what kind of response context is useful. The page should reduce hesitation, not merely repeat a mailto link. [Source: `_bmad-output/planning-artifacts/epics.md`:610, `_bmad-output/planning-artifacts/ux-design-specification.md`:407, `src/pages/contact.astro`:7]
  - [x] Use normal anchors and standard browser behavior for all launch contact actions. Do not add client-side submission flows, JS interception, hidden drawers, or any service-backed workflow just to satisfy the MVP outreach path. [Source: `_bmad-output/planning-artifacts/prd.md`:137, `_bmad-output/planning-artifacts/architecture.md`:243, `_bmad-output/planning-artifacts/architecture.md`:545]
  - [x] If a secondary professional outreach path is added, keep it intentionally bounded to a legitimate public profile or equivalent trust-preserving destination already appropriate for outreach. Do not expand into a social-feed or multi-channel contact hub. [Source: `_bmad-output/planning-artifacts/prd.md`:442, `_bmad-output/planning-artifacts/epics.md`:618]

- [x] Keep contact exposure privacy-conscious and centrally governed (AC: 2, 3)
  - [x] Continue using `src/config/contact.ts` as the canonical source of truth for the public email address and any intentionally approved secondary contact destinations. Do not scatter hardcoded contact values across pages, components, and tests. [Source: `_bmad-output/planning-artifacts/architecture.md`:808, `src/config/contact.ts`:1]
  - [x] Expose no more than one direct email address, and avoid adding phone numbers, street addresses, calendar embeds, or other personal details that exceed the launch privacy boundary. [Source: `_bmad-output/planning-artifacts/prd.md`:442, `_bmad-output/planning-artifacts/epics.md`:615]
  - [x] Keep contact copy clear about the intended action and next step, but avoid claiming richer feedback, delivery confirmation, or recovery behavior that belongs to Story 3.4. [Source: `_bmad-output/planning-artifacts/epics.md`:620, `_bmad-output/planning-artifacts/prd.md`:137]

- [x] Preserve static-first accessibility, responsiveness, and trust signals while adding contact clarity (AC: 1, 2, 3)
  - [x] Maintain one page-level `h1`, semantic landmarks, keyboard-reachable contact actions, visible focus states, and meaningful labels. Contact meaning must not depend on color alone, hover-only behavior, or motion. [Source: `_bmad-output/planning-artifacts/prd.md`:279, `_bmad-output/planning-artifacts/epics.md`:113, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]
  - [x] Keep contact pathways readable and easy to use on mobile, tablet, and desktop, with touch targets of at least `44x44px` and no cramped CTA stacking that weakens confidence under time pressure. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:447, `_bmad-output/planning-artifacts/ux-design-specification.md`:464]
  - [x] Keep all contact-pathway implementation hydration-free unless a later story explicitly earns runtime behavior. Story 3.3 is still a static-route and anchor problem. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553]

- [x] Add regression coverage for discoverable, trustworthy outreach paths (AC: 1, 2, 3)
  - [x] Extend existing Node-based build-output tests so built pages prove contact is reachable from the intended evaluation journey and the contact page explains the next action clearly. [Source: `tests/story-3-2-guided-evaluation-path.test.mjs`:29, `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:89]
  - [x] Add dedicated Story 3.3 coverage if needed to verify canonical contact config reuse, privacy-conscious exposure, and standard anchor-based outreach behavior. [Source: `src/config/contact.ts`:1, `tests/story-1-4-navigation.test.mjs`:86]
  - [x] Validate the repo with `npm run check`, `npm test`, and `npm run build`, then manually click through the contact path from the pages most likely to produce outreach on both mobile and desktop widths. [Source: `package.json`:7, `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

## Dev Notes

### Developer Context

- Story 3.3 starts from a route set that already points toward contact, but the actual contact implementation is still very small: one direct email, one contact route, and no richer explanation of the outreach options beyond the current page copy. The story should make that path more legible and trustworthy, not replace it with a bigger system. [Source: `src/pages/contact.astro`:17, `src/config/contact.ts`:1]
- Story 3.2 intentionally treated contact as the terminal next step in the evaluation journey without overbuilding the contact mechanics. Story 3.3 should now make that final step feel complete while still respecting Story 3.4 as the place for feedback, recovery, and richer action clarity. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:33, `_bmad-output/planning-artifacts/epics.md`:620]
- The strongest current reuse seam is `JourneyNextStep.astro`, which already frames route-to-route progression on the projects surfaces. Reuse that pattern or stay visually aligned with it instead of creating a separate contact-only CTA language system. [Source: `src/components/journey/JourneyNextStep.astro`:19, `src/pages/projects/index.astro`:47, `src/components/projects/ProjectDetailPage.astro`:144]
- The architecture and UX docs describe broader contact building blocks such as `src/content/pages/contact.md`, `ContactSection.astro`, and footer-level contact confidence patterns, but the real repo does not have those pieces yet. Follow the actual codebase shape first. [Source: `_bmad-output/planning-artifacts/architecture.md`:842, `_bmad-output/planning-artifacts/ux-design-specification.md`:370, `src/pages/contact.astro`:1]

### Technical Requirements

- Keep the launch contact path low-friction and static-first: no database, no auth, no public application API, no client-side form flow, and no external service dependency required for basic outreach. [Source: `_bmad-output/planning-artifacts/architecture.md`:125, `_bmad-output/planning-artifacts/architecture.md`:240, `_bmad-output/planning-artifacts/prd.md`:137]
- Contact discoverability must be explicit on primary public pages. The visitor should be able to find at least one clear outreach option without extensive searching or guessing which page contains the final action. [Source: `_bmad-output/planning-artifacts/epics.md`:605, `_bmad-output/planning-artifacts/epics.md`:607]
- The contact destination must tell visitors what to do next in plain language. It should reduce ambiguity around outreach without pretending there is a richer communication workflow than the MVP actually supports. [Source: `_bmad-output/planning-artifacts/epics.md`:610, `_bmad-output/planning-artifacts/ux-design-specification.md`:407]
- Privacy remains a hard product boundary: one direct email max, conservative personal-data exposure, and no unnecessary third-party handoff that weakens trust or ownership. [Source: `_bmad-output/planning-artifacts/prd.md`:427, `_bmad-output/planning-artifacts/prd.md`:442, `_bmad-output/planning-artifacts/architecture.md`:201]

### Architecture Compliance

- Keep route files thin. `src/pages/contact.astro` should continue composing within `BaseLayout.astro` rather than accumulating custom data loading, runtime state, or contact-workflow orchestration. [Source: `_bmad-output/planning-artifacts/architecture.md`:478, `_bmad-output/planning-artifacts/architecture.md`:793, `src/pages/contact.astro`:7]
- Reuse the canonical route contract in `src/config/navigation.ts` for all page-to-page contact handoffs. Do not hardcode contact URLs across hero, projects, resume, and contact implementations. [Source: `_bmad-output/planning-artifacts/architecture.md`:807, `src/config/navigation.ts`:13]
- Keep `src/config/contact.ts` as the single bounded config for public contact destinations. If Story 3.3 adds another approved outreach link, extend that file instead of inventing a second contact registry. [Source: `_bmad-output/planning-artifacts/architecture.md`:808, `src/config/contact.ts`:1]
- Preserve hydration-by-exception. Contact discoverability and low-friction outreach should be delivered with static HTML and CSS; do not add an island unless a later story explicitly introduces a justified interaction. [Source: `_bmad-output/planning-artifacts/architecture.md`:291, `_bmad-output/planning-artifacts/architecture.md`:553]

### Library / Framework Requirements

- Implement against the current validated repo stack: `astro@^5.18.0`, `tailwindcss@^4.2.1`, `@tailwindcss/vite@^4.2.1`, `zod@^4.3.6`, `typescript@^5.9.3`, and `wrangler@^4.73.0`. Story 3.3 does not justify a framework upgrade. [Source: `package.json`:16]
- Latest stable package versions reviewed during story creation are `astro@6.0.5`, `tailwindcss@4.2.1`, `zod@4.3.6`, and `wrangler@4.74.0`. The repo should stay on its current pinned versions unless upgrade work is scoped separately. [Source: npm package registry reviewed 2026-03-16, `package.json`:16]
- Current Astro docs still recommend build-time content collections for repeated structured content and `public/` for passthrough static assets, which reinforces keeping the contact story route-first and config-backed rather than forcing the single contact page into a heavier content subsystem. [Source: Astro content collections docs reviewed 2026-03-16]
- Current Cloudflare Pages docs still document `npm run build` with `dist` output as the standard static deployment path, so Story 3.3 should preserve ordinary route and anchor behavior that fits the existing hosting shape. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-16]

### File Structure Requirements

- Primary contact destination touchpoint: `src/pages/contact.astro`. This is the canonical public route for the actual outreach handoff. [Source: `src/pages/contact.astro`:1]
- Canonical contact-data touchpoint: `src/config/contact.ts`. Keep the public email and any approved secondary outreach destination here. [Source: `src/config/contact.ts`:1]
- Canonical route touchpoints for discoverability: `src/config/navigation.ts`, `src/pages/projects/index.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/pages/resume.astro`, and any homepage section that should expose a stronger final contact handoff. [Source: `src/config/navigation.ts`:13, `src/pages/projects/index.astro`:47, `src/components/projects/ProjectDetailPage.astro`:144, `src/pages/resume.astro`:108, `src/components/sections/HeroSection.astro`:41]
- Shared presentation touchpoints: `src/components/journey/JourneyNextStep.astro` and `src/styles/global.css`. Reuse these before inventing a new contact-only component layer. [Source: `src/components/journey/JourneyNextStep.astro`:19]
- Testing touchpoints: existing Node-based navigation and journey tests under `tests/`, plus a dedicated Story 3.3 test file if that is the clearest way to protect the new contact expectations. [Source: `tests/story-1-4-navigation.test.mjs`:86, `tests/story-3-2-guided-evaluation-path.test.mjs`:29]

### Testing Requirements

- Keep the repo verification baseline: `npm run check`, `npm test`, and `npm run build`. [Source: `package.json`:7]
- Verify the canonical contact config remains the single source of truth and that built pages expose only the intended direct email address or approved secondary outreach destination. [Source: `src/config/contact.ts`:1, `_bmad-output/planning-artifacts/prd.md`:442]
- Verify built output for key public pages still exposes clear contact discoverability without relying on JS or hidden interactions, and that `/contact/` tells the visitor what action to take next. [Source: `_bmad-output/planning-artifacts/epics.md`:605, `_bmad-output/planning-artifacts/epics.md`:612]
- Verify contact actions remain standard anchors (`mailto:` and/or approved public-profile links) and that all page-to-page contact handoffs still resolve to real built routes. [Source: `tests/story-1-4-navigation.test.mjs`:118, `tests/story-3-2-guided-evaluation-path.test.mjs`:51]
- Manual QA should cover homepage -> projects -> resume -> contact and any alternate quick path into contact on both mobile and desktop widths to catch weak copy, awkward hierarchy, or privacy-overexposing presentation that static assertions may miss. [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`:468]

### Previous Story Intelligence

- Story 3.1 showed that the actual repo shape matters more than the architecture document's fuller aspirational tree. Story 3.3 should continue working with `BaseLayout`, route files, config modules, and Node-based tests instead of introducing placeholder systems. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:117]
- Story 3.2 established the current journey pattern: route-thin pages, canonical route config, reusable `JourneyNextStep`, and build-output assertions for the evaluation path. Reuse that exact implementation style here. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:65, `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:181]
- Story 3.2 intentionally left `/contact/` lightweight. That was a scope decision, not a bug. Story 3.3 should complete the low-friction outreach path without skipping ahead into Story 3.4 feedback-state work. [Source: `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:99]
- Existing tests already protect navigation, responsive shells, and route-to-route journey continuity. Extending those patterns is safer than introducing browser automation or a new runtime-heavy test style. [Source: `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md`:98, `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`:98]

### Git Intelligence Summary

- Recent work is sequential and story-scoped: `Strengthen evaluation journey handoffs`, `Complete resume access review fixes`, `Harden project storytelling extension seams`, and `Stabilize Cloudflare Workers deploy flow`. Story 3.3 should follow that same surgical pattern with focused route, config, style, and test changes. [Source: commits `642201a`, `2d7702e`, `a92f7c1`, `e37d23d` reviewed 2026-03-16]
- The working tree was clean during story creation, so Story 3.3 can assume the current repo reflects accepted Epic 1, Epic 2, and early Epic 3 behavior without unrelated local churn. [Source: `git status --short` reviewed 2026-03-16]
- The most relevant recent commit already touched `src/config/contact.ts`, `src/pages/contact.astro`, `src/pages/resume.astro`, `src/pages/projects/index.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/components/journey/JourneyNextStep.astro`, and regression tests. Those are the highest-value places to inspect before making Story 3.3 changes. [Source: commit `642201a` reviewed 2026-03-16]

### Latest Tech Information

- Astro's latest stable npm release is `6.0.5`, but this repo is intentionally pinned to `astro@^5.18.0`. Story 3.3 should use already-proven Astro 5 patterns and avoid bundling upgrade work into contact-pathway implementation. [Source: npm `astro` package registry reviewed 2026-03-16, `package.json`:18]
- Tailwind's latest stable npm release remains `4.2.1`, matching the repo's current version, so Story 3.3 can continue using the existing styling foundation without toolchain changes. [Source: npm `tailwindcss` package registry reviewed 2026-03-16, `package.json`:17]
- Zod's latest stable npm release remains `4.3.6`, also matching the repo. If additional contact config structure is added, keep it simple and consistent with the current validated stack. [Source: npm `zod` package registry reviewed 2026-03-16, `package.json`:20]
- Wrangler's latest stable npm release is `4.74.0` while the repo currently uses `^4.73.0`. There is no contact-story reason to change deployment tooling right now. [Source: npm `wrangler` package registry reviewed 2026-03-16, `package.json`:23]
- Current Cloudflare Pages guidance still uses `npm run build` and `dist` for Astro static deployments, which aligns with keeping contact navigation as plain links and built routes. [Source: Cloudflare Pages Astro deployment guide reviewed 2026-03-16]

### Project Context Reference

- No `project-context.md` file exists anywhere in the repository, so this story relies on the PRD, epics file, architecture, UX specification, sprint tracker, previous story files, current repo implementation, recent git history, and current framework/platform documentation.

### Story Completion Status

- Status: `done`
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- The real repo already has the key route shells for the evaluation journey: `index`, `projects`, `projects/[slug]`, `resume`, and `contact`. Story 3.3 should strengthen the final outreach layer inside that existing route graph rather than redesigning the site's information architecture. [Source: `src/pages/`]
- Contact data currently lives in a tiny config module, not in a content collection or large site-config surface. Extending that narrow seam is preferable to forcing the architecture document's broader `site.ts`/`social-links.ts` pattern into the codebase prematurely. [Source: `src/config/contact.ts`:1]
- There is no footer component in the actual repo, so do not assume footer-level contact discoverability exists already. If Story 3.3 needs stronger discoverability, prioritize existing pages and shared route-level components first. [Source: `src/components/navigation/`, `_bmad-output/planning-artifacts/architecture.md`:704]
- The current test suite is Node-based and build-output-focused. Story 3.3 should keep using that style unless a real gap appears. [Source: `tests/`]

### Anti-Pattern Prevention

- Do not introduce a contact form backend, API route, client-side submission flow, or external SaaS dependency just to satisfy the MVP outreach path.
- Do not expose more than one direct email address or add unnecessary personal details such as phone numbers or physical addresses.
- Do not scatter contact strings or route constants across hero, projects, resume, contact, and tests when `src/config/contact.ts` and `src/config/navigation.ts` can remain canonical.
- Do not let contact discoverability depend only on global navigation, hover states, color treatment, or motion.
- Do not overbuild Story 3.4 feedback states, submission confirmations, or error-recovery mechanics inside Story 3.3.
- Do not create a social-style contact hub that weakens the calm, professional, trust-first tone of the site.

### References

- `_bmad-output/planning-artifacts/epics.md` - Story 3.3 requirements, acceptance criteria, and Epic 3 context
- `_bmad-output/planning-artifacts/prd.md` - MVP contact scope, privacy limits, trust requirements, and accessibility expectations
- `_bmad-output/planning-artifacts/architecture.md` - static-first architecture, route-thin rules, canonical boundaries, and privacy/security guardrails
- `_bmad-output/planning-artifacts/ux-design-specification.md` - calm feedback patterns, navigation stability, responsive/accessibility expectations, and low-friction contact guidance
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - story tracking state
- `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md` - prior Epic 3 learnings about real repo shape, route-thin implementation, and test strategy
- `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md` - current evaluation-journey baseline and contact boundary from the previous story
- `package.json`, `src/config/contact.ts`, `src/config/navigation.ts`, `src/pages/contact.astro`, `src/pages/resume.astro`, `src/pages/projects/index.astro`, `src/components/projects/ProjectDetailPage.astro`, `src/components/journey/JourneyNextStep.astro`, `src/components/sections/HeroSection.astro`, and current `tests/` files - actual implementation baseline for Story 3.3
- Astro content collections docs, Cloudflare Pages Astro deployment guide, and npm package registry pages reviewed on 2026-03-16

### Definition of Done

- Visitors can find a clear contact path from the primary public experience without extensive searching.
- `/contact/` explains the next outreach action in a professional, trustworthy, low-friction way.
- Public contact exposure stays within the privacy-conscious launch boundary, including no more than one direct email address.
- The implementation remains static-first, accessible, responsive, and consistent with the existing route shell and journey patterns.
- Regression coverage proves canonical route/contact reuse and clear outreach behavior, and `npm run check`, `npm test`, and `npm run build` pass.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- Workflow resources loaded and fully read: `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`, `_bmad/bmm/workflows/4-implementation/create-story/instructions.xml`, `_bmad/bmm/workflows/4-implementation/create-story/template.md`, `_bmad/bmm/workflows/4-implementation/create-story/checklist.md`, `_bmad/core/tasks/workflow.xml`, and `_bmad/bmm/config.yaml`.
- Story target provided by user as `3.3` and resolved to `3-3-clear-contact-pathways-for-professional-outreach` from `_bmad-output/planning-artifacts/epics.md` and `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Core source artifacts reviewed: `_bmad-output/implementation-artifacts/sprint-status.yaml`, `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/planning-artifacts/prd.md`, `_bmad-output/planning-artifacts/architecture.md`, and `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Previous-story intelligence reviewed from `_bmad-output/implementation-artifacts/3-1-resume-access-from-the-evaluation-journey.md` and `_bmad-output/implementation-artifacts/3-2-guided-evaluation-path-from-profile-to-proof-to-resume.md`.
- Repo exploration for Story 3.3 current-state analysis was delegated to an explore subagent and incorporated into this story context.
- Git intelligence gathered from `git log --oneline -5`, `git show --stat 642201a`, and `git status --short`.
- Web research gathered from the npm package registry, Astro content collections docs, and Cloudflare Pages Astro deployment guide on 2026-03-16.
- No `project-context.md` file was present anywhere in the repository during workflow execution.
- The workflow references `_bmad/core/tasks/validate-workflow.xml`, but that task file does not exist in this repository, so checklist validation was completed manually against `checklist.md`.

### Implementation Plan

- Keep the canonical contact route and config boundaries intact while making the homepage handoff to contact visible without relying on global navigation alone.
- Tighten `src/pages/contact.astro` copy and page-level guidance so the low-friction email action explains what context is useful and what the next step is.
- Preserve the existing static-first, route-thin implementation style by extending current Astro components and shared CSS instead of adding runtime behavior.
- Add Story 3.3 regression coverage that proves canonical config reuse, clear journey handoffs, privacy-conscious email exposure, and anchor-only outreach behavior.

### Completion Notes List

- Story context created for `3-3-clear-contact-pathways-for-professional-outreach` with detailed implementation guardrails, existing repo touchpoints, anti-pattern prevention, and verification expectations.
- Analysis identified the current bounded contact baseline: one canonical email, one thin contact route, journey-level handoffs from projects/resume, and no richer feedback mechanics yet.
- Story guidance keeps implementation aligned with the real repo shape instead of the architecture document's broader aspirational contact subsystem.
- Manual checklist validation confirmed the story includes clear technical requirements, previous-story learnings, privacy guardrails, reuse opportunities, and static-first implementation boundaries for the dev agent.
- Added a homepage-level contact handoff through `HeroSection.astro` while keeping route handoffs on projects, project detail, resume, and contact aligned to the existing journey language.
- Sharpened `src/pages/contact.astro` with clearer outreach copy, bounded guidance on what to send, and a more trustworthy launch-ready email handoff without adding forms or runtime behavior.
- Added `tests/story-3-3-contact-pathways.test.mjs` and verified `npm run check`, `npm test`, and `npm run build` all pass.
- Chris confirmed manual click-through QA across mobile and desktop widths is complete for the primary contact journey.
- Senior developer review fixes replaced the homepage-specific contact CTA pattern with the shared `JourneyNextStep` handoff, removed reply-guarantee copy from `/contact/`, and updated Story 3.3 regression coverage to read the canonical email from `src/config/contact.ts`.

### Change Log

- 2026-03-16: Implemented clearer contact discoverability on the homepage and strengthened the `/contact/` route copy, guidance, and regression coverage while preserving the static-first journey pattern.
- 2026-03-16: Applied senior review fixes to reuse the shared journey handoff on the homepage, remove premature reply-state promises from contact copy, and eliminate hardcoded email assertions from Story 3.3 tests.

### Senior Developer Review (AI)

- Reviewer: Chris
- Date: 2026-03-16
- Outcome: Approve
- Findings resolved:
  - Replaced the custom homepage contact CTA treatment with the shared `JourneyNextStep` pattern so Story 3.3 reuses the same evaluative handoff system already established across projects and resume.
  - Updated Story 3.3 regression coverage to derive the direct email address from `src/config/contact.ts` instead of hardcoding the literal email in test assertions.
  - Revised `/contact/` guidance so it explains what to send without implying richer feedback or delivery guarantees that belong to Story 3.4.
  - Reconciled story status metadata after review completion.

### File List

- `src/pages/index.astro`
- `src/components/sections/HeroSection.astro`
- `src/components/journey/JourneyNextStep.astro`
- `src/pages/contact.astro`
- `src/styles/global.css`
- `tests/story-3-3-contact-pathways.test.mjs`
- `_bmad-output/implementation-artifacts/3-3-clear-contact-pathways-for-professional-outreach.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
