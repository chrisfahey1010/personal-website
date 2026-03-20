# Infrastructure notes

This project deploys as a static Astro site on `Cloudflare Pages`.

## Minimum production shape

- Use `Cloudflare Pages` as the managed static hosting target for production.
- Attach `fahey.vip` in Cloudflare so DNS and HTTPS stay inside the same platform boundary as hosting.
- Let Cloudflare manage HTTPS delivery, the custom domain binding, and edge delivery.
- Keep secure-header policy and redirect behavior in hosting/platform configuration rather than application code.
- Prefer versioned assets from `dist/` as the primary cache-busting mechanism.
- Prefer native Git-connected deploys from `main` for the MVP baseline rather than a custom publish pipeline.
- Pin third-party GitHub Actions to immutable commit SHAs so CI/CD behavior cannot drift behind stable-looking major tags.
- Keep `astro.config.mjs` on static output and treat `dist/` as the only deploy artifact for the launch routes.
- Keep server runtime, database, auth, and public API scaffolding out of this baseline unless a later story explicitly earns them.

## Canonical deployment inputs

- Cloudflare Pages project configuration
- Cloudflare account-managed domain configuration for `fahey.vip`
- Optional deploy token only if a custom GitHub Actions deployment is introduced later
- Committed `wrangler.jsonc` only as a fallback path for publishing the existing static `dist/` output

Keep deployment configuration in Cloudflare and repository settings as appropriate. Do not place deployment credentials in application env files.

## Repository control boundaries

- Treat `main` as the production branch for this repo.
- Enforce protected-branch rules for `main` in GitHub repository settings; workflow YAML can restrict branch names, but it cannot create branch protection on its own.
- Keep authored site content in the repository wherever practical; do not move normal site content into object storage for MVP.
- If a custom deploy workflow is added later, it must only publish the exact commit SHA that passed CI on `main`.
