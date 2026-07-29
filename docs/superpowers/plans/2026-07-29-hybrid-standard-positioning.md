# Hybrid Standard Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise Hybrid Standard to JPY 170,000 and present specialist lyric collaboration as a focused quality improvement while preserving Riesz Main Standard positioning.

**Architecture:** Keep pricing and portfolio facts in their existing typed content modules. Keep work-to-form preset behavior in `App.tsx`, and protect all three contracts with focused unit and browser tests before changing production data.

**Tech Stack:** React 19, TypeScript, Node test runner, Playwright, Vite, GitHub Pages

---

### Task 1: Lock the pricing and attribution contracts

**Files:**
- Modify: `tests/commission-content.test.ts`
- Modify: `tests/portfolio-content.test.ts`

- [ ] **Step 1: Write failing pricing and positioning tests**

Add a test that finds Hybrid Standard and asserts:

```ts
assert.equal(hybridStandard?.priceJa, '170,000円〜')
assert.equal(hybridStandard?.priceEn, 'From JPY 170,000')
assert.match(hybridStandard?.summaryJa ?? '', /リリック|文字演出/)
assert.match(hybridStandard?.summaryJa ?? '', /完成度|強化/)
assert.doesNotMatch(hybridStandard?.summaryJa ?? '', /制作規模を抑え/)
assert.match(hybridStandard?.summaryEn ?? '', /lyric|text/i)
assert.match(hybridStandard?.summaryEn ?? '', /quality|strengthen|specialist/i)
```

Update the existing Kurumi Noah portfolio expectation to:

```ts
client: '胡桃のあ / ぶいすぽっ！',
clientEn: 'Kurumi Noah / VSPO!',
```

- [ ] **Step 2: Run unit tests and verify RED**

Run: `npm test`

Expected: failures show the old JPY 130,000 price, reduced-scope wording, and client names without affiliation.

- [ ] **Step 3: Implement the content changes**

In `src/commission-content.ts`, change Hybrid Standard to JPY 170,000 and replace reduced-scope wording with bilingual copy that says specialist lyric-design participation strengthens lyric and text-expression quality. Preserve Riesz ownership of movie, direction, and finishing.

In `src/portfolio-content.ts`, change only the Kurumi Noah client labels to the approved affiliated names.

- [ ] **Step 4: Run unit tests and verify GREEN**

Run: `npm test`

Expected: all unit tests pass.

### Task 2: Align work-to-form budget behavior

**Files:**
- Modify: `tests/e2e/site-contract.spec.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write a failing browser contract test**

Select the work card tagged `Hybrid Standard` and assert:

```ts
await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Hybrid Standard')
await expect(form.locator('[name="budget"]')).toHaveValue('15万円〜20万円')
```

- [ ] **Step 2: Run the focused browser test and verify RED**

Run: `npx playwright test tests/e2e/site-contract.spec.ts -g "Hybrid Standard"`

Expected: budget assertion fails with the old value `10万円〜15万円`.

- [ ] **Step 3: Implement the preset change**

In `src/App.tsx`, update only the Hybrid Standard preset:

```ts
budgetJa: '15万円〜20万円',
budgetEn: 'JPY 150,000-200,000',
```

- [ ] **Step 4: Run the focused browser test and verify GREEN**

Run: `npx playwright test tests/e2e/site-contract.spec.ts -g "Hybrid Standard"`

Expected: focused test passes.

### Task 3: Validate and release

**Files:**
- Verify: `package-lock.json`
- Verify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Run the clean local gate**

Run in order:

```text
npm ci
npm audit --audit-level=low
npm test
npm run lint
npm run build
npm run test:e2e
git diff --check
```

Expected: zero vulnerabilities, all unit and browser tests pass, lint and production build exit successfully, and no whitespace errors are reported.

- [ ] **Step 2: Verify desktop and mobile behavior**

At 1440px and 390px widths, confirm the Japanese and English prices, Hybrid copy, Kurumi Noah affiliation, selected plan, selected budget, console output, and horizontal overflow.

- [ ] **Step 3: Commit and integrate**

Commit the implementation without changing unrelated content, fast-forward it into `main`, and rerun the clean gate on the integrated commit.

- [ ] **Step 4: Deploy and verify production**

Push `main`, wait for the exact GitHub Pages run to succeed, then verify `https://riesz.org/` in a fresh browser context. Confirm local HEAD, remote `main`, and the deployed commit agree.
