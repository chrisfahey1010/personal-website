# Cloudflare deployment notes

## Hosting target

- Use `Cloudflare Pages` as the production host for the static Astro site.
- Connect the repository to Cloudflare Pages and deploy `main` to production.
- Use preview deployments for branches or pull requests when they are helpful, but do not make them a launch blocker.

## Domain setup

- Attach `fahey.vip` directly in Cloudflare.
- Keep DNS and HTTPS ownership in Cloudflare instead of introducing `Route 53` or AWS certificate infrastructure.

## Setup checklist

- Create or confirm the `Cloudflare Pages` project is connected to this repository.
- Set the production branch to `main`.
- Confirm the build command matches the repo standard: `npm run build`.
- Confirm the build output directory is `dist`.
- Verify `fahey.vip` is attached to the Pages project and resolving through Cloudflare.
- Keep any future deploy token or platform credentials out of `.env.example` and application runtime env files.
- Run `npm test` and `npm run build` before pushing meaningful deployment changes.

## Deployment baseline

- Prefer Cloudflare's native Git integration for the MVP because it is the lowest-friction path.
- Keep GitHub Actions focused on validation unless a later need justifies a custom deploy workflow.
- If a custom deploy workflow is introduced later, keep it minimal and separate its credentials from application env files.

## Content ownership

- Keep authored site content and normal static assets in the repository wherever practical.
- Do not add `S3`, `R2`, or other object storage for normal site content unless future media needs clearly justify it.

## Caching and delivery

- Rely on build-time fingerprinted assets and Cloudflare-managed edge delivery.
- Keep the deployment model static-first and avoid Workers or Functions unless a narrow future requirement earns them.
