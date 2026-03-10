# CloudFront deployment notes

## Cache behavior

- Route all public traffic through CloudFront in front of a private S3 origin.
- Cache fingerprinted assets aggressively and keep HTML/document caching shorter.

## Immutable asset strategy

- Prefer immutable, versioned asset filenames from the build output for JS, CSS, fonts, and images.
- Use invalidations sparingly for HTML entry points or urgent corrections rather than as the primary asset refresh strategy.

## HTML invalidation guidance

- Use `/*` for the current baseline so newly added static HTML routes cannot remain stale after deployment.
- Narrow invalidation scope later only when route-aware HTML invalidation logic exists.

## Header policy ownership

- CloudFront owns viewer-facing header policy decisions, including HTTPS enforcement and secure headers.
- Keep application code free of AWS delivery configuration and avoid introducing infrastructure-as-code scope in this note.
