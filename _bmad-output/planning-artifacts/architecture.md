---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - _bmad-output/planning-artifacts/product-brief-personal-website-2026-03-09.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/research/technical-visual-design-system-for-a-personal-website-frontend-research-2026-03-09.md
  - _bmad-output/planning-artifacts/research/technical-astro-content-architecture-for-a-personal-website-research-2026-03-09.md
  - _bmad-output/planning-artifacts/research/technical-static-site-stack-research-2026-03-09.md
  - _bmad-output/planning-artifacts/research/domain-high-quality-personal-websites-personal-brand-sites-for-builders-and-creative-technologists-research-2026-03-09.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-09T16:44:48-07:00'
project_name: 'personal-website'
user_name: 'Chris'
date: '2026-03-09T12:24:30-07:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The project defines 46 functional requirements across nine capability groups: identity and professional positioning, project discovery and proof of work, resume and evaluation support, contact and conversion, cross-device access, discoverability, accessibility, content management and ownership, and trust protection.

Architecturally, these requirements resolve into a small number of high-value product capabilities rather than a broad application platform. The system must support:
- a trust-forming homepage and identity layer
- structured project and proof-of-work presentation
- stable resume access and experience summary pathways
- simple, low-friction contact mechanisms
- discoverable public content with durable metadata and semantic structure
- maintainable content updates by the site owner without high operational overhead

The requirements imply a content-led architecture where page composition, content modeling, metadata, and reusable presentation patterns matter more than transactional workflows or account systems. There are no real-time, collaborative, or multi-user application demands at launch, but there is a strong requirement for extensibility into richer case studies, blog content, and future publishing surfaces.

**Non-Functional Requirements:**
The NFRs are architecture-defining. This is not just a small website; it is a credibility surface where implementation quality is part of the product itself.

Key architectural NFR drivers include:
- fast first-load performance and low client-side weight
- responsive behavior across mobile, tablet, and desktop
- `WCAG 2.2 AA` accessibility as a baseline quality bar
- stable navigation and rendering with minimal layout shift
- privacy-conscious operation with minimal unnecessary data collection
- secure delivery and careful exposure of personal/contact information
- strong crawlability, metadata quality, and semantic discoverability
- maintainability and long-term ownership of content and structure

These NFRs significantly constrain architectural freedom. Any solution that adds unnecessary runtime complexity, heavy dependencies, inaccessible motion patterns, or privacy-heavy third-party tooling would conflict with the documented intent.

**Scale & Complexity:**
The feature surface is modest, but the architecture is not trivial because experience quality, trust sensitivity, and long-term maintainability are central success criteria.

Complexity indicators:
- Real-time features: none at launch
- Multi-tenancy: none
- Regulatory/compliance exposure: low to moderate, primarily accessibility, privacy, disclosure, and secure data handling
- Integration complexity: low at launch, potentially moderate later if forms, analytics, CMS, or external content systems expand
- User interaction complexity: medium, due to editorial layout quality, responsive behavior, optional motion, and accessibility-sensitive interactions
- Data complexity: low to medium, with structured content relationships more important than data volume

- Primary domain: web
- Complexity level: medium
- Estimated architectural components: 8-12

### Technical Constraints & Dependencies

The project context strongly constrains the architecture toward a public, content-first, multi-page web experience rather than an app-centric system. The architecture must preserve semantic HTML, excellent first-render behavior, crawlable content, and progressive enhancement.

Known constraints and dependencies include:
- launch should favor a static-first or otherwise HTML-first rendering model
- content structure must support future growth into projects, resume, and writing without major remodeling
- interaction design must remain accessible, keyboard-operable, and motion-optional
- navigation, layout, and content hierarchy must remain dependable under mobile-first responsive conditions
- design quality must be systematic, not page-by-page improvised
- future additions such as analytics, contact workflows, CMS-backed editing, or lightweight dynamic freshness must remain possible without forcing a rewrite

The loaded research also creates a strategic dependency on architectural restraint: the implementation should prefer durable, low-complexity patterns that preserve speed, clarity, and ownership over fashionable capability breadth.

### Cross-Cutting Concerns Identified

Several cross-cutting concerns will shape nearly every architectural decision:

- Accessibility: semantic structure, focus handling, contrast, motion reduction, overlay behavior, form feedback, and touch target sizing
- Performance: rendering strategy, asset budgets, media handling, font loading, client-side JavaScript limits, and page stability
- SEO and discoverability: routing, metadata, structured data, page hierarchy, internal linking, and public crawlability
- Maintainability: content modeling, authoring workflow, reusable page patterns, dependency discipline, and ease of future updates
- Privacy and security hygiene: careful personal-data exposure, minimal tracking, safe contact flows, HTTPS-first delivery, and conservative third-party integration
- Progressive enhancement: ensuring the core experience remains complete without relying on advanced runtime behavior
- Trust preservation: avoiding broken links, stale content, inconsistent presentation, or unnecessary UI complexity that could weaken credibility

### Architectural Pressure Points

The analysis reveals several decision pressure points that later architecture choices must address explicitly:

- **Rendering model pressure:** the site must feel highly polished without drifting into a runtime-heavy architecture that harms performance or crawlability.
- **Content model pressure:** projects, resume content, and identity material need enough structure to scale, but not so much complexity that authoring becomes burdensome.
- **Interaction pressure:** the site needs deliberate motion and refinement, but those enhancements must remain non-essential and accessible.
- **Tooling pressure:** the system should support long-term ownership and iteration without becoming dependent on a complex stack too early.
- **Trust pressure:** because the site itself is part of the portfolio signal, implementation inconsistency is not just a technical flaw; it is a product failure.

### Failure Risks Observed Early

A pre-mortem view suggests the most likely architecture failures would be:
- overbuilding the stack for a relatively contained product scope
- under-modeling content, leading to brittle page-specific implementations
- adding too much client-side behavior in pursuit of polish
- introducing third-party services that damage privacy, performance, or maintainability
- treating accessibility as QA cleanup instead of an architectural requirement
- optimizing for future optionality so aggressively that launch quality suffers

These risks do not suggest a more complex architecture. They suggest the opposite: clarity, structure, and restraint will likely outperform flexibility-maximizing decisions at this stage.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Use a no-database launch architecture and treat the site as a static-first content platform.
- Model site content with `Astro content collections` and validate schemas with `Zod 4`.
- Use no authentication or authorization at launch.
- Expose no public application API at launch.
- Use local component state only and avoid global client state infrastructure.
- Deploy the production site via `Amazon S3 + Amazon CloudFront`.

**Important Decisions (Shape Architecture):**
- Use build-time content loading as the default communication pattern.
- Defer form handling, analytics, newsletter, CMS, and external content feeds to future integration seams.
- Use a design-system-oriented component architecture with composable sections and page primitives.
- Enforce performance through hydration-by-exception, asset optimization, and strict third-party script discipline.
- Use Git-based CI/CD to build, publish, and invalidate CDN caches.
- Prefer a CloudFront-first private-origin setup over a casually public bucket configuration.

**Deferred Decisions (Post-MVP):**
- CMS choice, because launch content volume does not justify editorial platform complexity yet.
- Contact form backend, because direct/static contact paths are sufficient unless higher-friction conversion goals emerge.
- Newsletter platform, because subscription operations are not core to the MVP.
- External content ingestion (e.g. Instagram), because it adds reliability and privacy complexity without launch necessity.
- Analytics platform selection beyond privacy-conscious basics, because measurement needs should be earned by actual traffic and iteration goals.

### Data Architecture

**ADR Summary:**
Adopt source-controlled structured content as the system of record, with schema validation at build time and no runtime datastore in the MVP.

**Database Choice:**
No database at launch.

**Decision:**
The site will use source-controlled content files and typed content collections instead of a runtime database. This matches the project’s content-first shape and avoids operational complexity that is not justified by current requirements.

**Data Modeling Approach:**
Use `Astro content collections` as the canonical content model for structured site content such as projects, resume-oriented experience summaries, writing-ready content, and site metadata.

**Data Validation Strategy:**
Use `Zod 4` schemas for collection validation and type inference. This provides schema-enforced content structure, safer refactors, and predictable rendering behavior.

**Migration Approach:**
No database migration strategy is needed at launch. Content evolution will happen through schema versioning and source updates. If a CMS or backend store is introduced later, migration planning can be scoped around the validated collection model.

**Caching Strategy:**
Use static asset fingerprinting from the build pipeline plus `CloudFront` edge caching for published assets and pages. Cache behavior should favor long-lived immutable assets and controlled invalidation for changed HTML/content paths.

**Cross-Functional Implication:**
- Product: content changes remain deliberate and reviewable through Git.
- UX: structured content reduces layout breakage and supports consistent editorial presentation.
- Engineering: the content schema becomes a hard quality gate and a stable integration seam for future CMS adoption.

**Rationale:**
This data architecture minimizes moving parts while preserving future flexibility. It supports clean content ownership, strong validation, and future expansion into richer content types without forcing premature backend investment.

**Affects:**
Homepage content, project entries, resume/experience content, future writing content, deployment workflow.

**Provided by Starter:**
Partially. Astro provides the content-collection foundation; the explicit no-database architecture and schema discipline are project decisions.

### Authentication & Security

**ADR Summary:**
Minimize attack surface by shipping no auth or public API at launch, and harden the static delivery path instead of introducing unnecessary runtime complexity.

**Authentication Method:**
No authentication at launch.

**Authorization Pattern:**
Not applicable at launch because there are no protected user areas or admin-facing runtime workflows in the MVP.

**Security Middleware / Baseline:**
Adopt a static-site security baseline:
- HTTPS-only delivery
- `CloudFront`-based delivery layer
- secure response headers
- conservative `Content-Security-Policy` where practical
- minimal exposure of personal data
- strict review of third-party scripts and embeds
- no client secrets in shipped code
- restricted AWS origin access between `CloudFront` and `S3`

**Data Encryption Approach:**
Rely on AWS-managed transport and storage protections. Use standard encrypted AWS storage defaults where appropriate, but no app-layer encryption design is needed for MVP content because there is no user account or sensitive application data model.

**API Security Strategy:**
No public API exists at launch. If future write endpoints or integration endpoints are introduced, they should use isolated serverless functions with explicit validation, secrets management, spam protection, rate limiting, and narrow IAM permissions.

**Threat Model Notes:**
Primary launch risks are:
- accidental overexposure of personal/contact information
- risky third-party embeds or analytics scripts
- misconfigured S3/CloudFront origin access
- weak header/CSP policy
- future serverless add-ons expanding attack surface without matching controls

**Cross-Functional Implication:**
- Product: trust is preserved by keeping the public surface simple and privacy-conscious.
- UX: security controls must not break core accessibility or degrade essential content access.
- Engineering: origin hardening, secrets discipline, and script governance are more important than auth frameworks at this stage.

**Rationale:**
Security for this project is primarily about trust preservation, privacy restraint, and reducing attack surface. The best security decision at launch is to avoid unnecessary runtime capability entirely.

**Affects:**
Hosting setup, domain/TLS setup, header policy, future integrations, third-party tooling review.

**Provided by Starter:**
No. This is a project-level architecture decision.

### API & Communication Patterns

**ADR Summary:**
Do not create an application API before the product has application behavior that actually requires one.

**API Design Pattern:**
No formal application API at launch.

**Communication Pattern:**
Default to build-time content loading and static rendering. Future external integrations should enter the system through narrow seams such as build-time fetches or small serverless endpoints rather than a broad internal API layer.

**API Documentation Approach:**
No formal API documentation is required at launch. Architecture notes should document future integration boundaries and expected contracts if dynamic services are later introduced.

**Error Handling Standards:**
Use typed content boundaries, explicit optional-field handling, resilient rendering fallbacks, and fail-safe behavior for future external data sources. Build failures are preferable to silently shipping invalid core content.

**Rate Limiting Strategy:**
Not required at launch because there are no public mutation endpoints. Introduce rate limiting only when forms, APIs, or write-capable services are added.

**Service Communication:**
Not applicable at launch because the architecture is not service-oriented. Future serverless additions should remain isolated and independently justified.

**Cross-Functional Implication:**
- Product: avoids speculative platform work.
- UX: preserves page reliability and speed.
- Engineering: makes future dynamic seams easier to reason about because they start isolated.

**Rationale:**
Avoiding an unnecessary API layer preserves clarity and keeps implementation focused on the product’s real value: high-quality public content and presentation.

**Affects:**
Future contact form design, analytics integration, external content ingestion, operational complexity.

**Provided by Starter:**
No. This is a project-level architecture decision.

### Frontend Architecture

**ADR Summary:**
Use Astro’s low-JS foundation to build a polished editorial site through composition, content structure, and selective enhancement instead of client-heavy application patterns.

**State Management Approach:**
Use local component state only. No global client-side state library is needed at launch.

**Component Architecture:**
Use a layered component model:
- design tokens and global theme variables
- low-level UI primitives
- section components for editorial page composition
- content-driven page templates/layouts
- route-level pages

**Routing Strategy:**
Use Astro file-based routing from the starter.

**Performance Optimization Approach:**
Adopt explicit low-JS rules:
- hydrate only when an interaction truly requires it
- prefer server/rendered HTML over client frameworks
- optimize images and responsive media
- keep typography loading disciplined
- minimize layout shift
- treat animation as progressive enhancement

**Bundle Optimization Approach:**
No client framework runtime unless a specific interaction earns it. If islands are introduced later, they should be narrowly scoped, measurable, and removable.

**Cross-Functional Implication:**
- Product: the site itself remains evidence of craft, not just a content container.
- UX: editorial polish, motion restraint, and accessibility are built into the architecture instead of added late.
- Engineering: complexity budgets become a delivery constraint, not an optional aspiration.

**Rationale:**
The frontend architecture must support a high-polish portfolio experience without drifting into SPA-style complexity. Composition, content clarity, and performance discipline matter more than generalized interactivity.

**Affects:**
All page templates, navigation, project presentation, future interactive enhancements, accessibility implementation.

**Provided by Starter:**
Partially. Astro provides routing and the low-JS foundation; the state, component, and performance rules are project decisions.

### Infrastructure & Deployment

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

**Environment Configuration:**
Keep environment configuration minimal. Separate only what is actually needed:
- local development values
- build-time public configuration
- deployment secrets for CI/CD

Do not introduce broad runtime environment complexity unless serverless features are added later.

**Monitoring and Logging:**
Focus on static-site operational signals:
- deployment success/failure notifications
- basic uptime monitoring
- Lighthouse/Core Web Vitals checks
- `CloudFront`/`S3` access visibility as needed

Avoid application-observability platforms unless dynamic behavior justifies them.

**Scaling Strategy:**
Scale primarily through static delivery and CDN caching. This architecture scales well by default for public traffic. Future serverless integrations should scale independently and remain optional.

**Origin Security Implication:**
Prefer a `CloudFront`-first `S3` architecture with restricted origin access rather than treating the bucket as an openly exposed website endpoint. This keeps the deployment aligned with secure static delivery practices and allows stronger control over caching and headers.

**Pre-Mortem Risks:**
This deployment choice is most likely to fail if:
- deployments become manual and drift-prone
- cache invalidation is inconsistent, causing stale content after updates
- the team treats the static stack as "simple" and skips header/origin hardening
- future integrations are bolted on ad hoc, creating split deployment logic
- custom domain, TLS, and redirect behavior are not designed cleanly up front

**Cross-Functional Implication:**
- Product: reliable delivery and quick global loads reinforce credibility.
- UX: fast initial render and predictable behavior support the project’s trust goals.
- Engineering: deployment discipline matters more than platform novelty.

**Rationale:**
`S3 + CloudFront` gives strong AWS alignment, predictable static hosting behavior, low operational overhead, and excellent performance characteristics for a public content-led website.

**Affects:**
Deployment pipeline, DNS/TLS setup, cache behavior, security posture, future integration seams.

**Provided by Starter:**
No. This is an infrastructure architecture decision.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize the Astro project and add Tailwind.
2. Establish TypeScript strictness and content collection schemas.
3. Set up the bounded CI/build/deploy foundation for `S3 + CloudFront` so feature work starts on a repeatable baseline.
4. Define the core content model for profile, projects, and resume-oriented content.
5. Build the design-token and component foundation.
6. Implement page templates and routes using content-driven composition.
7. Add performance, accessibility, metadata, and SEO guardrails.
8. Add only narrowly justified future integrations after the static core is stable.

**Cross-Component Dependencies:**
- The no-database decision depends on disciplined content modeling and schema validation.
- The no-auth and no-API decisions reduce infrastructure and frontend complexity, which reinforces the static-first hosting choice.
- The `S3 + CloudFront` deployment choice reinforces the decision to avoid runtime-heavy features at launch.
- The local-state-only frontend decision depends on preserving hydration discipline and resisting unnecessary client-side feature growth.
- Deferred integrations such as forms, CMS, analytics, or external feeds should preserve the content-collection model as the system’s stable core rather than displacing it.
- Security posture depends on infrastructure decisions being implemented correctly, especially origin restriction, secrets handling, and third-party script governance.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 areas where AI agents could make different choices:
- naming conventions across content schemas, components, assets, and utilities
- project structure boundaries between layouts, sections, primitives, content, and pages
- content/data formatting rules for frontmatter, metadata, and optional values
- communication boundaries for client-side interactivity and future integration seams
- process consistency for validation, fallback behavior, accessibility, metadata, and performance

**Primary Agent Drift Risks:**
The most likely implementation conflicts are not framework-level disagreements, but gradual inconsistency in:
- when to introduce client-side JavaScript
- where reusable section logic ends and route-specific composition begins
- how metadata and content schemas are named across collections
- how optional third-party or remote content is integrated
- whether accessibility and performance requirements are treated as architecture rules or polish tasks

### Naming Patterns

**Database Naming Conventions:**
No database exists at launch, so database naming conventions are not applicable yet.

If a future datastore is introduced, agents should follow:
- plural resource/table names
- `snake_case` only if required by the storage technology
- otherwise align storage models with canonical content/domain naming already established in code
- avoid introducing alternate domain vocabulary that conflicts with content collection terminology

**API Naming Conventions:**
No public API exists at launch.

If future endpoints are introduced:
- use `/api/...` route grouping
- use plural resource naming for collections, e.g. `/api/projects`
- use kebab-case path segments
- use camelCase for JSON fields
- use standard HTTP headers and avoid unnecessary custom header naming schemes
- name endpoints by resource or action outcome, not implementation verbs unless the endpoint is action-like by nature

Examples:
- good: `/api/projects`
- good: `/api/contact-submissions`
- acceptable later if needed: `/api/newsletter-subscribe`
- avoid: `/api/Project`
- avoid: `/api/getProjects`

**Code Naming Conventions:**
- reusable component files: `PascalCase`, e.g. `ProjectCard.astro`
- layout files: `PascalCase`, e.g. `MainLayout.astro`
- page route files: follow Astro route conventions, e.g. `index.astro`, `projects/[slug].astro`
- directories: `kebab-case`
- utility files: `kebab-case`, e.g. `format-date.ts`
- functions and variables: `camelCase`
- TypeScript types, interfaces, and schema objects: `PascalCase`
- content fields/frontmatter keys: `camelCase`
- collection names: plural lowercase names, e.g. `projects`, `posts`
- public asset names: `kebab-case`
- constants: `UPPER_SNAKE_CASE` only for true exported constants or environment-derived constants

Examples:
- good: `src/components/ProjectCard.astro`
- good: `src/utils/format-date.ts`
- good: `publishDate`, `seoTitle`, `featuredProject`
- avoid: `project_card.astro`, `Format_Date.ts`, `featured_project`

### Structure Patterns

**Project Organization:**
Use a layered structure that separates concerns clearly:
- `src/pages/` for route entries only
- `src/layouts/` for page shells and shared layout scaffolding
- `src/components/` for reusable UI building blocks
- `src/components/sections/` for larger editorial page sections
- `src/content/` for content collections and content entries
- `src/utils/` for pure helpers/formatters
- `src/styles/` for global styles, tokens, and Tailwind-connected styling layers if needed
- `public/` for static passthrough assets
- tests co-located with the file they validate whenever practical

Rules:
- route files should compose content and components, not contain large reusable UI blocks
- reusable primitives should not depend on route-specific assumptions
- sections may depend on page composition needs, but should remain reusable when sensible
- schema definitions must have a single canonical home
- if a component is reused across multiple routes or sections, promote it out of route-local code into the shared component structure
- avoid creating parallel folder taxonomies that express the same concept differently

**File Structure Patterns:**
- one primary responsibility per file
- avoid deeply nested component hierarchies without clear reuse value
- place content collection definitions in the canonical Astro content config location
- keep project documentation in docs-style locations only if it is actively maintained; otherwise prefer architecture/planning artifacts already defined by the workflow
- environment-specific files should stay minimal and clearly named
- route-local helper logic should stay close to the route unless it becomes clearly reusable
- do not duplicate formatting, metadata, or schema helpers across folders

Examples:
- good: `src/components/ProjectCard.astro`
- good: `src/components/sections/HeroSection.astro`
- good: `src/content/config.ts`
- avoid: page-specific helper logic scattered across unrelated folders
- avoid: duplicate schema declarations in multiple locations

### Format Patterns

**API Response Formats:**
No application API response format is required at launch.

If future endpoints are added:
- default to direct, minimal JSON responses
- use a consistent error object when needed
- avoid wrapping every response in speculative envelope objects unless integration complexity proves the need
- document the response shape at the endpoint boundary when the endpoint is introduced

Preferred future pattern:
- success: `{ success: true, data: ... }` only when a wrapper is justified
- error: `{ success: false, error: { code, message } }`

**Data Exchange Formats:**
- content/frontmatter fields use `camelCase`
- dates stored as ISO-friendly strings, preferably `YYYY-MM-DD` for authored content
- booleans use true/false only
- arrays remain arrays even for one item; do not collapse shape dynamically
- optional fields should be omitted when absent unless `null` has explicit semantic meaning
- metadata objects should use stable field names across all page types
- canonical content concepts should keep the same field names everywhere unless a schema difference is intentional and documented

Examples:
- good: `publishDate: 2026-03-09`
- good: `featured: true`
- good: `socialLinks: []`
- avoid: mixing `publish_date`, `publishDate`, and `publishedAt` for the same concept
- avoid: using `0/1` for boolean semantics

### Communication Patterns

**Event System Patterns:**
No event bus or cross-app event system exists at launch.

If interactive islands are introduced:
- prefer local component callbacks/state over global event patterns
- name custom events in lowercase, domain-specific terms only when unavoidable
- keep event payloads minimal and typed
- do not introduce event-driven cross-page coordination without explicit architectural justification
- prefer removing an event abstraction entirely if a simple local prop/state pattern is sufficient

**State Management Patterns:**
- default to no client state unless interaction requires it
- use local component state only
- no global state library at launch
- interactive islands must be narrowly scoped and measurable
- state names should be descriptive and camelCase, e.g. `isOpen`, `activeIndex`, `hasSubmitted`
- derived state should be computed, not duplicated, where practical
- hydration is opt-in by exception, not a convenience default

**Interactive Island Rule:**
Any new island should justify itself by one of these:
- user input that cannot be handled acceptably without client runtime
- clearly bounded interaction state
- measurable user experience value

If a feature can be delivered as static HTML/CSS with acceptable UX, agents should keep it static.

Examples:
- good: isolated menu toggle state inside a navigation component
- good: local gallery overlay state inside a single interactive island
- avoid: app-wide client store for mostly static pages
- avoid: hydrating entire page regions for one small interaction

### Process Patterns

**Error Handling Patterns:**
- invalid core content must fail the build
- optional or external content should degrade gracefully without breaking the page
- distinguish authoring/configuration errors from visitor-facing experience issues
- user-facing errors should be plain-language and minimal
- logging should support diagnosis without leaking secrets or noisy implementation detail
- future serverless integrations must validate inputs at the boundary
- build-time failures are preferred for invalid required content, schema mismatches, and metadata contract violations

Examples:
- good: fail build on invalid required project schema
- good: omit an optional social feed section if remote content is unavailable
- avoid: silently shipping malformed required content
- avoid: exposing raw system errors in the UI

**Loading State Patterns:**
- no loading UI unless there is actual asynchronous behavior
- static content should render fully without faux loading skeletons
- if future async islands exist, loading state should stay local to that feature
- loading state names should use clear boolean conventions such as `isLoading`
- loading experiences must preserve accessibility and avoid layout instability
- do not invent placeholder loading for design effect on static pages

Examples:
- good: no spinner for statically available page content
- good: localized loading indicator for a future newsletter form submission
- avoid: generic page-wide loading overlays on static routes

**Accessibility / Metadata / Performance Guardrail Pattern:**
These are not optional review items. Every page and reusable section should be implemented with:
- semantic structure first
- accessible names and keyboard behavior where interactive
- stable metadata conventions
- performance-aware media and typography decisions
- motion treated as additive, not required for comprehension

Agents should treat these as definition-of-done constraints, not enhancement backlog items.

### Enforcement Guidelines

**All AI Agents MUST:**
- follow the naming conventions exactly, especially `camelCase` fields, `PascalCase` reusable component files, and `kebab-case` utility/asset naming
- preserve the static-first architecture by treating client-side JavaScript and future endpoints as exceptions, not defaults
- keep content schemas, metadata structure, accessibility requirements, and performance guardrails consistent across every page and component
- avoid introducing new structural patterns when an existing folder, naming rule, or component layer already solves the problem

**Pattern Enforcement:**
- verify patterns during code review and story review against this architecture document
- treat deviations as architecture issues, not stylistic preferences
- document any justified exceptions directly in the relevant story or technical notes
- update patterns only when a repeated need or proven conflict justifies changing the shared rule
- when in doubt, prefer the simpler pattern that preserves static-first delivery and existing structure

### Pattern Examples

**Good Examples:**
- `src/components/ProjectCard.astro`
- `src/components/sections/FeaturedProjectsSection.astro`
- `src/content/config.ts`
- `src/content/projects/my-project.md`
- `src/utils/format-date.ts`
- frontmatter with fields like `title`, `publishDate`, `seoDescription`, `featured`
- local interactive state like `const isOpen = ...` inside a narrowly scoped island
- failing build for invalid required content rather than shipping fallback guesses

**Anti-Patterns:**
- mixing `snake_case` and `camelCase` for the same content domain
- naming reusable components in kebab-case while types use unrelated conventions
- placing route-specific page sections into generic primitive folders
- introducing client-wide state or hydration for mostly static pages
- allowing optional third-party integrations to dictate core page rendering structure
- duplicating schema logic or metadata conventions across multiple files without a single source of truth
- adding loading skeletons or client effects to static content for visual theater alone

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
personal-website/
├── README.md
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
├── .gitignore
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   └── development.md
├── infrastructure/
│   ├── README.md
│   └── cloudfront/
│       └── cache-policy-notes.md
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── resume/
│   │   └── chris-resume.pdf
│   ├── images/
│   │   ├── og/
│   │   │   ├── default-og.jpg
│   │   │   └── projects/
│   │   └── projects/
│   └── icons/
├── src/
│   ├── env.d.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── resume.astro
│   │   ├── contact.astro
│   │   ├── posts/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── api/
│   │   │   └── .gitkeep
│   │   └── 404.astro
│   ├── layouts/
│   │   ├── MainLayout.astro
│   │   ├── ContentLayout.astro
│   │   └── ProjectLayout.astro
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Container.astro
│   │   │   ├── SectionHeading.astro
│   │   │   ├── RichText.astro
│   │   │   ├── TagList.astro
│   │   │   ├── ThemeImage.astro
│   │   │   └── VisuallyHidden.astro
│   │   ├── navigation/
│   │   │   ├── SiteHeader.astro
│   │   │   ├── SiteNav.astro
│   │   │   ├── MobileMenu.astro
│   │   │   └── SiteFooter.astro
│   │   ├── seo/
│   │   │   ├── BaseHead.astro
│   │   │   ├── OpenGraphTags.astro
│   │   │   └── StructuredData.astro
│   │   └── sections/
│   │       ├── HeroSection.astro
│   │       ├── FeaturedProjectsSection.astro
│   │       ├── ProjectGridSection.astro
│   │       ├── ResumeSummarySection.astro
│   │       ├── ContactSection.astro
│   │       ├── WritingPreviewSection.astro
│   │       └── SocialProofSection.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── pages/
│   │   │   ├── home.md
│   │   │   ├── contact.md
│   │   │   └── resume.md
│   │   ├── projects/
│   │   │   └── my-project.md
│   │   ├── resume/
│   │   │   ├── profile.md
│   │   │   ├── experience/
│   │   │   │   └── role-example.md
│   │   │   ├── skills/
│   │   │   │   └── core-skills.md
│   │   │   └── education/
│   │   │       └── education-entry.md
│   │   └── posts/
│   │       └── hello-world.md
│   ├── config/
│   │   ├── site.ts
│   │   ├── navigation.ts
│   │   └── social-links.ts
│   ├── data/
│   │   └── external-sources.ts
│   ├── lib/
│   │   ├── content/
│   │   │   ├── get-projects.ts
│   │   │   ├── get-posts.ts
│   │   │   ├── get-resume.ts
│   │   │   └── get-pages.ts
│   │   ├── seo/
│   │   │   ├── build-meta.ts
│   │   │   └── build-structured-data.ts
│   │   └── integrations/
│   │       ├── analytics/
│   │       │   └── noop-analytics.ts
│   │       ├── social/
│   │       │   └── get-instagram-feed.ts
│   │       └── newsletter/
│   │           └── subscribe.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css
│   │   └── prose.css
│   ├── utils/
│   │   ├── format-date.ts
│   │   ├── slugify.ts
│   │   ├── class-names.ts
│   │   └── env.ts
│   └── types/
│       ├── content.ts
│       └── global.ts
├── tests/
│   └── e2e/
│       ├── smoke.spec.ts
│       └── accessibility.spec.ts
└── dist/
```

### Architectural Boundaries

**Structure ADR Summary:**
Use a route-thin, content-centered Astro project structure where authored content is the system of record, reusable UI is layered by abstraction, and future dynamic seams are explicitly isolated so they cannot silently reshape the static-first core.

**API Boundaries:**
- No public application API exists at launch.
- Future dynamic endpoints, if introduced, should live under Astro API routes using `src/pages/api/`.
- The `src/pages/api/` directory is reserved but intentionally empty at launch to signal that dynamic behavior is optional, not foundational.
- Contact submission, newsletter signup, or external-content refresh logic must remain optional seams and should not become required for page rendering.
- No auth boundary exists at launch; if introduced later, it should be isolated from the public content-rendering path.

**Component Boundaries:**
- `src/pages/` owns route composition only.
- `src/layouts/` owns page shells, shared document structure, and route-level layout concerns.
- `src/components/ui/` owns low-level reusable presentation primitives.
- `src/components/sections/` owns larger editorial building blocks used by pages/layouts.
- `src/components/navigation/` owns sitewide navigation and footer interactions.
- `src/components/seo/` owns metadata and structured-data rendering helpers.
- Reusable components must not depend on route-specific content loading details.
- Route files may import section components and content-loading helpers, but should not become the primary location for reusable UI logic.
- If a section starts accumulating reusable subparts, those subparts should move downward into `ui/` or another stable shared layer rather than expanding route complexity.

**Service Boundaries:**
- `src/lib/content/` is the canonical read layer for content collections.
- `src/lib/seo/` is the canonical metadata-building layer.
- `src/lib/integrations/` contains optional external-service seams and must not be required for core route success.
- `src/config/` holds stable site configuration, not runtime business logic.
- `src/utils/` contains pure helpers with no hidden framework or network side effects.
- `src/data/` is intentionally narrow and should not become a parallel content system.

**Data Boundaries:**
- `src/content/` is the system of record for authored content.
- `src/content/config.ts` is the single schema-definition boundary.
- `public/` holds static passthrough assets, including the downloadable resume PDF and social/OG media.
- `src/data/` is reserved for small structured constants or source maps that do not fit content collections.
- Remote/external data must be treated as optional and must flow through explicit integration helpers rather than appearing directly inside page components.
- If future CMS adoption occurs, it should map into the existing `src/content/` domain model rather than inventing a second canonical structure.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- Identity and professional positioning
  - Routes: `src/pages/index.astro`
  - Content: `src/content/pages/home.md`, `src/content/resume/profile.md`
  - Sections: `src/components/sections/HeroSection.astro`, `src/components/sections/SocialProofSection.astro`
  - Config: `src/config/site.ts`, `src/config/social-links.ts`

- Project discovery and proof of work
  - Routes: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`
  - Content: `src/content/projects/`
  - Layouts: `src/layouts/ProjectLayout.astro`
  - Sections: `src/components/sections/FeaturedProjectsSection.astro`, `src/components/sections/ProjectGridSection.astro`
  - Content access: `src/lib/content/get-projects.ts`

- Resume and evaluator support
  - Route: `src/pages/resume.astro`
  - Content: `src/content/resume/`
  - Asset: `public/resume/chris-resume.pdf`
  - Sections: `src/components/sections/ResumeSummarySection.astro`
  - Content access: `src/lib/content/get-resume.ts`

- Contact and conversion
  - Route: `src/pages/contact.astro`
  - Content: `src/content/pages/contact.md`
  - Sections: `src/components/sections/ContactSection.astro`
  - Future seam: `src/pages/api/contact-submissions.ts` if introduced later

- Discoverability and SEO
  - Components: `src/components/seo/`
  - Config: `src/config/site.ts`
  - Helpers: `src/lib/seo/`
  - Assets: `public/robots.txt`, `public/images/og/`

- Future writing/publishing
  - Routes: `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`
  - Content: `src/content/posts/`
  - Sections: `src/components/sections/WritingPreviewSection.astro`
  - Content access: `src/lib/content/get-posts.ts`

**Cross-Cutting Concerns:**
- Accessibility
  - Shared UI: `src/components/ui/`
  - Navigation: `src/components/navigation/`
  - E2E validation: `tests/e2e/accessibility.spec.ts`

- Performance and rendering discipline
  - Layouts: `src/layouts/`
  - SEO/media helpers: `src/lib/seo/`
  - Styles/tokens: `src/styles/`
  - Build/deploy: `.github/workflows/`, `infrastructure/`

- Content schema integrity
  - Schema boundary: `src/content/config.ts`
  - Types: `src/types/content.ts`
  - Content access layer: `src/lib/content/`

- Privacy-conscious optional integrations
  - Seams only: `src/lib/integrations/`
  - Future runtime boundary: `src/pages/api/`
  - Deployment/config support: `infrastructure/`, `.env.example`

### Integration Points

**Internal Communication:**
- Route files call content helpers from `src/lib/content/`.
- Layouts receive normalized page metadata/content props from routes.
- Section components receive already-shaped data via props and should avoid direct external fetching.
- SEO components consume structured metadata generated by `src/lib/seo/`.
- Utilities provide formatting and shared transformations but should not own domain loading logic.
- Content schema, type definitions, and content helpers must evolve together; agents should not change one layer without reconciling the others.

**External Integrations:**
- Analytics integration seam: `src/lib/integrations/analytics/`
- Social/external feed seam: `src/lib/integrations/social/`
- Newsletter seam: `src/lib/integrations/newsletter/`
- Future form/serverless seam: `src/pages/api/` if activated later
- AWS deployment integration: `.github/workflows/` and `infrastructure/`

**Data Flow:**
- Authored content enters through `src/content/`.
- Content schemas validate through `src/content/config.ts`.
- Content access helpers normalize collection data in `src/lib/content/`.
- Routes assemble page-specific data needs.
- Layouts and sections render the final UI.
- Static assets are served from `public/`.
- Optional external data flows through `src/lib/integrations/` and must never be required for core page success.
- Deployment outputs compiled static artifacts into `dist/`, which is a build artifact and not a source-owned directory.

### File Organization Patterns

**Configuration Files:**
- Root config files define framework, TypeScript, package, and CI/CD behavior.
- Site-level runtime-safe config belongs in `src/config/`.
- Environment examples live at the root and should stay minimal.
- Deployment-specific notes/scripts live in `infrastructure/`.
- `docs/` should only contain actively maintained developer-facing material, not duplicate architecture truth already held elsewhere.

**Source Organization:**
- `src/pages/` for route entries
- `src/layouts/` for shared shells
- `src/components/` for UI, navigation, SEO, and sections
- `src/content/` for authored content
- `src/lib/` for domain read helpers and integration boundaries
- `src/utils/` for pure utilities
- `src/styles/` for global styling layers
- `src/types/` for shared typing surfaces

**Test Organization:**
- Co-locate unit-like tests when component logic justifies them.
- Keep cross-route/browser-level tests in `tests/e2e/`.
- Use E2E coverage for smoke, accessibility, and critical-path regression, not exhaustive app-style flows.
- Do not create parallel testing hierarchies unless test volume proves the need.

**Asset Organization:**
- `public/resume/` for downloadable resume assets
- `public/images/og/` for share metadata images
- `public/images/projects/` for project media that should remain directly addressable
- `public/icons/` for small static icon assets
- Use framework-aware asset handling outside `public/` only when optimization benefits justify it

### Development Workflow Integration

**Development Server Structure:**
- `astro dev` serves route files from `src/pages/` with content loaded from `src/content/`.
- Layouts, sections, and UI primitives enable isolated visual iteration without changing routing structure.
- Optional integrations should be implemented so local development still works if external credentials are absent.
- Empty or placeholder future seams must not force local runtime requirements before they are actually used.

**Build Process Structure:**
- `astro build` validates content collections, generates static routes, emits optimized assets, and writes output to `dist/`.
- Build integrity depends on `src/content/config.ts`, content loader helpers, and metadata generation remaining consistent.
- Core content validation failures should stop the build.
- Optional integrations must fail safely or be stubbed so they do not block static artifact generation unless explicitly promoted to required behavior.

**Deployment Structure:**
- CI builds from the root project configuration.
- Deployment publishes `dist/` to S3 and triggers CloudFront invalidation.
- Infrastructure-specific deployment notes and scripts belong in `infrastructure/`.
- The structure supports static-first deployment without requiring runtime application servers.

### Project Structure Failure Risks

A pre-mortem view suggests this structure would fail if:
- agents treat placeholder future seams as mandatory launch features
- `src/data/` grows into a shadow content system separate from `src/content/`
- route files accumulate too much rendering or transformation logic
- integration helpers begin to shape core page contracts instead of remaining optional
- docs, infrastructure notes, and config become duplicated across multiple "source of truth" locations
- the reserved `posts/` and `api/` boundaries are used to justify unnecessary launch scope growth

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The chosen architecture is coherent and internally compatible. `Astro 5`, `TypeScript`, `Tailwind 4`, `Astro content collections`, `Zod 4`, and `Amazon S3 + CloudFront` form a consistent static-first stack with no major technology conflicts. The decision to avoid a database, auth, and a public API at launch aligns with the actual product scope and reduces contradiction across the architecture.

The future-ready seams for posts, integrations, and API routes do not currently conflict with the static-first strategy because they are explicitly documented as optional and non-foundational. This is an important coherence point: the architecture preserves expansion paths without requiring present-tense complexity.

**Pattern Consistency:**
The implementation patterns support the architectural decisions well. Naming conventions align with the chosen stack, project structure patterns reinforce route-thin composition, and process rules support content validation, progressive enhancement, and performance discipline.

The strongest consistency result is that the architecture repeatedly reinforces the same principles across sections:
- content as the system of record
- static-first rendering by default
- local state only unless interaction earns more
- optional integrations isolated from the core path
- accessibility, metadata, and performance treated as definition-of-done concerns

**Structure Alignment:**
The project structure directly supports the chosen architecture. `src/content/` supports the no-database decision, `src/lib/content/` and `src/lib/seo/` support normalized content and metadata handling, and `src/components/` is layered in a way that matches the implementation patterns.

The reserved `src/pages/api/`, `src/lib/integrations/`, and `infrastructure/` boundaries are aligned with future extension needs while remaining clearly outside the launch-critical path. This is structurally coherent with the architecture’s restraint-first philosophy.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
Although the project is organized around requirement categories rather than formal epics, every major product area has architectural support:
- identity and professional positioning through home-page content, profile content, and hero/social-proof sections
- project discovery and proof of work through project routes, layouts, and structured content collections
- resume/evaluator support through structured resume content and a downloadable PDF asset
- contact/conversion through a contact route and future optional form seam
- discoverability through dedicated SEO components, metadata helpers, OG assets, and crawlability-friendly static routing
- future writing/publishing through a reserved posts collection and route structure

Cross-cutting needs such as accessibility, performance, privacy, and maintainability are also mapped into shared components, styles, content schemas, and deployment boundaries.

**Functional Requirements Coverage:**
All identified functional requirement categories are architecturally supported. The architecture provides clear homes for public pages, structured project content, resume access, contact pathways, discoverability assets, and owner-controlled updates.

There are no obvious functional gaps that would block implementation of the documented MVP. The only intentionally deferred capabilities are optional service-backed features such as CMS editing, newsletter operations, richer analytics, and external content ingestion. Those are deferred by design rather than omitted accidentally.

**Non-Functional Requirements Coverage:**
The architecture addresses the project’s major NFRs in a direct way:
- performance through static-first rendering, limited hydration, asset discipline, and CDN delivery
- accessibility through explicit process patterns, semantic structure expectations, and E2E validation boundaries
- security/privacy through reduced attack surface, S3/CloudFront hardening, minimal third-party dependency posture, and no unnecessary runtime services
- maintainability through typed schemas, canonical content boundaries, explicit project structure, and implementation rules for AI agents
- SEO/discoverability through crawlable static routes, metadata helpers, OG assets, and structured-data boundaries

Scalability is appropriately handled for the current product scope through CDN-based static delivery. The architecture does not overclaim application-scale elasticity where it is not needed.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical architectural decisions are sufficiently documented for implementation to begin. The selected starter, deployment shape, content model, interaction model, and security baseline are all clear. The architecture also distinguishes launch-critical decisions from intentionally deferred ones, which reduces the risk of agents inventing scope.

One implementation nuance remains: service selection for optional integrations is intentionally left open. This is acceptable because those capabilities are not launch blockers and the architecture already defines where they belong.

**Structure Completeness:**
The project structure is concrete and specific enough to guide AI agents. It defines real root files, route files, content collections, component layers, config locations, deployment locations, and test locations rather than generic placeholders.

The boundaries between pages, layouts, sections, UI primitives, content schemas, and integration seams are clear enough to prevent most structural drift during implementation.

**Pattern Completeness:**
The implementation patterns are strong and actionable. They cover naming, structure, data formatting, optional integration behavior, client-state limits, loading/error rules, and cross-cutting definition-of-done expectations.

Most high-risk AI-agent conflict points are addressed. In particular, the architecture gives clear guidance on:
- when to keep features static
- where reusable logic belongs
- how content and metadata should be named and validated
- how optional external behavior should fail safely

### Gap Analysis Results

**Critical Gaps:**
- None identified that block implementation.

**Important Gaps:**
- Exact Tailwind-to-design-token implementation strategy is not fully specified yet. The architecture defines the boundary (`src/styles/`, tokens, reusable primitives), but implementation should establish a single clear token system early.
- CloudFront cache invalidation scope, response-header policy details, and custom-domain/TLS setup are not fully elaborated. These are implementation-phase infrastructure details rather than architectural blockers.
- Optional integrations are structurally defined but service choices remain open. This is acceptable, but agents should not treat placeholders as implied commitments.

**Nice-to-Have Gaps:**
- Additional contributor/developer documentation for local setup and deployment workflow could help future implementation agents.
- A lightweight decision log for future deviations from the static-first baseline would improve long-term governance.
- Concrete examples of metadata payloads and content schemas could further accelerate implementation consistency.

### Validation Issues Addressed

No blocking validation issues were found.

The main concerns identified are all non-blocking and already bounded by the architecture:
- future-ready directories (`posts`, `api`, `integrations`) could encourage premature scope expansion if not governed carefully
- deployment details for caching, headers, and domain setup will require disciplined implementation
- optional integrations should remain optional until promoted by a future requirement

These concerns are already addressed by the documented architectural principles of restraint, isolation, and static-first delivery.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** high based on validation results

**Key Strengths:**
- Strong alignment between product scope and architecture restraint
- Clear static-first implementation model with future extension seams
- Explicit consistency rules that reduce AI agent drift
- Well-mapped content architecture for projects, resume, pages, and future writing
- AWS deployment strategy that fits the product without overbuilding

**Areas for Future Enhancement:**
- Formalize design-token usage and Tailwind layering during initial implementation
- Add concrete deployment notes for cache/header/domain setup
- Add service-specific decisions only when optional integrations become real scope
- Introduce governance for future exceptions to the static-first baseline if the product evolves

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
Initialize the project using the selected starter path:

```bash
npm create astro@latest personal-website -- --template minimal --install --git
cd personal-website
npx astro add tailwind
```
