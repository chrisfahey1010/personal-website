# Infrastructure notes

This project deploys as a static Astro site with a private S3 origin behind CloudFront.

## Minimum production shape

- Keep the S3 bucket private and serve traffic through CloudFront instead of a public S3 website endpoint.
- Use restricted origin access between CloudFront and S3.
- HTTPS delivery and custom-domain certificate ownership live with the CloudFront distribution setup.
- Secure headers are a CloudFront responsibility, not an application-code concern.
- Prefer versioned assets from `dist/` as the primary cache-busting mechanism.
- Use CloudFront invalidations for HTML entry points and other non-versioned paths that need an early refresh.
- Pin third-party GitHub Actions to immutable commit SHAs so CI/CD behavior cannot drift behind stable-looking major tags.

## Canonical deployment inputs

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`

Keep these deployment inputs in GitHub Actions variables or secrets as appropriate. Do not place them in application env files.

## Repository control boundaries

- Treat `main` as the production branch for this repo.
- Enforce protected-branch rules for `main` in GitHub repository settings; workflow YAML can restrict branch names, but it cannot create branch protection on its own.
- The deploy workflow must only publish the exact commit SHA that passed CI on `main`.
- The baseline deploy invalidation may target `/*` until route-aware HTML invalidation logic exists for later stories.
