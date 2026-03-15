---
title: Personal Website Refresh
summary: Rebuilt this portfolio as a static-first Astro site that helps evaluators scan fit, proof, and next steps quickly.
context: Solo product engineering project spanning content modeling, UX framing, accessibility, and deployment guardrails.
overview: Reframed a personal portfolio from a generic brochure into a static-first evaluation journey that makes fit, technical proof, and next steps easy to scan.
problem: The earlier portfolio pattern made Chris's work hard to assess because it leaned on broad claims, scattered navigation, and thin project context. The rebuild needed to show product judgment and engineering discipline without requiring a recruiter or technical evaluator to reverse-engineer intent from the UI.
role: Chris owned the project end to end, including architecture choices, content modeling, visual direction, accessibility constraints, testing strategy, and deployment guardrails. The work blended product framing with implementation so the site could communicate judgment as clearly as code quality.
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
  - title: Evaluator-first UX decisions
    summary: Treated the site as an evaluation flow instead of a gallery, so each page moves from orientation to proof to action.
    evidence:
      - Rewrote route framing and section hierarchy to answer what the work is, why it matters, and where to go next.
      - Chose an editorial visual system with deliberate typography, contrast, and spacing rather than interchangeable portfolio defaults.
      - Kept onward paths to projects, resume, and contact visible so deep proof pages do not become dead ends.
  - title: Quality and accessibility guardrails
    summary: Paired the design and content work with regression protection so credibility does not depend on manual spot checks.
    evidence:
      - Added Node-based regression tests that validate content contracts, built HTML output, and static-first behavior.
      - Preserved keyboard access, visible focus states, reduced-motion handling, and semantic page structure as implementation constraints.
      - Kept deployment verification aligned with `npm run check`, `npm test`, and `npm run build` to prevent silent regressions.
externalArtifacts:
  - label: Repository
    href: https://github.com/chrisfahey/personal-website
    note: Optional if you want to inspect the implementation details and commit history behind the current site.
seoTitle: "Personal Website Refresh | Chris Fahey Projects"
seoDescription: "A portfolio rebuild focused on evaluator clarity, static delivery, and credible proof navigation."
slug: "portfolio-refresh"
---

One of the central decisions was to make credibility come from coherence. That meant the content model, route structure, metadata, and visual system all had to reinforce the same story: this is work shaped by clear tradeoffs, not just assembled screens.

The implementation also intentionally avoided unnecessary client-side behavior. For a portfolio whose job is calm, dependable review, static delivery and explicit proof signals create more trust than decorative interactivity.
