---
title: Personal Website Refresh
summary: Rebuilt this portfolio as a static-first Astro site that helps recruiters, hiring managers, and clients understand Chris's work quickly.
context: Solo product engineering project spanning content modeling, UX framing, accessibility, and deployment guardrails.
overview: Built a static-first portfolio that makes Chris's role, selected work, and contact path easy to review on any device.
problem: The earlier portfolio made Chris's work harder to assess because broad claims, scattered navigation, and thin project context hid the strongest signals. The rebuild needed to make his role, judgment, and technical standards clear without asking visitors to decode the interface.
role: Chris owned the project end to end, including architecture choices, content modeling, visual direction, accessibility constraints, testing strategy, and deployment guardrails. He paired product framing with implementation so the site would read as clearly as it was built.
relevanceCues:
  - Static-first Astro architecture
  - Product judgment expressed through information hierarchy
  - Accessibility and QA guardrails baked into delivery
proofSections:
  - title: Content model and route architecture
    summary: Built a canonical content path so pages, projects, and metadata stay typed, crawlable, and consistent without parallel data sources.
    evidence:
      - Defined Astro content collections with Zod validation to catch schema drift at build time instead of after publishing.
      - Centralized project normalization in helper modules so routes stay thin and static generation remains predictable.
      - Preserved canonical URLs and shared shells to keep navigation and metadata behavior consistent across the site.
  - title: Hiring-focused UX decisions
    summary: Organized the site around fast orientation, strong project context, and clear next actions instead of a gallery-style presentation.
    evidence:
      - Rewrote route framing and section hierarchy to answer what the work is, why it matters, and where to go next.
      - Chose an editorial visual system with deliberate typography, contrast, and spacing rather than interchangeable portfolio defaults.
      - Kept onward paths to projects, resume, and contact visible so deeper project pages do not become dead ends.
  - title: Quality and accessibility guardrails
    summary: Paired the design and content work with regression protection so credibility does not depend on manual spot checks.
    evidence:
      - Added Node-based regression tests that validate content contracts, built HTML output, and static-first behavior.
      - Preserved keyboard access, visible focus states, reduced-motion handling, and semantic page structure as implementation constraints.
      - Kept deployment verification aligned with `npm run check`, `npm test`, and `npm run build` to prevent silent regressions.
storyModules:
  - type: narrative
    id: implementation-timeline
    label: Implementation timeline
    heading: How the project moved from cleanup work to a clearer hiring-focused experience.
    content:
      - Started by tightening the content contract and route boundaries so every project page could keep one stable source of truth.
      - Refined the information hierarchy and validation guardrails together so the final site communicated judgment through both structure and implementation discipline.
  - type: media
    id: proof-map-snapshot
    label: Project structure snapshot
    heading: A quick visual of how the final project pages connect summary, supporting detail, and onward action.
    summary: The media seam stays optional and static-first, so richer project visuals can be added later without forcing every entry into a gallery pattern.
    items:
      - src: /images/projects/portfolio-refresh-proof-map.svg
        alt: Annotated project map showing how the portfolio routes connect summary, supporting detail, and next steps.
        caption: Kept inside the static project media boundary so richer visuals can stay useful, lightweight, and optional.
        width: 960
        height: 640
externalArtifacts:
  - label: Repository
    href: https://github.com/chrisfahey/personal-website
    note: Optional if you want to inspect the implementation details and commit history behind the current site.
seoTitle: "Personal Website Refresh | Chris Fahey Projects"
seoDescription: "A portfolio rebuild focused on recruiter clarity, static delivery, and credible project presentation."
slug: "portfolio-refresh"
---

One of the central decisions was to make credibility come from coherence. The content model, route structure, metadata, and visual system all needed to reinforce the same message: this is work shaped by clear tradeoffs, not just assembled screens.

The implementation also avoided unnecessary client-side behavior. For a portfolio meant to support calm, dependable review, static delivery and clear project context create more trust than decorative interactivity.
