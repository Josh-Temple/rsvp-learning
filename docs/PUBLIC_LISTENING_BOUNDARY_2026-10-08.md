# Public listening boundary

Date: 2026-10-08

## Decision

RSVP Learning remains a **private** repository and personal learning workspace.

The public Chrome-native reading experience and the reusable fixed-URL pool live in **Josh-Temple/instant-radio**, which is already public and has a preferred public UI.

## Responsibilities

### RSVP Learning

- private learning source of truth
- RSVP / Learn / Listen authoring
- personal study state and internal experiments
- content preparation before anything is intentionally published

### Instant Radio

- public paste-and-listen utility
- public reading library
- 100 stable Chrome Read Aloud URLs
- pinned/tagged long-term public articles
- rotating confirmed-readable public slots

## Publication boundary

Publishing a piece of RSVP content to Instant Radio is an explicit action. Content is not automatically mirrored.

Before publication, confirm that the text contains no secrets, credentials, personal data, confidential work, or other information that should remain private.

## Cleanup

The temporary RSVP GitHub Pages workflow, Pages-only build script, and `listen/chrome` 100-slot experiment were removed after this decision. Their function is now owned by Instant Radio.

Reference implementation and architecture record:

- https://github.com/Josh-Temple/instant-radio
- `docs/INSTANT_RADIO_PUBLIC_PRODUCT_AND_SLOT_POOL_2026-10-08.md`
