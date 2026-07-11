# Language Safety and Hero Media Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve bilingual inquiry data and language preference while replacing the 12.9 MB hero with responsive quality-focused media and static fallbacks for reduced-data users.

**Architecture:** Move translated form options and browser preference decisions into small pure modules, then let `App.tsx` render stable values with localized labels. Generate desktop/mobile MP4 assets with deterministic ffmpeg commands and validate them with Node tests backed by ffprobe. Extend the existing Playwright suite to protect the complete user journey.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Node test runner, Playwright, ffmpeg/ffprobe, GitHub Pages

---

## File Map

- Create `src/form-options.ts`: localized labels with stable submitted values.
- Create `src/language-preference.ts`: guarded language read/write helpers.
- Create `src/hero-media.ts`: reduced-motion and Save-Data preference detection.
- Modify `src/App.tsx`: consume stable options, persist language, fix accessible names, select responsive media.
- Modify `src/App.css`: make static `<picture>` media fill the existing hero geometry.
- Modify `src/commission-content.ts`: use the shared localized option shape for collaborator choices.
- Create `public/media/unknown-mother-goose-hero-mobile.mp4`: 960x540 quality-focused mobile delivery asset.
- Replace `public/media/unknown-mother-goose-hero.mp4`: compressed 1920x1080 desktop delivery asset.
- Create `public/media/unknown-mother-goose-poster.webp`: lightweight static hero asset.
- Create `tests/form-options.test.ts`: option-value stability contracts.
- Modify `tests/commission-content.test.ts`: collaborator-option contract for the shared option shape.
- Create `tests/language-preference.test.ts`: guarded persistence contracts.
- Create `tests/hero-media.test.ts`: static-media decision contracts.
- Create `tests/media-assets.test.ts`: ffprobe and file-size contracts.
- Modify `tests/e2e/site-contract.spec.ts`: real browser language, form-state, media, and accessibility regressions.

### Task 1: Stable Localized Form Options

**Files:**
- Create: `src/form-options.ts`
- Modify: `src/commission-content.ts`
- Test: `tests/form-options.test.ts`

- [ ] **Step 1: Write the failing stable-option test**

Create `tests/form-options.test.ts` with assertions that Japanese and English labels share one submitted value:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  budgetOptions,
  materialOptions,
  personalRequestTypeOptions,
  personalSetupOptions,
} from '../src/form-options.ts'

test('translated form choices keep stable submitted values', () => {
  assert.deepEqual(personalRequestTypeOptions[1], {
    value: '歌ってみたMV',
    ja: '歌ってみたMV',
    en: 'Cover MV',
  })
  assert.equal(budgetOptions.at(-2)?.value, '25万円以上')
  assert.equal(materialOptions[0].value, '音源あり')
  assert.equal(personalSetupOptions[1].value, '一部協力クリエイター参加可')
})

test('every localized option has a unique non-empty value and both labels', () => {
  for (const options of [
    personalRequestTypeOptions,
    budgetOptions,
    materialOptions,
    personalSetupOptions,
  ]) {
    assert.equal(new Set(options.map((option) => option.value)).size, options.length)
    for (const option of options) {
      assert.ok(option.value)
      assert.ok(option.ja)
      assert.ok(option.en)
    }
  }
})
```

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run:

```powershell
node --test tests/form-options.test.ts
```

Expected: FAIL because `src/form-options.ts` does not exist.

- [ ] **Step 3: Add the localized option model and complete option sets**

Create `src/form-options.ts` with this public shape and arrays covering every translated select and checkbox currently rendered by both forms:

```ts
export type LocalizedOption = {
  value: string
  ja: string
  en: string
}

export const option = (value: string, en: string): LocalizedOption => ({
  value,
  ja: value,
  en,
})

export const personalRequestTypeOptions = [
  option('オリジナルMV', 'Original MV'),
  option('歌ってみたMV', 'Cover MV'),
  option('Shorts / 短尺動画', 'Shorts / Short video'),
  option('Lyric Video', 'Lyric Video'),
  option('その他', 'Other'),
]

export const preferredPlanOptions = [
  option('Riesz Main Standard', 'Riesz Main Standard'),
  option('Riesz Main Flagship', 'Riesz Main Flagship'),
  option('Hybrid Standard', 'Hybrid Standard'),
  option('Hybrid Flagship', 'Hybrid Flagship'),
  option('Partner Plan', 'Partner Plan'),
  option('Short / Light', 'Short / Light'),
  option('相談して決めたい', 'Need advice'),
]

export const budgetOptions = [
  option('5万円〜10万円', 'JPY 50,000-100,000'),
  option('10万円〜15万円', 'JPY 100,000-150,000'),
  option('15万円〜20万円', 'JPY 150,000-200,000'),
  option('20万円〜25万円', 'JPY 200,000-250,000'),
  option('25万円以上', 'JPY 250,000+'),
  option('相談したい', 'Need advice'),
]

export const songLengthOptions = [
  option('〜1分', 'Up to 1 minute'),
  option('1分〜2分', '1-2 minutes'),
  option('2分〜3分', '2-3 minutes'),
  option('3分〜4分', '3-4 minutes'),
  option('4分以上', 'Over 4 minutes'),
  option('未定', 'TBD'),
]

export const materialOptions = [
  option('音源あり', 'Audio ready'),
  option('歌詞あり', 'Lyrics ready'),
  option('イラストあり', 'Illustration ready'),
  option('イラスト差分あり', 'Illustration variations ready'),
  option('ロゴあり', 'Logo ready'),
  option('背景素材あり', 'Background ready'),
  option('まだ未定', 'TBD'),
]

export const personalSetupOptions = [
  option('Riesz本人メインの制作を希望', 'Riesz-led production preferred'),
  option('一部協力クリエイター参加可', 'Collaborator support is acceptable'),
  option('Partner Planも相談可', 'Partner Plan is acceptable'),
  option('内容を見て相談したい', 'Need advice after review'),
]

export const personalPortfolioOptions = [
  option('掲載可', 'Allowed'),
  option('公開後なら掲載可', 'Allowed after release'),
  option('掲載不可（+100,000円〜）', 'Private (+JPY 100,000+)'),
  option('相談したい', 'Need to discuss'),
]

export const businessPortfolioOptions = [
  option('掲載可', 'Allowed'),
  option('公開後なら掲載可', 'Allowed after release'),
  option('掲載不可', 'Private'),
  option('相談したい', 'Need to discuss'),
]

export const projectFileOptions = [
  option('希望しない', 'Not needed'),
  option('希望する（+200,000円〜）', 'Requested (+JPY 200,000+)'),
  option('相談したい', 'Need to discuss'),
]

export const ndaOptions = [
  option('あり', 'Required'),
  option('なし', 'Not required'),
  option('相談したい', 'Need to discuss'),
]

export const corporateCollaboratorOptions = [
  option('Riesz本人メインの制作を希望', 'Riesz-led production preferred'),
  option('一部工程のみ参加可（Hybrid）', 'Limited participation allowed (Hybrid)'),
  option('協力クリエイター主体も相談可（Partner）', 'Partner-led production may be discussed'),
  option('案件内容を見て相談したい', 'Decide after reviewing the project'),
]
```

Keep Japanese as the canonical submitted value whenever the current values differ by language. Update `src/commission-content.ts` to re-export `corporateCollaboratorOptions` from `src/form-options.ts`. Keep `corporateCollaboratorHelper` unchanged.

Update `tests/commission-content.test.ts` to assert the stable collaborator values and both localized labels through the new array shape.

- [ ] **Step 4: Verify the option contracts**

Run:

```powershell
node --test tests/form-options.test.ts
npm run lint
```

Expected: all new tests PASS and lint exits 0.

- [ ] **Step 5: Commit the option model**

```powershell
git add src/form-options.ts src/commission-content.ts tests/form-options.test.ts tests/commission-content.test.ts
git commit -m "Add stable localized form options"
```

### Task 2: Language Persistence and Form-State Safety

**Files:**
- Create: `src/language-preference.ts`
- Modify: `src/App.tsx`
- Test: `tests/language-preference.test.ts`
- Test: `tests/e2e/site-contract.spec.ts`

- [ ] **Step 1: Write failing persistence unit tests**

Create `tests/language-preference.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { readLanguagePreference, writeLanguagePreference } from '../src/language-preference.ts'

test('reads only supported stored languages', () => {
  assert.equal(readLanguagePreference({ getItem: () => 'en' }), 'en')
  assert.equal(readLanguagePreference({ getItem: () => 'fr' }), 'ja')
  assert.equal(readLanguagePreference({ getItem: () => null }), 'ja')
})

test('falls back safely when storage access throws', () => {
  assert.equal(readLanguagePreference({ getItem: () => { throw new Error('blocked') } }), 'ja')
  assert.doesNotThrow(() => writeLanguagePreference({ setItem: () => { throw new Error('blocked') } }, 'en'))
})
```

- [ ] **Step 2: Extend E2E with the current corruption scenario**

Add tests to `tests/e2e/site-contract.spec.ts` that:

```ts
await page.locator('select[name="request_type"]').selectOption('歌ってみたMV')
await page.locator('select[name="preferred_plan"]').selectOption('相談して決めたい')
await page.locator('select[name="production_setup"]').selectOption('一部協力クリエイター参加可')
await page.locator('input[name="materials"][value="音源あり"]').check()
await page.getByRole('button', { name: /EN/ }).click()
await expect(page.locator('select[name="request_type"]')).toHaveValue('歌ってみたMV')
await expect(page.locator('select[name="preferred_plan"]')).toHaveValue('相談して決めたい')
await expect(page.locator('select[name="production_setup"]')).toHaveValue('一部協力クリエイター参加可')
await expect(page.locator('input[name="materials"][value="音源あり"]')).toBeChecked()
```

Add a navigation test that switches to English, follows the primary-navigation Business link, and expects `<html lang="en">` plus the English business H1. Navigate back through the brand link and expect English to remain active.

- [ ] **Step 3: Run the focused tests and confirm expected failures**

Run:

```powershell
node --test tests/language-preference.test.ts
npm run test:e2e -- --grep "language|form selections"
```

Expected: unit test FAILS because the helper is missing; E2E FAILS because selections mutate and route navigation resets to Japanese.

- [ ] **Step 4: Implement guarded persistence and localized labels**

Create `src/language-preference.ts`:

```ts
export type Language = 'ja' | 'en'
export const LANGUAGE_STORAGE_KEY = 'riesz-language'

type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

export function readLanguagePreference(storage: ReadStorage): Language {
  try {
    return storage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'ja'
  } catch {
    return 'ja'
  }
}

export function writeLanguagePreference(storage: WriteStorage, language: Language) {
  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // The visible language still changes when storage is unavailable.
  }
}

export function readBrowserLanguagePreference(): Language {
  try {
    return readLanguagePreference(window.localStorage)
  } catch {
    return 'ja'
  }
}

export function writeBrowserLanguagePreference(language: Language) {
  try {
    writeLanguagePreference(window.localStorage, language)
  } catch {
    // The visible language still changes when storage is unavailable.
  }
}
```

In `src/App.tsx`:

- initialize language with `useState<Lang>(readBrowserLanguagePreference)` so access to the browser storage object itself is guarded;
- call `writeBrowserLanguagePreference(lang)` inside the existing language effect;
- change `Select` and `CheckboxGroup` to receive `LocalizedOption[]` and render `<option value={option.value}>{option[lang]}</option>`;
- use `option.value` as checkbox value and key;
- replace every translated string-array construction with the exported stable option arrays;
- keep text field names, form actions, required attributes, honeypots, and Formspree submission code unchanged;
- keep internal controlled plan and budget values canonical rather than translating the selected value.

- [ ] **Step 5: Fix accessible names in the same interaction boundary**

Change the language button name so it contains its visible label:

```tsx
const destinationLanguage = lang === 'ja' ? 'EN' : 'JP'
<button aria-label={`Switch language to ${destinationLanguage}`}>
  <Languages aria-hidden="true" />
  {destinationLanguage}
</button>
```

Change work-card contact links so the accessible name begins with the visible command:

```tsx
const command = lang === 'ja' ? 'この規模で相談する' : 'Request similar style'
aria-label={`${command}: ${lang === 'ja' ? work.title : work.titleEn}`}
```

- [ ] **Step 6: Verify language behavior and commit**

Run:

```powershell
npm test
npm run test:e2e -- --grep "language|form selections|portfolio preset"
npm run lint
npm run build
```

Expected: all commands exit 0; no React controlled-select warning appears in browser output.

```powershell
git add src/App.tsx src/language-preference.ts tests/language-preference.test.ts tests/e2e/site-contract.spec.ts
git commit -m "Preserve bilingual inquiry state"
```

### Task 3: Quality-Focused Responsive Media Assets

**Files:**
- Replace: `public/media/unknown-mother-goose-hero.mp4`
- Create: `public/media/unknown-mother-goose-hero-mobile.mp4`
- Create: `public/media/unknown-mother-goose-poster.webp`
- Create: `tests/media-assets.test.ts`

- [ ] **Step 1: Write the failing media contract**

Create `tests/media-assets.test.ts` using `statSync` and `spawnSync('ffprobe', ...)`. Parse ffprobe JSON and assert:

```ts
assert.deepEqual(desktop.video, {
  codec_name: 'h264', width: 1920, height: 1080,
  pix_fmt: 'yuv420p', r_frame_rate: '15/1',
})
assert.deepEqual(mobile.video, {
  codec_name: 'h264', width: 960, height: 540,
  pix_fmt: 'yuv420p', r_frame_rate: '15/1',
})
assert.equal(desktop.audioStreams, 0)
assert.equal(mobile.audioStreams, 0)
assert.ok(desktop.size >= 4_800_000 && desktop.size <= 6_500_000)
assert.ok(mobile.size >= 1_900_000 && mobile.size <= 3_200_000)
assert.ok(Math.abs(desktop.duration - mobile.duration) < 0.05)
assert.ok(statSync(posterPath).size < 180_000)
```

- [ ] **Step 2: Run the media test and confirm it fails**

Run:

```powershell
node --test tests/media-assets.test.ts
```

Expected: FAIL because the mobile MP4 and WebP poster do not exist and the desktop MP4 exceeds the target.

- [ ] **Step 3: Generate the desktop and mobile MP4 files**

Create an ignored staging directory and run two-pass quality-focused encodes from the current master file:

```powershell
New-Item -ItemType Directory -Force output/media-encode | Out-Null
ffmpeg -y -i public/media/unknown-mother-goose-hero.mp4 -an -r 15 -c:v libx264 -b:v 3300k -maxrate 4200k -bufsize 6600k -pix_fmt yuv420p -pass 1 -passlogfile output/media-encode/desktop -f mp4 NUL
ffmpeg -y -i public/media/unknown-mother-goose-hero.mp4 -an -r 15 -c:v libx264 -b:v 3300k -maxrate 4200k -bufsize 6600k -pix_fmt yuv420p -pass 2 -passlogfile output/media-encode/desktop -movflags +faststart output/media-encode/hero-desktop.mp4
ffmpeg -y -i public/media/unknown-mother-goose-hero.mp4 -vf scale=960:540 -an -r 15 -c:v libx264 -b:v 1450k -maxrate 1900k -bufsize 2900k -pix_fmt yuv420p -pass 1 -passlogfile output/media-encode/mobile -f mp4 NUL
ffmpeg -y -i public/media/unknown-mother-goose-hero.mp4 -vf scale=960:540 -an -r 15 -c:v libx264 -b:v 1450k -maxrate 1900k -bufsize 2900k -pix_fmt yuv420p -pass 2 -passlogfile output/media-encode/mobile -movflags +faststart output/media-encode/hero-mobile.mp4
Move-Item -Force output/media-encode/hero-desktop.mp4 public/media/unknown-mother-goose-hero.mp4
Move-Item -Force output/media-encode/hero-mobile.mp4 public/media/unknown-mother-goose-hero-mobile.mp4
```

- [ ] **Step 4: Generate the WebP poster**

```powershell
ffmpeg -y -i public/media/unknown-mother-goose-poster.jpg -c:v libwebp -quality 82 -compression_level 6 public/media/unknown-mother-goose-poster.webp
```

- [ ] **Step 5: Verify assets and commit**

Run:

```powershell
node --test tests/media-assets.test.ts
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of json public/media/unknown-mother-goose-hero.mp4
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of json public/media/unknown-mother-goose-hero-mobile.mp4
```

Expected: media test PASS; desktop and mobile match the approved resolution and size bands.

```powershell
git add public/media/unknown-mother-goose-hero.mp4 public/media/unknown-mother-goose-hero-mobile.mp4 public/media/unknown-mother-goose-poster.webp tests/media-assets.test.ts
git commit -m "Add responsive hero media assets"
```

### Task 4: Static Hero for Save-Data and Reduced Motion

**Files:**
- Create: `src/hero-media.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `tests/hero-media.test.ts`
- Test: `tests/e2e/site-contract.spec.ts`

- [ ] **Step 1: Write the failing media-preference unit test**

Create `tests/hero-media.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { shouldRenderStaticHero } from '../src/hero-media.ts'

test('uses a static hero for reduced motion or Save-Data', () => {
  assert.equal(shouldRenderStaticHero({ reducedMotion: true, saveData: false }), true)
  assert.equal(shouldRenderStaticHero({ reducedMotion: false, saveData: true }), true)
  assert.equal(shouldRenderStaticHero({ reducedMotion: false, saveData: false }), false)
})
```

- [ ] **Step 2: Add failing browser coverage for media selection**

Extend `tests/e2e/site-contract.spec.ts` with:

- desktop expects a video with desktop `currentSrc`;
- 390px mobile expects a video with `unknown-mother-goose-hero-mobile.mp4` as `currentSrc`;
- a context created with `reducedMotion: 'reduce'` expects `.hero-visual video` count 0 and a visible static image;
- a context with an init script defining `navigator.connection.saveData = true` expects video count 0 and a visible static image.

- [ ] **Step 3: Run focused tests and confirm expected failures**

```powershell
node --test tests/hero-media.test.ts
npm run test:e2e -- --grep "hero media"
```

Expected: unit test FAILS because the helper is missing; browser tests FAIL because only one desktop source exists and Save-Data is ignored.

- [ ] **Step 4: Implement first-render media preference detection**

Create `src/hero-media.ts` with the pure decision function and guarded browser readers. In `App.tsx`, replace the existing reduced-motion-only hook with a hook whose lazy initial state reads both `matchMedia('(prefers-reduced-motion: reduce)')` and `navigator.connection?.saveData`. Subscribe to reduced-motion changes and to connection changes when supported.

Render static mode as:

```tsx
<picture>
  <source srcSet={heroWork.posterWebp} type="image/webp" />
  <img src={heroWork.image} alt="" />
</picture>
```

Render motion mode as:

```tsx
<video autoPlay loop muted playsInline poster={heroWork.posterWebp} preload="metadata" aria-hidden="true">
  <source src={heroWork.mobileVideo} media="(max-width: 760px)" type="video/mp4" />
  <source src={heroWork.video} type="video/mp4" />
</video>
```

Keep the hero caption and layout markup unchanged.

Update `src/App.css` so `.hero-visual picture` is a block-level wrapper with `width: 100%` and `height: 100%`. Keep the existing image/video `object-fit: cover` behavior.

- [ ] **Step 5: Verify static and responsive media behavior**

```powershell
npm test
npm run test:e2e -- --grep "hero media"
npm run lint
npm run build
```

Expected: all commands exit 0 and the reduced-data tests observe no video element.

- [ ] **Step 6: Commit media behavior**

```powershell
git add src/App.tsx src/App.css src/hero-media.ts tests/hero-media.test.ts tests/e2e/site-contract.spec.ts
git commit -m "Respect responsive and reduced-data hero media"
```

### Task 5: Full Verification, Visual QA, and Delivery

**Files:**
- Modify only if verification exposes a defect in the approved scope.

- [ ] **Step 1: Run the complete automated gate**

```powershell
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
git diff --check
```

Expected: 0 failures, 0 lint errors, successful Vite build, and clean diff check.

- [ ] **Step 2: Capture desktop and mobile hero screenshots**

Run the production preview with the real Formspree endpoints replaced by test endpoints, then use Playwright at 1440x1000 and 390x844. Capture the first viewport after the video has painted. Verify:

- no blank or black media region;
- the same visual crop and caption placement remain legible;
- no header or CTA overlap;
- 320px and 412px pages do not overflow;
- browser console has no errors or React warnings.

- [ ] **Step 3: Re-run mobile Lighthouse against the local production preview**

Run Lighthouse for `/` and `/business/`. Record Performance, Accessibility, Best Practices, SEO, LCP, and total transfer bytes. The required acceptance gate is that the home transfer payload is materially below the previous 15,007 KiB result and no category other than Performance regresses below 100.

- [ ] **Step 4: Review the complete branch diff**

```powershell
git status --short
git diff --stat b9679ca..HEAD
git diff --check b9679ca..HEAD
```

Expected: only approved language, form-option, media, tests, and planning files are present.

- [ ] **Step 5: Integrate while preserving rollback**

After final review, fast-forward `main`, rerun the complete automated gate on merged `main`, push it, and watch the GitHub Pages workflow to completion. Verify the live home and business pages retain language across navigation and deliver the mobile/desktop media expected by their viewport.

The tag `backup-before-language-video-2026-07-12` must remain local and remote throughout cleanup.
