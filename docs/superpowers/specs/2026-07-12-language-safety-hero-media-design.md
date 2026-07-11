# Language Safety and Hero Media Optimization Design

## Goal

Fix the bilingual experience so language changes never alter inquiry data, and reduce the home-page hero media cost without visibly weakening the flagship presentation.

The implementation must preserve the current page structure, pricing copy, Formspree endpoints, submitted field names, and Japanese-first experience.

## Language State

The selected language is stored under one stable `localStorage` key. The application initializes from that value when it is `ja` or `en`; otherwise it defaults to Japanese. Every language change updates the stored value, `document.documentElement.lang`, and the page title.

The stored preference applies to both `/` and `/business/`. Moving between those pages must retain the selected language without adding separate language URLs.

Storage access must be guarded so the site still renders when browser privacy settings make `localStorage` unavailable.

## Form Option Contracts

Every translated select and checkbox option uses a stable value plus a localized visible label. Changing the language may replace labels, but it must not replace option values, React keys, selected values, or checked state.

Japanese values remain the canonical submitted values for translated choices because Japanese is the primary operating language for the Formspree notification inbox. For example, `歌ってみたMV` remains the submitted request-type value while its English visible label is `Cover MV`. Existing language-neutral plan names remain unchanged. This preserves the current Japanese notification format and avoids introducing opaque identifiers.

The existing Formspree field names remain unchanged. Stable option values should be concise canonical identifiers that are readable in notification emails. Existing controlled prefill behavior for plan, budget, and reference URL must continue to work in both languages.

The following behavior is required:

- Request type, plan, budget, song length, materials, production setup, portfolio visibility, project-file delivery, NDA, and collaborator participation retain their selections when the language changes.
- Text inputs and textareas retain their entered values.
- A work-card preset retains its plan, budget meaning, and reference URL after a language change.
- Form reset after successful submission still clears controlled and uncontrolled fields.

## Accessible Names

The language button accessible name includes its visible destination label, `EN` or `JP`. Work-card contact-link accessible names begin with the same visible command shown on screen, followed by the work title for context. This removes label-content-name mismatch failures while retaining specific screen-reader context.

## Hero Media

The current 1920x1080, 15 fps H.264 source remains the visual master. Two web delivery files are generated from it:

- Desktop: 1920x1080 H.264 MP4, 15 fps, approximately 5-6 MB.
- Mobile: 960x540 H.264 MP4, 15 fps, approximately 2-3 MB.

Both files use `yuv420p`, browser-streamable fast-start metadata, no audio track, and the existing loop duration. Compression must prioritize visual quality over the smallest possible file.

The browser receives a mobile source first with a `max-width: 760px` media condition and a desktop source second. Desktop must not download the mobile file and mobile must not download the desktop file.

The existing poster is converted to WebP for the primary static asset while retaining the JPEG as a fallback. The displayed crop and caption placement remain unchanged.

## Reduced Data and Motion

The application renders the static hero image instead of a `video` element when either condition is true before the first render:

- `prefers-reduced-motion: reduce`
- `navigator.connection.saveData === true`

When the connection API is unavailable, normal responsive video behavior is used. Static mode must not add video sources to the DOM, preventing media downloads rather than merely pausing playback.

## Testing

Tests are added before implementation and must fail against the current site.

Browser tests cover:

- Form selections and material checkboxes remain semantically unchanged after JA to EN and EN to JA switching.
- English remains selected when navigating from `/` to `/business/` and back.
- Work-card prefill remains correct through a language change.
- Visible labels are contained in accessible names for the language button and work-card contact links.
- Mobile and desktop viewports select the intended media source.
- Reduced-motion and Save-Data contexts render a static image with no `video` element.
- Existing 320px and 412px overflow checks remain green.

Media verification covers:

- Codec, pixel format, resolution, frame rate, duration, absence of audio, and fast-start-compatible output.
- Desktop size remains in the approximately 5-6 MB quality target.
- Mobile size remains in the approximately 2-3 MB quality target.
- Desktop and mobile screenshots preserve the current hero crop, caption readability, and page geometry.

## Rollback and Delivery

The immutable tag `backup-before-language-video-2026-07-12` identifies the pre-change production state locally and on GitHub. Work is implemented on an isolated feature branch, verified locally, merged to `main`, deployed through the existing GitHub Pages workflow, and checked again on `https://riesz.org/`.
