# Local Font Delivery Design

## Goal

Remove the render-blocking Google Fonts stylesheet request while preserving the current Archivo, Space Grotesk, and Noto Sans JP typography, weights, sizes, line heights, and responsive layout.

## Font Source

Use the OFL-1.1 licensed Fontsource packages as build-time dependencies, pinned through `package-lock.json`:

- `@fontsource/archivo@5.2.8`
- `@fontsource/space-grotesk@5.2.10`
- `@fontsource/noto-sans-jp@5.2.9`

These packages provide the same font-family names currently used by the site. Noto Sans JP retains Unicode-range segmentation, so the browser requests only font fragments required by visible text instead of one complete multi-megabyte Japanese font.

## Loaded Weights

Import only the weights already requested by the current Google Fonts URL:

- Archivo: 500, 700, 800, 900
- Space Grotesk: 500, 600, 700
- Noto Sans JP: 400, 500, 700, 900

The Fontsource CSS is imported from `src/main.tsx` before the site CSS. Vite combines the CSS into the build and emits the referenced WOFF2/WOFF assets with hashed filenames.

The existing typography tokens in `src/App.css` remain unchanged:

```css
--display: 'Archivo', 'Noto Sans JP', sans-serif;
--ui: 'Space Grotesk', 'Noto Sans JP', sans-serif;
--body: 'Noto Sans JP', sans-serif;
```

No font size, font weight, letter spacing, line height, text transform, breakpoint, or layout rule changes are included.

## Loading Behavior

Delete the external Google Fonts `@import` from `src/index.css`. Fontsource uses `font-display: swap`, allowing text to render without waiting for a cross-origin stylesheet chain. All font CSS and font binaries are served from `riesz.org` after deployment.

Do not add `font-display: optional`, system-font replacements, or asynchronous CSS injection because those approaches can intentionally leave users on a different typeface.

## Verification

Before implementation, capture the current live home and business first viewports at 1440x1000 and 390x844 after `document.fonts.ready`. Record bounding boxes for the brand, H1, navigation, hero description, and primary CTA.

After implementation, capture the same local production-preview viewports and compare:

- computed `font-family` and `font-weight` match the baseline families and weights;
- measured text element positions and dimensions remain within one CSS pixel;
- no heading, navigation, CTA, or Japanese text wraps differently;
- 320px and 412px overflow tests remain green;
- screenshots show no typography substitution or layout movement after fonts finish loading.

Automated contracts must confirm:

- `src/index.css` contains no `fonts.googleapis.com` import;
- `src/main.tsx` imports every approved Fontsource weight;
- the production build contains no `fonts.googleapis.com` or `fonts.gstatic.com` reference;
- browser network requests for fonts use the local production-preview origin;
- Accessibility, Best Practices, and SEO Lighthouse categories remain at 100.

Performance verification compares mobile Lighthouse FCP, LCP, render-blocking resources, and font request origins against the previous audit. The required result is removal of the external Google Fonts stylesheet from the render-blocking chain. Performance score improvement is recorded but not treated as deterministic because Lighthouse throttling varies between runs.

## Rollback and Delivery

The immutable tag `backup-before-font-self-hosting-2026-07-12` identifies the pre-change production state locally and on GitHub. Implementation occurs on an isolated feature branch, is verified through the existing full test suite and visual checks, then is deployed through the GitHub Pages workflow and rechecked on `https://riesz.org/`.
