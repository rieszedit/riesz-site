# Corporate Proof and Form Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent corporate-work proof section and reorganize both inquiry forms into four scannable groups without changing submission contracts.

**Architecture:** Extract the shared portfolio records from `App.tsx` into a pure TypeScript content module so the corporate subset can be tested without a browser. Render the corporate subset through a dedicated editorial-list component, then wrap the existing form controls in a reusable semantic `FormSection`; Formspree handlers, field names, required flags, values, and preset state remain unchanged.

**Tech Stack:** React 19, TypeScript 6, CSS Grid/Flexbox, Node 24 built-in test runner, Vite 8, Playwright CLI.

---

### Task 1: Testable portfolio content

**Files:**
- Create: `tests/portfolio-content.test.ts`
- Create: `src/portfolio-content.ts`
- Modify: `src/App.tsx:1-210`

- [ ] **Step 1: Write the failing portfolio-contract test**

Create `tests/portfolio-content.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { businessWorks, works } from '../src/portfolio-content.ts'

test('keeps the complete public portfolio in its existing order', () => {
  assert.equal(works.length, 11)
  assert.deepEqual(works.slice(0, 3).map((work) => work.title), [
    '神っぽいな',
    'メクルメ',
    '紡ぐ時間',
  ])
})

test('selects exactly the approved public corporate works', () => {
  assert.deepEqual(
    businessWorks.map((work) => ({
      title: work.title,
      clientEn: work.clientEn,
      role: work.role,
      url: work.url,
    })),
    [
      {
        title: '神っぽいな',
        clientEn: 'Project SEKAI',
        role: 'Movie / Lyric Video',
        url: 'https://www.youtube.com/watch?v=vIHCFGj_G2E',
      },
      {
        title: 'メクルメ',
        clientEn: 'THE IDOLM@STER',
        role: 'Lyric Video / Direction',
        url: 'https://www.youtube.com/watch?v=DLkNQgh4Ons',
      },
      {
        title: '紡ぐ時間',
        clientEn: 'Blue Archive',
        role: 'Movie / Direction: Riesz',
        url: 'https://www.youtube.com/watch?v=Qdz7nMfg1L8',
      },
    ],
  )
})
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `npm test`

Expected: FAIL because `src/portfolio-content.ts` does not exist.

- [ ] **Step 3: Create the portfolio content module**

Create `src/portfolio-content.ts` with the current `WorkItem` type and all eleven `works` records copied exactly from `App.tsx`. Add `businessFeatured?: boolean` to `WorkItem`, set it to `true` only on `神っぽいな`, `メクルメ`, and `紡ぐ時間`, and export:

```ts
export const businessWorks = works.filter((work) => work.businessFeatured)
```

Do not change titles, tags, URLs, images, role text, collaborator notes, or portfolio order.

- [ ] **Step 4: Consume the new module from App**

In `src/App.tsx`, remove the local `WorkItem` type and `works` array, then add:

```ts
import { businessWorks, works } from './portfolio-content'
import type { WorkItem } from './portfolio-content'
```

Keep `createWorkContactPreset()` and all existing portfolio rendering behavior unchanged.

- [ ] **Step 5: Verify and commit the extraction**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, lint exits with zero errors, and Vite emits both HTML entries.

Commit:

```bash
git add src/App.tsx src/portfolio-content.ts tests/portfolio-content.test.ts
git commit -m "Extract portfolio content for corporate proof"
```

### Task 2: Independent corporate experience section

**Files:**
- Modify: `src/App.tsx:493-554`
- Modify: `src/App.css:365-478,1083-1115,1166-1360`
- Modify: `tests/responsive-css.test.ts`

- [ ] **Step 1: Add a failing responsive-style contract**

Extend `tests/responsive-css.test.ts`:

```ts
test('stacks corporate work rows without horizontal overflow on mobile', () => {
  const mobileStart = css.indexOf('@media (max-width: 760px)')
  const mobileEnd = css.indexOf('@media (max-width: 360px)', mobileStart)
  const mobileCss = css.slice(mobileStart, mobileEnd)

  assert.match(
    mobileCss,
    /\.business-work-row\s*{[^}]*grid-template-columns:\s*1fr;/s,
  )
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test`

Expected: FAIL because the mobile `.business-work-row` rule does not exist.

- [ ] **Step 3: Render the business experience section**

Add `BusinessExperienceSection` before `HoneypotField` in `src/App.tsx`. It must:

- render a `content-section business-work-section` section;
- use `Selected Corporate Work / 法人・大型IPの公開実績` in Japanese and `Selected Corporate Work / Public Corporate and Major-IP Work` in English;
- map `businessWorks` in their approved order;
- render one full-width `<article className="business-work-row">` per work;
- render the thumbnail, title, client/IP, `role`, optional localized collaborator note, tags, and a descriptive YouTube link using `ArrowUpRight`;
- use the existing public YouTube URLs and `target="_blank" rel="noreferrer"`.

Call it in `BusinessPage` directly after `</section>` for `.business-hero` and before `FlowSection`:

```tsx
<BusinessExperienceSection lang={lang} />
```

- [ ] **Step 4: Add editorial desktop and mobile styles**

Add CSS with these stable tracks:

```css
.business-work-list {
  border-top: 1px solid rgba(243, 246, 239, 0.16);
}

.business-work-row {
  display: grid;
  grid-template-columns: minmax(220px, 0.62fr) minmax(0, 1fr) minmax(220px, 0.72fr) 44px;
  gap: 24px;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid rgba(243, 246, 239, 0.16);
  padding: 22px 0;
}
```

Use a stable 16:9 thumbnail, existing display/UI fonts, lime labels, and an icon-only 44px external-link target with an accessible label. At `max-width: 760px`, set `.business-work-row { grid-template-columns: 1fr; gap: 14px; }`, make the thumbnail full width, and keep metadata unframed.

- [ ] **Step 5: Verify and commit the section**

Run: `npm test && npm run lint && npm run build`

Expected: all commands pass.

Commit:

```bash
git add src/App.tsx src/App.css tests/responsive-css.test.ts
git commit -m "Add public corporate work section"
```

### Task 3: Reusable form grouping and personal form

**Files:**
- Modify: `src/App.tsx:888-1063,1201-1330`
- Modify: `src/App.css:931-1066,1213-1354`
- Create: `tests/form-layout.test.ts`

- [ ] **Step 1: Add a failing source contract for the four approved personal group IDs**

Create `tests/form-layout.test.ts`:

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')

test('defines the approved personal form groups', () => {
  for (const id of [
    'personal-contact',
    'personal-request',
    'personal-schedule',
    'personal-terms',
  ]) {
    assert.match(source, new RegExp(`id="${id}"`))
  }
})

test('keeps both Formspree actions and honeypots in place', () => {
  assert.match(source, /action={formEndpoints\.personal}/)
  assert.match(source, /action={formEndpoints\.business}/)
  assert.equal(source.match(/<HoneypotField \/>/g)?.length, 2)
})
```

- [ ] **Step 2: Run the test and confirm group IDs are missing**

Run: `npm test`

Expected: FAIL on the first missing group ID.

- [ ] **Step 3: Add the reusable FormSection component**

Add this component before `Field`:

```tsx
function FormSection({
  id,
  number,
  title,
  subtitle,
  children,
}: {
  id: string
  number: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  const headingId = `${id}-heading`

  return (
    <section className="form-section" id={id} aria-labelledby={headingId}>
      <header className="form-section__heading">
        <span>{number}</span>
        <div>
          <h3 id={headingId}>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <div className="form-section__fields">{children}</div>
    </section>
  )
}
```

Import `ReactNode` as a type from React.

- [ ] **Step 4: Group the personal form controls without changing their contracts**

Keep hidden inputs and `contact-preset` above the groups. Wrap the unchanged controls in:

- `personal-contact`, `01`, `ご連絡先 / Contact`;
- `personal-request`, `02`, `ご依頼内容 / Request`;
- `personal-schedule`, `03`, `納期・素材 / Schedule & Materials`;
- `personal-terms`, `04`, `制作条件 / Production Terms`.

Keep the submit button and `ContactSubmitStatus` after all four sections. Do not change any `name`, `required`, options, controlled values, or handlers.

- [ ] **Step 5: Style the grouped form as unframed sections**

Add:

```css
.form-section {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 24px;
  border-top: 1px solid rgba(243, 246, 239, 0.14);
  padding: 24px 0;
}

.form-section__fields {
  display: grid;
  gap: 16px;
  min-width: 0;
}
```

Style the number, heading, and subtitle with existing tokens. At `max-width: 760px`, change `.form-section` to one column and reduce its gap. Do not add rounded cards or collapsible behavior.

- [ ] **Step 6: Verify and commit the personal grouping**

Run: `npm test && npm run lint && npm run build`

Expected: all commands pass.

Commit:

```bash
git add src/App.tsx src/App.css tests/form-layout.test.ts
git commit -m "Group personal inquiry fields"
```

### Task 4: Business form grouping

**Files:**
- Modify: `src/App.tsx:1065-1199`
- Modify: `tests/form-layout.test.ts`

- [ ] **Step 1: Add the failing business-group contract**

Extend `tests/form-layout.test.ts`:

```ts
test('defines the approved business form groups', () => {
  for (const id of [
    'business-contact',
    'business-project',
    'business-schedule',
    'business-terms',
  ]) {
    assert.match(source, new RegExp(`id="${id}"`))
  }
})
```

- [ ] **Step 2: Run the test and confirm business group IDs are missing**

Run: `npm test`

Expected: FAIL on `business-contact`.

- [ ] **Step 3: Wrap the unchanged business controls in the four approved sections**

Keep the hidden subject and `HoneypotField` above the groups. Use:

- `business-contact`, `01`, `ご連絡先 / Contact`;
- `business-project`, `02`, `案件概要 / Project`;
- `business-schedule`, `03`, `納期・素材 / Schedule & Materials`;
- `business-terms`, `04`, `契約・制作条件 / Contract & Production`.

Place fields exactly as specified in the design document. Keep the submit button and `ContactSubmitStatus` after the final section. Do not change `collaborator_participation`, its helper copy, Formspree action, or required flags.

- [ ] **Step 4: Verify all automated contracts**

Run: `npm test && npm run lint && npm run build`

Expected: all commands pass.

- [ ] **Step 5: Commit the business grouping**

```bash
git add src/App.tsx tests/form-layout.test.ts
git commit -m "Group business inquiry fields"
```

### Task 5: Browser verification and release

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/App.css`
- Verify: `src/portfolio-content.ts`
- Verify: `tests/*.test.ts`

- [ ] **Step 1: Record the rendered form contracts before submission tests**

Start preview:

```powershell
$env:VITE_FORMSPREE_PERSONAL_ENDPOINT = 'https://formspree.io/f/test-personal'
$env:VITE_FORMSPREE_BUSINESS_ENDPOINT = 'https://formspree.io/f/test-business'
npm run build
npm run preview -- --host 127.0.0.1 --port 4176
```

Use Playwright CLI at desktop 1440x1000 and mobile 412x915. For each form, evaluate every control's `name`, `required`, and option values. Confirm the names match the pre-change forms and the business form includes `collaborator_participation`.

- [ ] **Step 2: Verify the personal preset flow**

Click `この規模で相談する` on a Flagship work and confirm:

- the page scrolls to Contact;
- preferred plan is `Riesz Main Flagship`;
- budget is `25万円以上`;
- reference URL is the clicked work URL.

- [ ] **Step 3: Verify visual and responsive behavior**

Capture:

- desktop and mobile corporate experience section;
- desktop and mobile personal grouped form;
- desktop and mobile business grouped form;
- Japanese and English views.

Assert `document.documentElement.scrollWidth === document.documentElement.clientWidth` at 412px and at a 320px content width. Confirm no form heading, select, role text, or work title is truncated.

- [ ] **Step 4: Verify Formspree payloads and success states without real submissions**

Use Playwright routing to intercept `https://formspree.io/f/test-personal` and `https://formspree.io/f/test-business`, record each request's `FormData` field names, and fulfill each request with HTTP 200 JSON. Submit each form with non-sensitive test values. Confirm both show the existing success message and that no field is omitted from the request payload. Do not send requests to the live Formspree endpoints and do not record names, email addresses, or free-text form contents in test artifacts.

- [ ] **Step 5: Run final checks**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected: all tests pass, lint/build succeed, diff check has no whitespace errors, and only intended files are changed.

- [ ] **Step 6: Merge and deploy with the rollback point preserved**

The immutable rollback tag is `backup-before-corporate-proof-2026-07-11` at commit `b2e26ef`. Merge the verified feature branch into `main` without deleting or moving that tag, push `main`, wait for the GitHub Pages workflow, and verify `https://riesz.org` serves the three corporate works and all eight form group IDs.
