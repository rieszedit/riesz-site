# Local Font Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the current Archivo, Space Grotesk, and Noto Sans JP typography from the site build without changing visible type or layout.

**Architecture:** Replace the external Google Fonts `@import` with pinned Fontsource weight CSS imported by the Vite entry point. Protect source imports, browser request origins, computed families, and layout geometry with Node and Playwright checks, then compare Lighthouse and screenshots against the current live baseline.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Fontsource 5.2, Node test runner, Playwright, Lighthouse

---

### Task 1: Baseline and Failing Delivery Contracts

**Files:**
- Create: `tests/font-delivery.test.ts`
- Modify: `tests/e2e/site-contract.spec.ts`
- Create ignored artifacts under: `output/font-delivery-qa/`

- [ ] **Step 1: Capture the current live visual and geometry baseline**

Use Playwright against `https://riesz.org/` and `https://riesz.org/business/` at 1440x1000 and 390x844. Wait for `document.fonts.ready`, capture first-viewport screenshots, and write JSON containing each target element's bounding box, computed `fontFamily`, and `fontWeight`:

```js
const selectors = [
  '.brand-link',
  '.nav-links',
  '.hero-copy h1',
  '.hero-description',
  '.primary-button',
  '.business-hero h1',
]
```

Store files under `output/font-delivery-qa/baseline-*`; `output` is already ignored.

- [ ] **Step 2: Write the failing source contract**

Create `tests/font-delivery.test.ts`:

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const entry = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

const requiredImports = [
  '@fontsource/archivo/500.css',
  '@fontsource/archivo/700.css',
  '@fontsource/archivo/800.css',
  '@fontsource/archivo/900.css',
  '@fontsource/space-grotesk/500.css',
  '@fontsource/space-grotesk/600.css',
  '@fontsource/space-grotesk/700.css',
  '@fontsource/noto-sans-jp/400.css',
  '@fontsource/noto-sans-jp/500.css',
  '@fontsource/noto-sans-jp/700.css',
  '@fontsource/noto-sans-jp/900.css',
]

test('loads every approved font weight from the local build', () => {
  for (const fontImport of requiredImports) {
    assert.match(entry, new RegExp(`['"]${fontImport.replaceAll('/', '\\/')}['"]`))
  }
})

test('does not load the Google Fonts stylesheet', () => {
  assert.doesNotMatch(styles, /fonts\.googleapis\.com|fonts\.gstatic\.com/)
})
```

- [ ] **Step 3: Add the failing browser request and computed-family test**

Add this behavior to `tests/e2e/site-contract.spec.ts`:

```ts
test('font files are delivered locally without changing the font families', async ({ page }) => {
  const fontRequests: string[] = []
  const externalFontRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url)) {
      externalFontRequests.push(url)
    }
    if (request.resourceType() === 'font') {
      fontRequests.push(url)
    }
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pageOrigin = new URL(page.url()).origin

  expect(externalFontRequests).toEqual([])
  expect(fontRequests.length).toBeGreaterThan(0)
  expect(fontRequests.every((url) => new URL(url).origin === pageOrigin)).toBe(true)
  await expect(page.locator('.hero-copy h1')).toHaveCSS('font-family', /Archivo/)
  await expect(page.locator('.hero-description')).toHaveCSS('font-family', /Noto Sans JP/)
})
```

- [ ] **Step 4: Run tests and confirm the external-font failures**

```powershell
node --test tests/font-delivery.test.ts
npm run test:e2e -- --grep "font files"
```

Expected: source test FAILS because Fontsource imports are missing; browser test FAILS because requests use Google origins.

- [ ] **Step 5: Commit the baseline tests**

```powershell
git add tests/font-delivery.test.ts tests/e2e/site-contract.spec.ts
git commit -m "Add local font delivery contracts"
```

### Task 2: Replace Google Fonts with Fontsource

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/main.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Install pinned Fontsource packages**

```powershell
npm install --save-dev --save-exact @fontsource/archivo@5.2.8 @fontsource/space-grotesk@5.2.10 @fontsource/noto-sans-jp@5.2.9
```

Expected: the three exact versions appear in `devDependencies` and `package-lock.json`.

- [ ] **Step 2: Import only the existing font weights**

At the top of `src/main.tsx`, before `./index.css`, add:

```ts
import '@fontsource/archivo/500.css'
import '@fontsource/archivo/700.css'
import '@fontsource/archivo/800.css'
import '@fontsource/archivo/900.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/noto-sans-jp/400.css'
import '@fontsource/noto-sans-jp/500.css'
import '@fontsource/noto-sans-jp/700.css'
import '@fontsource/noto-sans-jp/900.css'
import './index.css'
```

- [ ] **Step 3: Remove the external stylesheet import**

Delete only this line from `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Noto+Sans+JP:wght@400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap');
```

Do not change typography tokens or component CSS.

- [ ] **Step 4: Run source, browser, lint, and build checks**

```powershell
node --test tests/font-delivery.test.ts
npm run test:e2e -- --grep "font files"
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 5: Confirm production output has no external font references**

```powershell
$matches=rg -n "fonts\.googleapis\.com|fonts\.gstatic\.com" dist
if($LASTEXITCODE -eq 1){'No external font references'} else {throw $matches}
```

Expected: `No external font references`.

- [ ] **Step 6: Commit local font delivery**

```powershell
git add package.json package-lock.json src/main.tsx src/index.css
git commit -m "Serve site fonts from the local build"
```

### Task 3: Visual and Performance Comparison

**Files:**
- Modify only if comparison exposes a font-delivery defect.
- Create ignored artifacts under: `output/font-delivery-qa/`

- [ ] **Step 1: Run the full clean gate**

```powershell
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit and browser tests pass, build succeeds, and the worktree is clean.

- [ ] **Step 2: Capture local production-preview screenshots and geometry**

Start `vite preview` on an unused localhost port. At the same 1440x1000 and 390x844 viewports, wait for `document.fonts.ready`, capture the same selectors and screenshots as Task 1, and save them under `output/font-delivery-qa/local-*`.

- [ ] **Step 3: Compare typography geometry**

For every selector available in both baseline and local JSON:

```js
for (const property of ['x', 'y', 'width', 'height']) {
  if (Math.abs(local[property] - baseline[property]) > 1) {
    throw new Error(`${selector} ${property} changed`)
  }
}
```

Computed families must continue to contain `Archivo`, `Space Grotesk`, or `Noto Sans JP` as appropriate. Inspect paired screenshots for changed wrapping, clipping, or fallback glyphs.

- [ ] **Step 4: Verify network origins in the production preview**

Record browser requests after a cold context load. Assert zero requests to `fonts.googleapis.com` and `fonts.gstatic.com`, and at least one `.woff2` request from the preview origin.

- [ ] **Step 5: Run mobile Lighthouse comparison**

Run Lighthouse for local `/` and `/business/`, recording Performance, Accessibility, Best Practices, SEO, FCP, LCP, and render-blocking resources. Confirm Accessibility, Best Practices, and SEO remain 100 and the Google Fonts stylesheet no longer appears in render-blocking resources.

- [ ] **Step 6: Review branch scope**

```powershell
git status --short
git diff --stat b961da9..HEAD
git diff --check b961da9..HEAD
```

Expected: only the approved font dependencies, entry/style imports, tests, and plan are changed.

### Task 4: Integrate and Verify Production

**Files:**
- No new source files unless production verification exposes an approved-scope defect.

- [ ] **Step 1: Fast-forward main and rerun the full gate**

Merge the feature branch with `--ff-only`, then rerun `npm ci`, unit tests, lint, build, Playwright, and the CI npm dry run from `main`.

- [ ] **Step 2: Push and watch GitHub Pages**

Push `main`, watch the exact GitHub Pages run to `success`, and confirm local HEAD, remote HEAD, and deployment HEAD match.

- [ ] **Step 3: Verify live font delivery**

Open live home and business pages in fresh browser contexts, wait for `document.fonts.ready`, and verify:

- no Google Fonts or gstatic requests;
- WOFF2 requests come from `https://riesz.org`;
- computed font families remain unchanged;
- JA/EN navigation and both forms still operate;
- console errors and warnings remain empty.

- [ ] **Step 4: Preserve rollback and clean up**

Keep `backup-before-font-self-hosting-2026-07-12` locally and remotely. Remove only the clean isolated worktree and merged feature branch.
