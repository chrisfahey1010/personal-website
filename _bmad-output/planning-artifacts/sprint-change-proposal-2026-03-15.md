# Sprint Change Proposal - 2026-03-15

## 1. Issue Summary

### Problem Statement

The current project baseline assumes AWS-based static deployment using `Amazon S3 + Amazon CloudFront`, but that hosting direction is no longer valid. The domain `fahey.vip` is owned in Cloudflare, AWS services are no longer acceptable, and the desired launch path is now the simplest viable Cloudflare-oriented deployment for the Astro site in its current work-in-progress state.

### Discovery Context

This issue was identified after `Story 1.2: Establish CI/CD and Deployment Baseline` had already been completed with AWS-specific workflows, tests, and infrastructure notes. The change is therefore not only a planning update; it also affects already-completed implementation artifacts.

### Evidence

- `_bmad-output/planning-artifacts/epics.md` defines production deployment as `Amazon S3 + Amazon CloudFront`.
- `_bmad-output/planning-artifacts/architecture.md` uses `S3 + CloudFront` as the default production hosting and CI/CD model.
- `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md` marks an AWS-oriented deployment baseline as complete.
- `.github/workflows/deploy.yml` currently validates AWS inputs, assumes OIDC-based AWS auth, syncs `dist/` to S3, and invalidates CloudFront.
- `infrastructure/README.md`, `infrastructure/cloudfront/README.md`, and `tests/story-1-1-foundation.test.mjs` all enforce the AWS baseline.

## 2. Impact Analysis

### Epic Impact

- `Epic 1` is directly affected because `Story 1.2` established the now-invalid hosting baseline.
- `Epic 2` remains functionally valid, but any assumptions about content/media hosting should align to repository-hosted content and Cloudflare delivery.
- `Epic 3` remains valid and should continue avoiding unnecessary runtime/service complexity.
- `Epic 4` remains valid but needs wording updates around ownership, content storage, deployment, and third-party dependence.

### Story Impact

- `Story 1.2` should be revised or explicitly marked as superseded in its AWS-specific implementation details.
- A replacement or follow-up story may be added to track the Cloudflare deployment correction cleanly.
- Completed feature stories do not need redesign; they depend only on the corrected baseline, not AWS itself.

### Artifact Conflicts

- `PRD`: no core product-goal conflict, but hosting and content-ownership expectations should be clarified.
- `Epics`: direct conflict in deployment baseline wording and `Story 1.2` acceptance criteria.
- `Architecture`: direct conflict in hosting, CI/CD, security, caching, and implementation sequencing sections.
- `UI/UX`: no meaningful product or design conflict; only minimal wording cleanup if hosting is referenced.

### Technical Impact

- Remove or replace the AWS deployment workflow.
- Replace AWS/CloudFront infrastructure notes with Cloudflare Pages guidance.
- Rewrite tests that currently enforce the AWS deployment model.
- Keep authored content in the repository wherever practical; avoid S3 or other object storage for normal site content.

## 3. Recommended Approach

### Chosen Path

Hybrid: `Direct Adjustment` plus a light `MVP Review`

### Recommendation

Adopt `Cloudflare Pages` as the new production hosting target and keep the current Astro architecture static-first and repository-hosted. Preserve Git-based CI validation, but prefer native Cloudflare Pages Git deployment from `main` rather than replacing AWS with another custom deployment pipeline.

### Why This Approach

- Lowest operational friction for a solo-maintained Astro site
- Best fit for a domain already owned in Cloudflare
- Preserves the existing static-first, low-complexity direction
- Supports immediate WIP launch without overengineering
- Avoids unnecessary rollback of completed product work

### Alternatives Considered

- `Rollback`: not recommended because the drift is concentrated in deployment artifacts, not the product itself.
- `MVP reduction`: not necessary because MVP remains achievable without reducing core scope.
- `More complex Cloudflare stack`: not recommended for MVP; avoid Workers, Functions, or R2 unless a later requirement earns them.

### Effort / Risk / Timeline

- Effort: Medium
- Risk: Low
- Timeline impact: Limited; mostly planning corrections plus targeted deployment-artifact replacement

## 4. Detailed Change Proposals

### Stories

#### Story 1.2 - Acceptance Criteria

Story: `1.2 Establish CI/CD and Deployment Baseline`
Section: `Acceptance Criteria`

OLD:
```md
**Given** the production hosting approach is part of the approved architecture
**When** deployment foundations are configured
**Then** the project includes a bounded setup for `Amazon S3 + Amazon CloudFront` deployment
**And** secrets and environment responsibilities are separated from application content and code
```

NEW:
```md
**Given** the production hosting approach is part of the approved architecture
**When** deployment foundations are configured
**Then** the project includes a bounded setup for `Cloudflare Pages` deployment for the static Astro site
**And** domain, deployment, and environment responsibilities are separated cleanly from application content and code
```

Rationale: preserves the story purpose while replacing the invalid AWS baseline.

#### Story 1.2 - Status Interpretation

Story: `1.2 Establish CI/CD and Deployment Baseline`
Section: `Implementation status / notes`

OLD:
```md
The story is implicitly complete as the production-shaped deployment baseline.
```

NEW:
```md
The original AWS-oriented implementation of this story is superseded by the approved Cloudflare deployment baseline. The story intent remains valid, but AWS-specific workflow, documentation, and test details are no longer canonical and must be replaced or updated.
```

Rationale: prevents AWS implementation drift from being treated as current truth.

#### Optional Follow-up Story

Story: `1.x Replace AWS Deployment Baseline with Cloudflare Pages`

NEW:
```md
As Chris,
I want the deployment baseline updated from AWS to Cloudflare Pages,
So that I can launch the Astro site on `fahey.vip` quickly with the simplest viable static hosting setup.

**FRs implemented:** FR39, FR40, FR41, FR44

**Acceptance Criteria:**

**Given** the repo already contains an AWS-oriented deployment baseline
**When** the hosting pivot is implemented
**Then** AWS-specific deploy workflow, infrastructure notes, and tests are replaced with a Cloudflare-oriented static deployment baseline

**Given** the site is static-first and content is repository-hosted
**When** deployment is reviewed
**Then** the chosen hosting setup keeps authored content in the repository wherever practical and does not require S3 or other object storage for normal site content

**Given** the domain is already managed in Cloudflare
**When** production deployment is configured
**Then** `fahey.vip` can point to the Cloudflare-hosted site without Route 53 dependencies

**Given** MVP launch is the goal
**When** the deployment path is finalized
**Then** the setup uses the simplest viable Git-based deployment flow and avoids unnecessary Workers, Functions, R2, or other add-on services
```

Rationale: provides a clean implementation-tracking vehicle if a simple revision to `Story 1.2` is not preferred.

### PRD

Section: `Content Management & Long-Term Ownership`

NEW ADDITION:
```md
- Core site content and normal static assets should remain repository-hosted wherever practical.
- MVP hosting should favor a managed static deployment platform aligned with low operational friction and simple domain ownership.
- External object storage is not a launch requirement for normal site content unless future media scale materially changes.
```

Rationale: codifies the repository-owned content strategy and avoids future drift toward object-storage-backed content.

Section: `Reliability / deployment posture`

NEW ADDITION:
```md
- The deployment baseline should support simple Git-based production releases and low-friction rollback suitable for a solo-maintained Astro website.
- Hosting choices should minimize infrastructure ownership burden while preserving secure transport, reliable delivery, and static-first performance.
```

Rationale: reinforces the intended MVP operating model without overcommitting to a single vendor inside the PRD.

### Epics

File: `_bmad-output/planning-artifacts/epics.md`
Section: `Additional Requirements`

OLD:
```md
- Deploy production via Amazon S3 plus Amazon CloudFront with restricted origin access, HTTPS-only delivery, secure headers, cache invalidation, and Git-based CI/CD.
```

NEW:
```md
- Deploy production via `Cloudflare Pages` for the static Astro site, using secure transport, managed global delivery, and a simple Git-based CI/CD path.
```

Rationale: resets the official hosting baseline.

File: `_bmad-output/planning-artifacts/epics.md`
Section: `Additional Requirements`

OLD:
```md
- Keep authored content in source control and make content/schema validation a build gate.
```

NEW:
```md
- Keep authored content in source control and in the repository wherever practical, and make content/schema validation a build gate.
```

Rationale: sharpens the content ownership model.

File: `_bmad-output/planning-artifacts/epics.md`
Section: `Story 1.2 Acceptance Criteria`

OLD:
```md
**Then** the project includes a bounded setup for `Amazon S3 + Amazon CloudFront` deployment
```

NEW:
```md
**Then** the project includes a bounded setup for `Cloudflare Pages` deployment for the static Astro site
```

Rationale: updates Epic 1 to match the new deployment target.

### Architecture

File: `_bmad-output/planning-artifacts/architecture.md`
Section: `Core Architectural Decisions / Critical Decisions`

OLD:
```md
- Deploy the production site via `Amazon S3 + Amazon CloudFront`.
```

NEW:
```md
- Deploy the production site via `Cloudflare Pages`.
```

Rationale: top-level architecture correction.

Section: `Important Decisions`

OLD:
```md
- Use Git-based CI/CD to build, publish, and invalidate CDN caches.
- Prefer a CloudFront-first private-origin setup over a casually public bucket configuration.
```

NEW:
```md
- Use a simple Git-based validation and deployment flow appropriate for `Cloudflare Pages`.
- Prefer platform-managed static hosting over self-managed storage-plus-CDN infrastructure for MVP launch.
```

Rationale: removes AWS-specific assumptions while preserving the simplicity goal.

Section: `Data Architecture / Caching Strategy`

OLD:
```md
Use static asset fingerprinting from the build pipeline plus `CloudFront` edge caching for published assets and pages. Cache behavior should favor long-lived immutable assets and controlled invalidation for changed HTML/content paths.
```

NEW:
```md
Use static asset fingerprinting from the build pipeline plus managed edge caching on the hosting platform for published assets and pages. Cache behavior should favor long-lived immutable assets for build outputs while keeping HTML updates straightforward through platform deployment behavior.
```

Rationale: keeps the cache strategy but makes it hosting-platform neutral and Cloudflare-compatible.

Section: `Authentication & Security / Security Baseline`

OLD:
```md
- `CloudFront`-based delivery layer
- restricted AWS origin access between `CloudFront` and `S3`
```

NEW:
```md
- managed static hosting delivery layer
- platform-managed HTTPS and edge delivery
```

Rationale: preserves the security posture without requiring AWS-specific origin design.

Section: `Authentication & Security / Data Encryption Approach`

OLD:
```md
Rely on AWS-managed transport and storage protections. Use standard encrypted AWS storage defaults where appropriate, but no app-layer encryption design is needed for MVP content because there is no user account or sensitive application data model.
```

NEW:
```md
Rely on hosting-platform-managed transport and storage protections where applicable. No app-layer encryption design is needed for MVP content because there is no user account or sensitive application data model.
```

Rationale: same security intent, no AWS lock-in.

Section: `Threat Model Notes`

OLD:
```md
- misconfigured S3/CloudFront origin access
```

NEW:
```md
- misconfigured hosting, domain, or deployment settings
```

Rationale: reflects the new platform while staying future-friendly.

Section: `Infrastructure & Deployment`

OLD:
```md
**ADR Summary:**
Use a private static origin plus CDN delivery on AWS as the default production shape, with Git-driven deployments and minimal operational moving parts.

**Hosting Strategy:**
Use `Amazon S3` as the static origin and `Amazon CloudFront` as the CDN and HTTPS delivery layer for production.

**CI/CD Pipeline Approach:**
Use a Git-based pipeline to:
- install dependencies
- run validation/build steps
- publish `dist/` to S3
- invalidate relevant CloudFront cache paths after deployment
```

NEW:
```md
**ADR Summary:**
Use `Cloudflare Pages` as the default production hosting shape for the static Astro site, with Git-driven deployments and minimal operational moving parts.

**Hosting Strategy:**
Use `Cloudflare Pages` for managed static hosting, HTTPS delivery, preview environments, and production deployment.

**CI/CD Pipeline Approach:**
Use a Git-based pipeline to:
- install dependencies
- run validation/build steps
- deploy the static site through `Cloudflare Pages` using either native Git integration or a minimal deployment workflow only if needed
```

Rationale: core deployment strategy replacement.

Section: `Monitoring and Logging`

OLD:
```md
- `CloudFront`/`S3` access visibility as needed
```

NEW:
```md
- hosting-platform deployment visibility and basic availability checks as needed
```

Rationale: keeps observability light and platform-native.

Section: `Origin Security Implication`

OLD:
```md
Prefer a `CloudFront`-first `S3` architecture with restricted origin access rather than treating the bucket as an openly exposed website endpoint.
```

NEW:
```md
Prefer platform-managed static hosting with straightforward domain and HTTPS configuration rather than self-managed storage-and-CDN infrastructure for MVP launch.
```

Rationale: aligns directly to the simplest viable path.

Section: `Rationale`

OLD:
```md
`S3 + CloudFront` gives strong AWS alignment, predictable static hosting behavior, low operational overhead, and excellent performance characteristics for a public content-led website.
```

NEW:
```md
`Cloudflare Pages` gives low-friction static hosting, simple domain alignment for `fahey.vip`, preview-friendly deployment, low operational overhead, and excellent performance characteristics for a public content-led website.
```

Rationale: updates the architecture decision to the new business constraint.

Section: `Implementation Sequence`

OLD:
```md
3. Set up the bounded CI/build/deploy foundation for `S3 + CloudFront` so feature work starts on a repeatable baseline.
```

NEW:
```md
3. Set up the bounded CI/build/deploy foundation for `Cloudflare Pages` so feature work starts on a repeatable baseline.
```

Rationale: preserves the sequence while fixing the target.

Section: `Cross-Component Dependencies`

OLD:
```md
- The `S3 + CloudFront` deployment choice reinforces the decision to avoid runtime-heavy features at launch.
```

NEW:
```md
- The `Cloudflare Pages` deployment choice reinforces the decision to avoid runtime-heavy features at launch.
```

Rationale: same architectural principle, corrected host.

### UI/UX

File: `_bmad-output/planning-artifacts/ux-design-specification.md`

Recommended note:
```md
No major UX redesign is required from this hosting change. Any hosting references should remain platform-light and continue to support calm, reliable, fast, mobile-first behavior suitable for static deployment.
```

Rationale: the change is operational, not experiential.

### Implementation Artifacts

File: `.github/workflows/deploy.yml`

OLD:
```yml
AWS_REGION: ${{ vars.AWS_REGION }}
AWS_ROLE_TO_ASSUME: ${{ vars.AWS_ROLE_TO_ASSUME }}
AWS_S3_BUCKET: ${{ vars.AWS_S3_BUCKET }}
AWS_CLOUDFRONT_DISTRIBUTION_ID: ${{ vars.AWS_CLOUDFRONT_DISTRIBUTION_ID }}
...
- name: Configure AWS credentials
...
- name: Sync site to S3
  run: aws s3 sync dist/ s3://$AWS_S3_BUCKET --delete
- name: Invalidate CloudFront HTML entry points
  run: aws cloudfront create-invalidation ...
```

NEW:
```yml
Either remove this workflow entirely and let `Cloudflare Pages` deploy from Git automatically,
or replace it with a minimal Cloudflare deployment workflow that:
- runs only after CI succeeds on `main`
- builds the static site
- deploys to `Cloudflare Pages`
- uses only the minimal Cloudflare token/project inputs required
```

Rationale: native Cloudflare Git integration is the simplest viable MVP path.

File: `infrastructure/README.md`

OLD:
```md
This project deploys as a static Astro site with a private S3 origin behind CloudFront.
```

NEW:
```md
This project deploys as a static Astro site on `Cloudflare Pages`.
```

Rationale: resets the canonical infrastructure note.

File: `infrastructure/cloudfront/README.md`

OLD:
```md
# CloudFront deployment notes
```

NEW:
```md
Replace with `infrastructure/cloudflare/README.md` describing:
- Cloudflare Pages as the hosting target
- Git-connected deployment from `main`
- preview deployments for branches or pull requests if enabled
- `fahey.vip` domain attachment in Cloudflare
- no S3 or object-storage requirement for normal site content
```

Rationale: the CloudFront note is obsolete under the new baseline.

File: `tests/story-1-1-foundation.test.mjs`

OLD:
```js
assert.match(workflow, /aws s3 sync dist\/ s3:\/\//, 'deploy should sync dist to S3');
assert.match(workflow, /aws cloudfront create-invalidation/, 'deploy should invalidate CloudFront');
```

NEW:
```js
Replace AWS-specific assertions with checks that enforce the new baseline, such as:
- no AWS deployment workflow remains
- no AWS deployment variables are required
- deployment baseline is Cloudflare-oriented or delegated to native Cloudflare Pages Git deployment
- repository content remains the source of truth
```

Rationale: existing tests currently enforce the wrong strategy.

File: `_bmad-output/implementation-artifacts/1-2-establish-ci-cd-and-deployment-baseline.md`

Recommended addition:
```md
Status note: The original AWS-oriented deployment implementation was later superseded by an approved Cloudflare Pages baseline after a hosting-direction change. Story intent remains valid, but AWS-specific implementation details are no longer canonical.
```

Rationale: preserves history while clarifying the new source of truth.

### Other Planning Artifacts

File: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-09.md`

OLD:
```md
...places CI/CD plus `S3 + CloudFront` foundation work earlier in the implementation sequence.
```

NEW:
```md
...places CI/CD plus the static hosting deployment foundation earlier in the implementation sequence, now aligned to `Cloudflare Pages`.
```

Rationale: keeps the report usable without preserving stale platform assumptions.

File: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md`

Recommended addition:
```md
This proposal introduced an AWS-oriented deployment baseline that was later superseded by an approved Cloudflare Pages hosting direction after domain and platform constraints changed.
```

Rationale: preserves auditability.

## 5. Implementation Handoff

### Scope Classification

Moderate

### Handoff Recipients

- `Product Owner / Scrum Master`
  - revise or supersede `Story 1.2`
  - decide whether to update the existing story or create a follow-up replacement story
  - update sprint tracking artifacts accordingly

- `Architect / PM`
  - update architecture and any PRD-level wording needed for hosting, deployment, and ownership baseline changes
  - confirm `Cloudflare Pages` as the canonical hosting target

- `Development team`
  - replace AWS deploy workflow, infrastructure notes, and tests with the approved Cloudflare baseline
  - preserve simple CI validation and static-first constraints

### Success Criteria

- Planning artifacts no longer describe AWS, S3, CloudFront, or Route 53 as the hosting baseline.
- `Cloudflare Pages` is the documented production target for MVP/WIP launch.
- Repository-hosted content is explicitly preferred wherever practical.
- AWS-specific implementation artifacts are removed, replaced, or clearly marked as superseded.
- The repo has a simple, low-friction deployment path for `fahey.vip` without adding unnecessary platform complexity.

### Recommended Immediate Next Actions

1. Update `epics.md` and `architecture.md` first so planning truth is corrected.
2. Revise or supersede `Story 1.2` and update `_bmad-output/implementation-artifacts/sprint-status.yaml` if story tracking changes.
3. Replace `.github/workflows/deploy.yml`, infrastructure docs, and deployment guardrail tests.
4. Configure `Cloudflare Pages` Git deployment for `main` and attach `fahey.vip`.
