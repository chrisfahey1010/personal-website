# Sprint Change Proposal

## 1. Issue Summary

### Problem Statement

Planning artifacts need correction before implementation begins. The current planning set contains three linked issues that would likely cause implementation drift:

1. Blog and future writing are correctly treated as post-MVP in the PRD, but parts of the UX specification and epic wording still present `Blog` as a launch destination.
2. The architecture explicitly expects Git-based CI/CD and `Amazon S3 + CloudFront` deployment foundations, but the backlog does not currently include a bounded story for that work.
3. Trust-critical stories for resume and contact flows do not yet define strong enough failure and recovery behavior for broken assets, failed handoffs, or degraded support paths.

### Discovery Context

These issues were identified during implementation readiness review before implementation started. No production code rollback is needed. This is a planning correction intended to prevent scope expansion, sequencing confusion, and under-specified trust behavior during delivery.

### Evidence

- `/_bmad-output/planning-artifacts/prd.md` keeps blog/writing infrastructure outside MVP and treats writing discoverability as future-facing.
- `/_bmad-output/planning-artifacts/ux-design-specification.md` repeatedly frames `Projects`, `Resume`, and `Blog` as launch pathways and launch navigation priorities.
- `/_bmad-output/planning-artifacts/architecture.md` explicitly calls for Git-based CI/CD, `S3 + CloudFront`, and deployment automation as part of implementation sequencing.
- `/_bmad-output/planning-artifacts/epics.md` lacks a dedicated foundation story for CI/CD and deployment baseline and under-specifies fallback behavior for trust-critical resume/contact failure states.

## 2. Impact Analysis

### Epic Impact

- `Epic 1` is affected by sequencing and scope definition. It needs one new bounded story for CI/CD and deployment baseline and renumbering of later stories in that epic.
- `Epic 3` is affected by acceptance-criteria quality. Resume and contact stories need explicit failure-path and recovery expectations.
- `Epic 4` is affected by scope clarity. Future writing and publishing support must remain extension-ready rather than launch-implied.

### Story Impact

- Add new `Story 1.2` for CI/CD and deployment baseline.
- Renumber current `Story 1.2` to `Story 1.3`, current `Story 1.3` to `Story 1.4`, and current `Story 1.4` to `Story 1.5`.
- Update `Story 3.1` to define fallback behavior when resume access fails.
- Update `Story 3.4` to define recovery behavior when contact actions fail.
- Update `Story 4.2` and `Story 4.5` to keep writing/publishing explicitly post-launch and extension-ready.

### Artifact Conflicts

- `/_bmad-output/planning-artifacts/prd.md`: remains mostly correct; serves as the source-of-truth boundary for MVP scope.
- `/_bmad-output/planning-artifacts/ux-design-specification.md`: requires launch-path wording updates from `Blog` to `Contact` and stronger future-writing framing.
- `/_bmad-output/planning-artifacts/architecture.md`: remains directionally correct; no strategy change required, but downstream planning artifacts must align to its documented deployment foundation and optional future-writing seams.
- `/_bmad-output/planning-artifacts/epics.md`: requires the main backlog edits.

### Technical Impact

- Implementation should begin on a repeatable CI/build/deploy foundation rather than deferring deployment setup until the end.
- Trust-sensitive browsing flows should include defined degradation behavior for broken resume assets, contact-action failures, and optional dependency failures.
- Future writing boundaries should remain in the content model and architecture, but not appear as launch navigation or MVP-visible obligations.

## 3. Recommended Approach

### Chosen Path

Use a hybrid correction led by direct adjustment of existing planning artifacts, with a light MVP reaffirmation.

- Primary approach: modify existing stories and add one new bounded story within the current epic structure.
- Secondary approach: reaffirm the existing PRD MVP boundary so downstream artifacts stop implying launch blog scope.

### Why This Path

- It resolves the actual problems without re-planning the product.
- It preserves momentum because implementation has not started yet.
- It gives implementation agents clearer sequencing, lower scope ambiguity, and safer definitions of done.
- It aligns all downstream artifacts to the PRD and architecture instead of changing those foundations unnecessarily.

### Alternatives Considered

- `Potential Rollback`: not applicable because no implementation work needs reverting.
- `Full MVP Review`: unnecessary because the PRD already defines the right MVP boundary.

### Effort, Risk, and Timeline Impact

- Effort: `Medium`
- Risk: `Low`
- Timeline impact: small, assuming planning artifacts are corrected before implementation starts

## 4. Detailed Change Proposals

### Stories

#### Proposal 1: Add Explicit CI/CD and Deployment Foundation Story in Epic 1

**Artifact:** `/_bmad-output/planning-artifacts/epics.md`

**Section:** Epic 1 story inventory and ordering

**OLD:**

```md
### Story 1.1: Set Up Initial Project from Starter Template
...
### Story 1.2: Home Page Hero and Identity Introduction
...
### Story 1.3: Global Navigation and First-Visit Orientation
...
### Story 1.4: Responsive Layout and Mobile-First Behavior
```

**NEW:**

```md
### Story 1.1: Set Up Initial Project from Starter Template
[keep story intent tightly bounded to starter/bootstrap only]

### Story 1.2: Establish CI/CD and Deployment Baseline
As Chris,
I want the project connected to a minimal CI/CD and deployment baseline,
So that implementation happens on top of a repeatable, validated, production-shaped foundation.

**FRs implemented:** FR39, FR40, FR41, FR44

**Acceptance Criteria:**

**Given** the starter project is initialized
**When** the implementation foundation is prepared
**Then** a Git-based CI workflow runs the agreed validation and build steps for pull requests or pushes
**And** failures are visible before deployment activity continues

**Given** the production hosting approach is part of the approved architecture
**When** deployment foundations are configured
**Then** the project includes a bounded setup for `Amazon S3 + Amazon CloudFront` deployment
**And** secrets and environment responsibilities are separated from application content and code

**Given** the deployment path is reviewed before feature work expands
**When** the repository and planning artifacts are checked
**Then** the CI/CD and deployment setup matches the static-first architecture
**And** it does not introduce unnecessary runtime services, databases, or optional integrations

### Story 1.3: Home Page Hero and Identity Introduction
[renumbered from 1.2 with no scope change]

### Story 1.4: Global Navigation and First-Visit Orientation
[renumbered from 1.3 with no scope change]

### Story 1.5: Responsive Layout and Mobile-First Behavior
[renumbered from 1.4 with no scope change]
```

**Rationale:** The architecture already expects CI/CD and deployment foundation work. Adding a dedicated story prevents `Story 1.1` from becoming an unbounded catch-all and improves implementation sequencing.

#### Proposal 2: Tighten Resume and Contact Failure-Path Coverage

**Artifact:** `/_bmad-output/planning-artifacts/epics.md`

**Sections:** `Story 3.1` and `Story 3.4` acceptance criteria

**OLD:**

```md
**Given** a visitor opens the resume destination or download
**When** the content loads
**Then** the resume asset is reachable and presented as current professional material
**And** broken links or missing assets are not exposed in the normal browsing path

...

**Given** the visitor encounters incomplete input, a failed handoff, or another contact-related issue
**When** feedback appears
**Then** the message explains what went wrong in plain language
**And** it tells the visitor how to recover without blaming or confusing them
```

**NEW:**

```md
**Given** a visitor opens the resume destination or download
**When** the content loads successfully
**Then** the resume asset is reachable and presented as current professional material
**And** the transition preserves orientation within the evaluation flow

**Given** the resume asset is unavailable, outdated, or misconfigured
**When** a visitor reaches a resume access point
**Then** the site does not send them into a broken or trust-eroding dead end
**And** it presents a clear fallback or recovery path such as an alternate resume view, explanatory message, or adjacent contact path

...

**Given** the visitor encounters incomplete input, a failed handoff, or another contact-related issue
**When** feedback appears
**Then** the message explains what went wrong in plain language
**And** it tells the visitor how to recover without blaming or confusing them

**Given** a contact action cannot complete through the intended lightweight mechanism
**When** the failure state is shown
**Then** the site preserves at least one clear next step for outreach
**And** the failure does not strand the visitor without a trustworthy recovery option
```

**Rationale:** Current stories describe the happy path and some generic error feedback, but they do not define product behavior when trust-critical assets fail. These additions operationalize the PRD and architecture’s resilience expectations.

#### Proposal 3: Keep Future Writing Explicitly Outside Launch Scope

**Artifact:** `/_bmad-output/planning-artifacts/epics.md`

**Sections:** Additional Requirements, `Story 4.2`, `Story 4.5`

**OLD:**

```md
- Preserve immediate first-screen identity clarity, obvious access to Projects, Resume, Blog, and contact pathways across all viewport sizes.

### Story 4.2: Structured Search Signals for Projects and Future Publishing
...
So that projects are easier to find now and future writing or case-study content can be added cleanly later.

### Story 4.5: Future-Ready Content and Integration Boundaries
...
Then** the current structure supports growth in projects and future content areas without redefining the site's core purpose
```

**NEW:**

```md
- Preserve immediate first-screen identity clarity, obvious access to Projects, Resume, and contact pathways across all viewport sizes, while keeping future writing discoverability out of launch navigation scope.

### Story 4.2: Structured Search Signals for Projects and Future Publishing
As Chris,
I want the content system to support structured discoverability signals,
So that projects are easier to find now and future writing or case-study content can be added cleanly after launch without redefining MVP scope.

...

**Given** project and core site content is modeled for the MVP
**When** metadata and page structure are defined
**Then** the implementation supports project-specific discoverability cues such as meaningful headings, summaries, and page-level metadata
**And** any future writing or case-study discoverability remains explicitly extension-ready rather than launch-required

### Story 4.5: Future-Ready Content and Integration Boundaries
...
**Given** the MVP information architecture and content model are defined
**When** future enhancements are considered
**Then** the current structure supports growth in projects and future content areas without redefining the site's core purpose
**And** the launch experience remains coherent on its own without requiring future writing surfaces to be present
```

**Rationale:** This preserves valid future-writing seams while removing the planning ambiguity that currently suggests blog functionality belongs in launch scope.

### UI/UX

#### Proposal 4: Align Launch UX Pathways to MVP Scope

**Artifact:** `/_bmad-output/planning-artifacts/ux-design-specification.md`

**Sections:** Chosen Direction, Design Rationale, Implementation Approach, Editorial Pathway Block, Navigation Patterns

**OLD:**

```md
Below the hero, the site should adopt a warmer editorial organization based on three launch categories: `Projects`, `Resume`, and `Blog`.
...
The homepage should then flow into three clearly organized launch sections or pathways: `Projects`, `Resume`, and `Blog`.
...
**Purpose:** Introduce major launch destinations - `Projects`, `Resume`, and `Blog`
...
Labels should be direct ... with primary emphasis on the launch destinations that matter most: `Projects`, `Resume`, and `Blog`.
```

**NEW:**

```md
Below the hero, the site should adopt a warmer editorial organization based on three launch priorities: `Projects`, `Resume`, and `Contact`. These should feel like clear, meaningful pathways for trust-building evaluation rather than generic homepage sections. Future writing or blog content should be accounted for in the long-term information architecture, but it should remain explicitly outside launch scope.

...

The homepage should then flow into three clearly organized launch sections or pathways: `Projects`, `Resume`, and `Contact`, with future writing positioned as a later expansion rather than a launch destination.

...

**Purpose:** Introduce major launch destinations - `Projects`, `Resume`, and `Contact` - as meaningful trust-building pathways rather than generic navigation tiles.

...

Labels should be direct ... with primary emphasis on the launch destinations that matter most: `Projects`, `Resume`, and `Contact`.
```

**Rationale:** The UX spec currently contains the clearest scope drift. Replacing `Blog` with `Contact` aligns the launch UX with the PRD’s MVP goals and with the site’s core trust/conversion path.

### PRD

#### Proposal 5: No Structural PRD Rewrite; Use PRD as Scope Authority

**Artifact:** `/_bmad-output/planning-artifacts/prd.md`

**Change Type:** Clarification only; no major content change required

**Current Position:**

```md
The MVP does not require blog infrastructure...
...
Phase 2 (Post-MVP):
- blog or writing section
```

**Proposed Handling:**

```md
No major PRD rewrite required. Treat existing MVP and post-MVP boundary language as the governing source for downstream artifact corrections.
```

**Rationale:** The PRD already defines the correct scope boundary. The problem is downstream planning drift, not PRD intent.

### Architecture

#### Proposal 6: No Strategic Architecture Change; Preserve Explicit Future-Facing Wording

**Artifact:** `/_bmad-output/planning-artifacts/architecture.md`

**Change Type:** Alignment note; optional wording refinements only

**Current Position:**

```md
- Use Git-based CI/CD to build, publish, and invalidate CDN caches.
...
- Future writing/publishing
  - Routes: `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`
...
The future-ready seams for posts, integrations, and API routes do not currently conflict with the static-first strategy because they are explicitly documented as optional and non-foundational.
```

**Proposed Handling:**

```md
No strategy rewrite required. Keep CI/CD and deployment expectations intact, and ensure any future-writing references remain explicitly optional, non-foundational, and post-launch in downstream planning documents.
```

**Rationale:** The architecture is already internally coherent. The correction belongs primarily in epics and UX wording.

## 5. Implementation Handoff

### Scope Classification

`Moderate`

This change does not require a fundamental replan, but it does require backlog reorganization, story renumbering, and coordinated artifact updates before implementation starts.

### Handoff Recipients

- Product Owner / Scrum Master: update epic and story structure, sequencing, and acceptance criteria in planning artifacts
- Product Owner / UX collaborator: align UX launch-path wording to the approved MVP scope
- Development team: implement only after the corrected story sequence and definitions of done are approved

### Responsibilities

- Update `/_bmad-output/planning-artifacts/epics.md` with the approved new story, renumbering, and acceptance-criteria revisions
- Update `/_bmad-output/planning-artifacts/ux-design-specification.md` to remove launch `Blog` language and replace it with MVP-aligned launch pathways
- Preserve `/_bmad-output/planning-artifacts/prd.md` and `/_bmad-output/planning-artifacts/architecture.md` as governing references unless minor clarification wording is later deemed useful
- If a `sprint-status.yaml` file is later created or already exists in another planning workflow, reflect approved story additions and renumbering there as well

### Success Criteria

- No planning artifact still implies `Blog` is a launch destination
- Epic 1 contains an explicit CI/CD and deployment baseline story before user-facing implementation expands
- Resume and contact stories include concrete failure-path recovery expectations
- Future-writing support remains clearly extension-ready but post-launch
- Implementation can begin without scope ambiguity or foundation sequencing gaps

## 6. Approval and Routing

- Approval status: Approved by Chris on `2026-03-10`
- Scope classification: `Moderate`
- Routed to: Product Owner / Scrum Master for backlog and artifact updates before implementation
- Follow-on recipients: UX/planning owner for `ux-design-specification.md` alignment, then development for implementation after planning updates are complete
- `sprint-status.yaml`: not updated because no such file exists in the repository
