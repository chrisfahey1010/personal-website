# Personal Website

Static personal portfolio site for `fahey.vip`, built with Astro 5 and Tailwind CSS. The launch site is a single-page experience with hash sections for Home, Projects, Resume, and Contact.

## Tech Stack

- Astro 5 static output
- Tailwind CSS through the Vite plugin
- TypeScript
- Astro content collections with Zod schemas
- Cloudflare Pages as the production hosting target

## Getting Started

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Build the static site:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Scripts

- `npm run dev` starts Astro locally.
- `npm run check` runs `astro sync && tsc --noEmit`.
- `npm run build` creates the production static output in `dist/`.
- `npm run preview` serves the built site locally.
- `npm run deploy:dry-run` rebuilds and validates the Wrangler static-assets deploy configuration.
- `npm run deploy` rebuilds and publishes through Wrangler.

There is currently no test suite or `npm test` script.

## Project Structure

```text
src/pages/index.astro          Single launch page
src/layouts/BaseLayout.astro   Global shell, metadata, and navigation
src/components/                Page, navigation, project, and SEO components
src/config/                    Navigation and contact configuration
src/content/                   Authored page, project, resume, and future post content
src/lib/content/               Content loading and shaping helpers
src/lib/seo/                   Metadata and structured data helpers
src/styles/global.css          Global styling
public/                        Static images, resume PDF, resume previews, robots.txt
infrastructure/                Cloudflare and deployment notes
```

## Content Editing

Authored content lives under `src/content` and is validated by `src/content.config.ts`.

- Home page hero and SEO content: `src/content/pages/home.md`
- Project cards: `src/content/projects/*.md`
- Resume section copy and freshness settings: `src/content/resume/overview.md`
- Future writing seam: `src/content/posts/future-writing-seam.md`

Project entries are ordered by `sortOrder` and then title. Projects with `status: Deployed` must include a `liveUrl`.

Navigation and CTA links must stay aligned with `src/config/navigation.ts`; the content schema rejects unknown launch targets.

## Resume And Assets

The resume section renders download/view actions only when `public/resume/chris-resume.pdf` exists and the resume content is still fresh according to `updatedAt` and `maxAgeDays` in `src/content/resume/overview.md`.

Resume preview images are referenced directly from `src/pages/index.astro`:

- `/resume/chris-resume-page-1.png`
- `/resume/chris-resume-page-2.png`

Portrait assets referenced by content must live under `/images/` in `public/`.

## Deployment

The site builds to static files in `dist/`. Production hosting is intended to use Cloudflare Pages connected to the `main` branch with build command `npm run build` and output directory `dist`.

Wrangler is configured as a fallback static-assets publisher through `wrangler.jsonc`. Use `npm run deploy:dry-run` to validate the fallback path before publishing.

No required public build-time environment variables are currently defined. Keep Cloudflare credentials and deployment tokens out of app env files.

See `infrastructure/README.md` and `infrastructure/cloudflare/README.md` for deployment boundaries and Cloudflare-specific notes.
