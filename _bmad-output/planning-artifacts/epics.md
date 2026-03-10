---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - _bmad-output/planning-artifacts/research/technical-astro-content-architecture-for-a-personal-website-research-2026-03-09.md
---

# personal-website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for personal-website, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can understand who Chris is from the site.
FR2: Visitors can understand Chris's professional role and focus from the site.
FR3: Visitors can access a professional introduction that presents Chris clearly and credibly.
FR4: Visitors can access a professional introduction that presents Chris's background, role, and relevance.
FR5: Visitors can view profile information that presents Chris as an identifiable individual rather than an anonymous profile.
FR6: Hiring audiences can identify Chris's professional relevance without relying only on project content.
FR7: Non-technical visitors can understand Chris's background and work without requiring insider knowledge.
FR8: Visitors can access a projects collection from the site.
FR9: Visitors can review project entries that describe what Chris has built.
FR10: Project content can communicate enough substance to support evaluation of Chris's technical capability.
FR11: Technical evaluators can use project content together with the site experience as evidence of Chris's craft.
FR12: The product can support richer project storytelling in future phases without changing its core purpose.
FR13: Visitors can access Chris's resume from the site.
FR14: Hiring audiences can use the site to evaluate Chris before initiating direct outreach.
FR15: Hiring audiences can move from profile understanding to project review to resume access within one visit.
FR16: Visitors can use the site to evaluate Chris through profile, project, and resume content in one place.
FR17: Visitors can find a clear way to contact Chris.
FR18: Hiring audiences can identify the next step for outreach or continued evaluation.
FR19: Visitors can complete the core professional evaluation path without confusion about how to follow up.
FR20: The site can support professional outreach without requiring advanced communication features at launch.
FR21: Visitors can use the site effectively on supported desktop browsers.
FR22: Visitors can use the site effectively on supported mobile browsers.
FR23: Visitors can complete core tasks while skimming or under time pressure.
FR24: Visitors can access core content and next steps without depending on desktop-only interaction patterns.
FR25: The site can preserve the core trust and evaluation path across supported browsers.
FR26: Search engines can discover and index the site's primary public content.
FR27: The site can support name-based discovery of Chris and his professional identity.
FR28: The site can support discoverability of project content.
FR29: The site can support future discoverability of writing or case-study content.
FR30: Public content can communicate meaning clearly to search engines through structured page content.
FR31: Visitors can access and use the site's core content and navigation with accessibility support aligned to the launch standard.
FR32: Keyboard users can navigate and use core site interactions.
FR33: Visitors using assistive technologies can access meaningful content structure and interactive elements.
FR34: Non-technical visitors can understand the site's core content without depending on technical jargon.
FR35: The site can support explicit accessibility evaluation against a defined launch standard.
FR36: Chris can update core profile content over time.
FR37: Chris can update resume access over time.
FR38: Chris can add, revise, or remove project content over time.
FR39: Chris can maintain the site as a long-term owned professional asset.
FR40: The site can evolve into future phases without redefining the product concept.
FR41: The product can remain maintainable enough for Chris to preserve quality over time.
FR42: The site can communicate that it is a distinct professional website rather than a generic profile or template page.
FR43: Visitors can access professional information about Chris that is maintained and presented as current.
FR44: The product can minimize dependence on unnecessary third-party systems for its core value.
FR45: The site can support privacy-conscious handling of contact pathways and personal information exposure.
FR46: The product can keep core trust signals visible and understandable as the site evolves.

### NonFunctional Requirements

NFR1: Primary public pages must render and become usable within 3 seconds on a normal mobile network connection, measured with Lighthouse or an equivalent tool against production builds.
NFR2: Core browsing interactions on primary public pages must respond within 100 milliseconds under normal usage conditions, measured in production-equivalent browser testing.
NFR3: Visual polish, motion, and client-side behavior must not materially reduce readability, responsiveness, or perceived speed.
NFR4: The site must minimize unnecessary client-side complexity that slows initial load or basic navigation.
NFR5: All public pages and assets must be served over secure transport.
NFR6: Public contact pathways must expose no more than one direct email address and any intentionally chosen public profile links needed for legitimate outreach.
NFR7: The MVP must not collect or store sensitive visitor data unless a launch feature explicitly requires it.
NFR8: Third-party services must be used conservatively so they do not materially weaken privacy, trust, or long-term ownership.
NFR9: The public site must maintain at least 99.5% monthly availability, measured by hosting or monitoring reports.
NFR10: Resume access, project links, and other core trust assets must remain current and reachable.
NFR11: Failure of a non-core external dependency must not make the core site unusable.
NFR12: Routine content updates must not break core public browsing paths.
NFR13: The launch site must meet WCAG 2.2 AA as the target accessibility standard.
NFR14: Core navigation and content must be usable by keyboard-only visitors.
NFR15: Page structure, text alternatives, focus visibility, and contrast must support practical assistive-technology use.
NFR16: Accessibility quality must be preserved across supported desktop and mobile browsing contexts.
NFR17: The site must support at least 10x its baseline personal-site traffic during moderate visibility spikes without breaking core browsing paths, verified through hosting capacity expectations or load testing.
NFR18: The content and page structure must support growth in projects and future publishing without requiring a redesign of the product concept.
NFR19: Future additions such as analytics, CMS capabilities, or richer content sections must be introducible without materially compromising core performance or maintainability.

### Additional Requirements

- Use a greenfield, static-first, content-first web architecture with no database, no authentication, no public application API, and no global client state at launch.
- Use Astro with file-based routing, Astro content collections, and Zod-validated schemas as the canonical content model.
- Treat build-time content loading as the default communication pattern; future dynamic capabilities must be isolated, narrow seams.
- Structure the implementation around reusable design tokens, UI primitives, section components, content-driven layouts, and thin route files.
- Deploy production via Amazon S3 plus Amazon CloudFront with restricted origin access, HTTPS-only delivery, secure headers, cache invalidation, and Git-based CI/CD.
- Enforce hydration-by-exception, optimized images and typography, minimal non-essential JavaScript, stable layout, and progressive enhancement.
- Keep authored content in source control and make content/schema validation a build gate.
- Reserve future seams for CMS, analytics, newsletter, external feeds, and contact form backends without making them launch dependencies.
- Support latest stable Chrome, Safari, Firefox, and Edge on desktop, plus modern Chrome and Safari-class mobile browsers.
- Use a mobile-first responsive strategy with meaningful breakpoints around 320-767px, 768-1023px, and 1024px+.
- Preserve immediate first-screen identity clarity, obvious access to Projects, Resume, and contact pathways across all viewport sizes, while keeping future writing discoverability out of launch navigation scope.
- Implement an Editorial Hero visual direction with strong serif-led headline, concise supporting copy, trust tags, and an upper-right portrait treatment.
- Use a warm restrained palette based on #FFF4EA, #EDDCC6, #BF4646, and #7EACB5 through semantic design tokens.
- Use an editorial typography pairing: refined serif or serif-leaning display face for headings and clean sans-serif for body and UI text.
- Maintain stable, trustworthy navigation with direct labels, dependable browser behavior, and mobile patterns that do not obscure content.
- Avoid intrusive popups, cookie harassment, newsletter traps, attention-hijacking interactions, and decorative behavior that competes with content.
- Keep controls physically stable; motion may enhance pacing or emphasis but must never displace targets or be required for comprehension.
- Respect reduced-motion preferences and ensure motion remains lightweight, optional, and non-essential.
- Ensure keyboard accessibility, visible focus states, semantic landmarks, meaningful heading structure, descriptive links, proper labels, and touch targets of at least 44x44px.
- If implemented, the optional profile image expansion must support escape dismissal, focus management, obvious close controls, and clean return to the invoking element.
- Favor inline, calm feedback patterns and minimal, transparent forms with local validation and plain-language recovery messaging.
- Preserve privacy-conscious operation with minimal personal-data exposure and conservative use of third-party scripts or services.

### FR Coverage Map

FR1: Epic 1 - identity clarity
FR2: Epic 1 - professional role clarity
FR3: Epic 1 - professional introduction
FR4: Epic 1 - background and relevance framing
FR5: Epic 1 - identifiable personal profile
FR6: Epic 1 - professional relevance at a glance
FR7: Epic 1 - non-technical clarity
FR8: Epic 2 - access to projects collection
FR9: Epic 2 - review project entries
FR10: Epic 2 - project substance for evaluation
FR11: Epic 2 - project content plus site as proof of craft
FR12: Epic 2 - future richer project storytelling
FR13: Epic 3 - resume access
FR14: Epic 3 - pre-outreach evaluation support
FR15: Epic 3 - profile to project to resume path
FR16: Epic 2 - unified profile/project/resume evaluation surface
FR17: Epic 3 - clear contact path
FR18: Epic 3 - obvious next step for outreach
FR19: Epic 3 - complete evaluation path without confusion
FR20: Epic 3 - simple launch-ready outreach support
FR21: Epic 1 - desktop usability
FR22: Epic 1 - mobile usability
FR23: Epic 1 - skimmable/time-pressure use
FR24: Epic 1 - no desktop-only dependency
FR25: Epic 1 - cross-browser trust path
FR26: Epic 4 - indexable primary content
FR27: Epic 4 - name-based discovery
FR28: Epic 2 - project discoverability
FR29: Epic 4 - future writing/case-study discoverability
FR30: Epic 4 - search-engine-readable structure
FR31: Epic 1 - accessibility-aligned core use
FR32: Epic 1 - keyboard navigation
FR33: Epic 1 - assistive-tech-friendly structure
FR34: Epic 1 - low-jargon comprehension
FR35: Epic 1 - explicit accessibility evaluation support
FR36: Epic 4 - update profile content
FR37: Epic 4 - update resume access
FR38: Epic 4 - update project content
FR39: Epic 4 - maintain long-term owned asset
FR40: Epic 4 - evolve into future phases
FR41: Epic 4 - maintainability over time
FR42: Epic 1 - distinct non-template professional presence
FR43: Epic 4 - current, trustworthy professional information over time
FR44: Epic 4 - minimal unnecessary third-party dependence
FR45: Epic 4 - privacy-conscious contact/info handling
FR46: Epic 1 - trust signals remain visible and understandable

## Epic List

### Epic 1: First-Visit Trust and Identity
Visitors can land on the site, immediately understand who Chris is, what he does, and where to go next on any supported device.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR21, FR22, FR23, FR24, FR25, FR31, FR32, FR33, FR34, FR35, FR42, FR46

### Epic 2: Project Proof and Technical Credibility
Visitors can browse a credible project collection and use project content as evidence of Chris's technical ability, judgment, and craft.
**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR16, FR28

### Epic 3: Resume Access and Contact Conversion
Hiring audiences can complete the core evaluation path, access the resume, and take the next step to contact Chris without friction.
**FRs covered:** FR13, FR14, FR15, FR17, FR18, FR19, FR20

### Epic 4: Discoverability and Sustainable Ownership
Search engines can discover the site, Chris can keep professional information current, and the product can evolve as a long-term owned asset without losing quality or privacy.
**FRs covered:** FR26, FR27, FR29, FR30, FR36, FR37, FR38, FR39, FR40, FR41, FR43, FR44, FR45

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: First-Visit Trust and Identity

Visitors can land on the site, immediately understand who Chris is, what he does, and where to go next on any supported device.

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story 1.1: Set Up Initial Project from Starter Template

As Chris,
I want the project initialized from the approved Astro starter template,
So that implementation begins from the intended architectural baseline for the site.

**FRs implemented:** FR39, FR40, FR41, FR44

**Acceptance Criteria:**

**Given** the implementation work is beginning
**When** the project is initialized
**Then** it is created from the approved Astro starter template defined by the architecture
**And** the baseline project structure supports the planned static-first implementation approach

**Given** the starter project has been created
**When** dependencies and required initial integrations are installed
**Then** the project can run locally using the standard development workflow
**And** the initial configuration matches the architecture's launch constraints

**Given** the starter setup is complete
**When** the repository is reviewed
**Then** only the foundation needed for the launch implementation is present
**And** no unnecessary runtime services, deployment automation, database setup, or unrelated scaffolding is introduced

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

**Given** Story 1.2 is complete
**When** later implementation stories begin
**Then** they can rely on a working local build and CI validation baseline
**And** they do not need to redefine deployment strategy, hosting shape, or pipeline ownership

### Story 1.3: Home Page Hero and Identity Introduction

As a first-time visitor,
I want to immediately understand who Chris is, what he does, and why I should keep exploring,
So that I can quickly decide whether this site is relevant to my evaluation.

**FRs implemented:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR23, FR34, FR42, FR46

**Acceptance Criteria:**

**Given** a visitor lands on the home page on a supported desktop or mobile browser
**When** the first viewport renders
**Then** the page presents Chris's name, professional role or focus, and a concise introduction above the fold
**And** the content is scannable without requiring technical insider knowledge

**Given** a visitor lands on the home page
**When** they scan the hero and introduction content
**Then** they can identify Chris as a real individual with a clear professional context
**And** the page includes at least one visible trust-oriented cue such as portrait, credibility tag, or professional signal

**Given** a visitor is evaluating the site quickly
**When** they view the hero section
**Then** they can identify an obvious next step to continue evaluation
**And** that next step does not rely on hidden, hover-only, or ambiguous interaction

**Given** the home page is rendered in the MVP implementation
**When** visual styling and motion are applied
**Then** the experience reflects the intended editorial-first visual direction
**And** motion remains non-essential to understanding the identity content

### Story 1.4: Global Navigation and First-Visit Orientation

As a first-time visitor,
I want clear global navigation and orientation cues,
So that I can quickly understand where to go next and move through the site without confusion.

**FRs implemented:** FR17, FR18, FR21, FR22, FR23, FR24, FR25, FR46

**Acceptance Criteria:**

**Given** a visitor is on any primary public page
**When** the global navigation is displayed
**Then** it includes clear, direct links to the primary destinations for launch
**And** the labels are familiar and descriptive rather than clever or branded

**Given** a visitor is using the site on desktop or mobile
**When** they access the global navigation
**Then** they can reach the main destinations and return home without confusion
**And** the navigation pattern remains stable in purpose, placement, and interaction behavior

**Given** a visitor is viewing the current page within the site
**When** the navigation renders
**Then** the current page is indicated clearly but unobtrusively
**And** that indication does not rely on color alone

**Given** a visitor is using a narrow mobile screen
**When** they access the navigation
**Then** the mobile navigation pattern preserves access to key destinations without obscuring core content
**And** it avoids awkward gestures or hidden interaction requirements

**Given** a visitor uses browser back and forward controls
**When** they move between primary pages
**Then** navigation behavior remains predictable and link destinations behave like standard web navigation

### Story 1.5: Responsive Layout and Mobile-First Behavior

As a visitor using different devices,
I want the core identity and navigation experience to adapt cleanly across screen sizes,
So that I can evaluate Chris effectively on mobile, tablet, or desktop.

**FRs implemented:** FR21, FR22, FR23, FR24, FR25

**Acceptance Criteria:**

**Given** a visitor loads a primary public page on a mobile device
**When** the layout renders between `320px` and `767px`
**Then** the most important identity, navigation, and next-step content appears in a clear single-column or mobile-optimized arrangement
**And** the page does not require horizontal scrolling for normal use

**Given** a visitor loads a primary public page on a tablet-sized viewport
**When** the layout renders between `768px` and `1023px`
**Then** spacing, hierarchy, and layout adjust to improve scanability
**And** touch-first interaction remains comfortable without hover assumptions

**Given** a visitor loads a primary public page on a desktop viewport
**When** the layout renders at `1024px` or wider
**Then** the design uses additional space to strengthen composition and readability
**And** it does not introduce unnecessary density or visual clutter

**Given** responsive behavior is implemented across breakpoints
**When** content shifts between viewport sizes
**Then** the structure changes only when it improves comprehension
**And** core trust signals, navigation access, and next-step clarity remain preserved across sizes

**Given** responsive layouts, typography, and media are implemented
**When** the page is viewed on supported devices
**Then** sizing and spacing use fluid or relative behavior where appropriate
**And** important content remains legible, stable, and easy to interact with

### Story 1.6: Accessibility Baseline for Core Browsing

As a visitor using keyboard navigation or assistive technology,
I want the site's core pages and navigation to be accessible,
So that I can understand and use the experience without unnecessary barriers.

**FRs implemented:** FR31, FR32, FR33, FR35

**Acceptance Criteria:**

**Given** a visitor uses keyboard-only navigation on a primary public page
**When** they move through links, buttons, and navigation controls
**Then** all core interactive elements are reachable in a logical order
**And** visible focus indicators are present and consistent

**Given** a visitor uses a screen reader or other assistive technology
**When** they access a primary public page
**Then** the page exposes a meaningful heading structure, landmarks, and descriptive interactive labels
**And** important content is understandable without relying on visual styling alone

**Given** text, controls, and interactive states are styled for the MVP
**When** the interface is viewed under normal browsing conditions
**Then** contrast and state differentiation support the WCAG `2.2 AA` target
**And** meaning is not conveyed by color alone

**Given** the site includes motion, transitions, or scroll-linked visual refinement
**When** a visitor prefers reduced motion
**Then** non-essential motion is reduced or removed
**And** comprehension and navigation remain fully intact

**Given** the core browsing experience is implemented on supported desktop and mobile browsers
**When** accessibility checks are performed
**Then** the launch experience can be evaluated against an explicit accessibility baseline
**And** critical issues in navigation, labeling, focus, and structure can be identified and corrected

### Story 1.7: Distinct Visual System and Trust Signals

As a first-time visitor,
I want the site to feel polished, intentional, and recognizably personal,
So that I trust the quality of Chris's work and remember the experience as distinct from a generic template.

**FRs implemented:** FR5, FR6, FR42, FR46

**Acceptance Criteria:**

**Given** a visitor views the site's primary public pages
**When** the visual system is applied
**Then** the interface uses a consistent set of design tokens for color, typography, spacing, and emphasis
**And** the presentation reflects the defined warm editorial visual direction

**Given** the site displays identity and evaluative content
**When** visitors scan the experience
**Then** trust-oriented signals such as portrait treatment, credibility cues, or professional context are visible and cohesive
**And** these signals support understanding without overwhelming the content

**Given** headings, body text, navigation text, and supporting UI text are rendered
**When** typography is applied
**Then** the type system creates a clear hierarchy between editorial emphasis and functional readability
**And** the result remains legible across supported devices

**Given** motion and interaction styling are present in the experience
**When** a visitor browses the site
**Then** they reinforce pacing, emphasis, or polish rather than drawing attention away from content
**And** controls remain physically stable and understandable throughout interaction

**Given** a visitor compares the site to a generic portfolio or profile page
**When** they move through the primary experience
**Then** the site presents a distinct professional identity and crafted feel
**And** the design does not rely on intrusive patterns or ornamental effects that weaken trust

## Epic 2: Project Proof and Technical Credibility

Visitors can browse a credible project collection and use project content as evidence of Chris's technical ability, judgment, and craft.

### Story 2.1: Projects Index and Evaluation-Oriented Browsing

As a visitor evaluating Chris's work,
I want to browse a clear collection of projects,
So that I can quickly identify which work is most relevant to review in more detail.

**FRs implemented:** FR8, FR9, FR16, FR28

**Acceptance Criteria:**

**Given** a visitor navigates to the projects area
**When** the projects index page loads
**Then** it presents a scannable collection of project entries with consistent summary information
**And** each entry provides a clear path to a deeper project detail view

**Given** a visitor is reviewing projects under time pressure
**When** they scan the project collection
**Then** they can distinguish projects by title, context, and relevance cues
**And** the page supports quick comparison without requiring deep reading of every item

**Given** the projects index is viewed on supported desktop or mobile browsers
**When** the collection renders
**Then** the layout remains readable and easy to navigate across viewport sizes
**And** project links behave like standard web navigation

**Given** a visitor reaches the projects index from another page
**When** they decide to continue evaluation
**Then** the page offers an obvious next step into individual project proof
**And** it preserves orientation within the overall evaluation journey

### Story 2.2: Project Detail Pages with Substantive Proof

As a technical evaluator,
I want each project to have a dedicated detail page with substantive context,
So that I can assess Chris's technical capability and decision-making from real work examples.

**FRs implemented:** FR9, FR10, FR11, FR16

**Acceptance Criteria:**

**Given** a visitor opens an individual project page
**When** the detail content renders
**Then** the page explains what the project is, what problem it addressed, and Chris's role or contribution
**And** the information is understandable without assuming insider knowledge

**Given** a visitor is evaluating technical credibility
**When** they review a project detail page
**Then** they can identify concrete proof such as scope, constraints, outcomes, decisions, or implementation evidence
**And** the content goes beyond a superficial gallery-style summary

**Given** a project includes external references such as a live link, repository, or related artifact
**When** those references are shown
**Then** they are clearly labeled and optional to use for deeper evaluation
**And** the page still communicates value even if an external artifact is unavailable

**Given** a visitor moves between project detail pages and other primary pages
**When** navigation and layout render
**Then** the project detail experience remains consistent with the broader site
**And** it supports continued progression toward resume review or contact

### Story 2.3: Structured Project Presentation for Credibility and Discoverability

As a visitor or search engine,
I want project content to follow a consistent, structured presentation pattern,
So that project proof is easier to understand, compare, and discover.

**FRs implemented:** FR10, FR11, FR28

**Acceptance Criteria:**

**Given** project content is authored for the MVP
**When** project entries are created or updated
**Then** each entry follows a defined structure for summary, detail, and supporting metadata
**And** the structure supports both list-page previews and detail-page rendering

**Given** a visitor compares multiple projects
**When** they move between entries
**Then** the recurring content pattern makes the proof easier to scan and evaluate
**And** differences between projects come from the work itself rather than inconsistent formatting

**Given** search engines crawl project pages
**When** they read the rendered project content
**Then** the page structure communicates meaningful information about the project topic and purpose
**And** the content is not dependent on client-side-only rendering to expose core meaning

**Given** project entries grow over time
**When** new projects are added
**Then** the same structured pattern can be reused without redesigning the project experience
**And** future project discoverability is strengthened by consistent content structure

### Story 2.4: Extensible Project Storytelling Foundation

As Chris,
I want the project content model and templates to support richer storytelling later,
So that I can deepen proof of work over time without rebuilding the site's core project structure.

**FRs implemented:** FR12

**Acceptance Criteria:**

**Given** the MVP project experience is implemented
**When** project content models and templates are defined
**Then** they support today's required project summaries and detail pages
**And** they leave room for future additions such as deeper case-study sections, richer media, or expanded narrative blocks

**Given** future project storytelling needs emerge
**When** Chris adds more detailed project content
**Then** the site can accommodate that deeper storytelling within the same overall project architecture
**And** existing project pages do not need to be restructured from scratch

**Given** richer storytelling is not yet used on every project
**When** visitors browse the current MVP project pages
**Then** the experience remains coherent and complete without placeholder content
**And** future extensibility does not create clutter or confusion in the launch experience

## Epic 3: Resume Access and Contact Conversion

Hiring audiences can complete the core evaluation path, access the resume, and take the next step to contact Chris without friction.

### Story 3.1: Resume Access from the Evaluation Journey

As a hiring evaluator,
I want to access Chris's resume easily from the site,
So that I can review formal experience and qualifications without breaking my evaluation flow.

**FRs implemented:** FR13, FR14, FR15, FR16

**Acceptance Criteria:**

**Given** a visitor is evaluating Chris through the site
**When** they reach a resume access point
**Then** they can clearly identify how to view or download the resume
**And** the path to the resume does not require guesswork or hidden interaction

**Given** a visitor opens the resume destination or download
**When** the content loads successfully
**Then** the resume asset is reachable and presented as current professional material
**And** the transition preserves orientation within the evaluation flow

**Given** the resume asset is unavailable, outdated, or misconfigured
**When** a visitor reaches a resume access point
**Then** the site does not send them into a broken or trust-eroding dead end
**And** it presents a clear fallback or recovery path such as an alternate resume view, explanatory message, or adjacent contact path

**Given** a visitor is moving between profile, project, and resume information
**When** they use the site's navigation or calls to action
**Then** the transition to resume review feels like a natural continuation of evaluation
**And** it does not interrupt orientation within the site

### Story 3.2: Guided Evaluation Path from Profile to Proof to Resume

As a hiring audience member,
I want the site to guide me through the core evaluation journey,
So that I can move from understanding Chris to reviewing proof and qualifications in one visit.

**FRs implemented:** FR14, FR15, FR16, FR18, FR19

**Acceptance Criteria:**

**Given** a visitor starts on the home page or another primary entry point
**When** they scan the site for next steps
**Then** the experience presents a clear progression toward projects and resume review
**And** that progression remains understandable on desktop and mobile

**Given** a visitor has completed one stage of evaluation such as reading the introduction or reviewing projects
**When** they are ready to continue
**Then** the page provides an obvious next action toward the next evaluative step
**And** the user never has to infer the intended path from layout alone

**Given** a visitor completes the full evaluation journey in one session
**When** they move across profile, projects, and resume destinations
**Then** the flow feels cohesive rather than fragmented
**And** each stage reinforces the site's professional credibility

### Story 3.3: Clear Contact Pathways for Professional Outreach

As a visitor who wants to reach Chris,
I want a clear and low-friction way to initiate contact,
So that I can follow up after evaluation without confusion.

**FRs implemented:** FR17, FR18, FR19, FR20, FR45

**Acceptance Criteria:**

**Given** a visitor wants to contact Chris
**When** they look for outreach options on primary public pages
**Then** they can find at least one clear contact pathway without extensive searching
**And** the contact option is presented in a professional and trustworthy way

**Given** a visitor uses the contact destination or contact action
**When** they review the available outreach information
**Then** they understand what action to take next
**And** the site does not require advanced communication features to complete the basic outreach path

**Given** public contact information is exposed in the MVP
**When** it is rendered on the site
**Then** it follows the project's privacy-conscious constraints
**And** it avoids unnecessary exposure of personal information beyond the intended contact pathway

### Story 3.4: Calm Contact Feedback and Action Clarity

As a visitor using a contact action,
I want clear feedback or action clarity when I try to reach Chris,
So that I know what happened and what to do next without stress.

**FRs implemented:** FR19, FR20, FR31, FR33, FR45

**Acceptance Criteria:**

**Given** the launch contact pathway uses a lightweight interaction such as a mail action, email link, or simple form
**When** the visitor uses that interaction
**Then** the interface makes the intended next step or current state clear
**And** the experience remains calm, concise, and non-disruptive

**Given** the visitor encounters incomplete input, a failed handoff, or another contact-related issue
**When** feedback appears
**Then** the message explains what went wrong in plain language
**And** it tells the visitor how to recover without blaming or confusing them

**Given** a contact action cannot complete through the intended lightweight mechanism
**When** the failure state is shown
**Then** the site preserves at least one clear next step for outreach
**And** the failure does not strand the visitor without a trustworthy recovery option

**Given** contact-related feedback or guidance is shown
**When** it is rendered
**Then** color is not the only signal used to convey meaning
**And** the feedback remains understandable for assistive technology and keyboard users

## Epic 4: Discoverability and Sustainable Ownership

Search engines can discover the site, Chris can keep professional information current, and the product can evolve as a long-term owned asset without losing quality or privacy.

### Story 4.1: Search-Friendly Metadata and Crawlable Public Pages

As a search engine or external visitor,
I want the site's primary pages to expose crawlable content and clear metadata,
So that Chris's professional identity and work can be discovered through search and sharing.

**FRs implemented:** FR26, FR27, FR30

**Acceptance Criteria:**

**Given** a search engine crawls the site's primary public pages
**When** it reads the rendered output
**Then** the core page meaning is available in the HTML response
**And** the site does not depend on client-side execution to expose its main identity and project content

**Given** the home page, project pages, and other launch pages are published
**When** metadata is generated
**Then** each page includes relevant titles and descriptions aligned to its content
**And** the metadata supports name-based discovery and basic social sharing clarity

**Given** public pages are linked through the site's navigation and internal structure
**When** search engines or visitors move through them
**Then** the pages are discoverable through normal crawlable links
**And** primary destinations are not hidden behind non-standard interaction patterns

### Story 4.2: Structured Search Signals for Projects and Future Publishing

As Chris,
I want the content system to support structured discoverability signals,
So that projects are easier to find now and future writing or case-study content can be added cleanly after launch without redefining MVP scope.

**FRs implemented:** FR27, FR28, FR29, FR30

**Acceptance Criteria:**

**Given** project and core site content is modeled for the MVP
**When** metadata and page structure are defined
**Then** each launch page and project page includes a meaningful page title, page description, canonical path, and visible heading structure aligned to its content
**And** any future writing or case-study discoverability remains explicitly extension-ready rather than launch-required

**Given** Chris adds future publishing content after launch
**When** that content type is introduced
**Then** the site can apply the same discoverability pattern without redefining the product concept
**And** the addition fits the existing information architecture

**Given** discoverability support is implemented
**When** search-oriented content is reviewed
**Then** it remains understandable to human readers first
**And** it does not become keyword-stuffed, misleading, or structurally inconsistent

### Story 4.3: Owner-Controlled Content Updates for Profile, Resume, and Projects

As Chris,
I want to update profile content, resume access, and project entries without unnecessary friction,
So that the site stays current as a long-term professional asset.

**FRs implemented:** FR36, FR37, FR38, FR39, FR43

**Acceptance Criteria:**

**Given** Chris needs to update profile, resume, or project information
**When** he edits the source content for those areas
**Then** the update path is clear and consistent across content types
**And** routine changes do not require restructuring page templates

**Given** a content update is made to a core professional asset
**When** the site is rebuilt or republished
**Then** the updated information appears in the correct public location
**And** existing browsing paths continue to work normally

**Given** profile, resume, and project content changes over time
**When** Chris maintains the site across multiple updates
**Then** the system continues to feel owner-controlled rather than dependent on a third-party editing workflow
**And** the site remains a durable professional asset under Chris's control

### Story 4.4: Sustainable Site Architecture with Minimal Third-Party Dependence

As Chris,
I want the site's core value to remain operable without unnecessary external dependencies,
So that it stays maintainable, private, and resilient over time.

**FRs implemented:** FR39, FR41, FR44, FR45

**Acceptance Criteria:**

**Given** the MVP architecture is implemented
**When** core identity, projects, resume, and contact pathways are delivered
**Then** they function without requiring optional third-party services for their basic value
**And** non-core integrations remain isolated from the primary browsing experience

**Given** an optional external dependency is unavailable or removed
**When** a visitor uses the site
**Then** the core site remains usable for browsing and evaluation
**And** the failure does not block access to identity, projects, resume, or primary contact pathways

**Given** privacy-conscious operation is a product requirement
**When** external services or scripts are considered
**Then** only necessary third-party behavior is included in the core experience
**And** unnecessary exposure of visitor or personal data is avoided

### Story 4.5: Future-Ready Content and Integration Boundaries

As Chris,
I want the site's structure to support future content and integrations without disturbing the launch experience,
So that the product can evolve cleanly while preserving performance, clarity, and maintainability.

**FRs implemented:** FR40, FR41, FR44, FR46

**Acceptance Criteria:**

**Given** the MVP information architecture and content model are defined
**When** future enhancements are considered
**Then** the current structure supports growth in projects and future content areas without redefining the site's core purpose
**And** the launch experience remains coherent on its own without requiring future writing surfaces to be present

**Given** a future capability such as analytics, a CMS, or richer content sections is introduced
**When** it is added after launch
**Then** it can be integrated through defined extension boundaries
**And** the primary browsing journey remains understandable and trustworthy

**Given** the site evolves over time
**When** Chris continues to add or refine content and features
**Then** core trust signals remain visible and understandable
**And** future additions do not materially compromise core performance or maintainability

**Given** implementation work is planned for MVP only
**When** stories are selected for sprint planning
**Then** reserved future-writing routes, content types, and UI sections are treated as post-launch seams rather than required deliverables
**And** sprint scope remains limited to homepage, projects, resume, contact, accessibility, SEO, and deployment-ready foundations

<!-- End story repeat -->
