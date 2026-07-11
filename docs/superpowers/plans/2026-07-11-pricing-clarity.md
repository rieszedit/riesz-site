# Pricing Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild pricing around production routes, collect corporate collaborator consent, and publish an objective revision boundary.

**Architecture:** Move commission-facing copy and pricing metadata into a pure TypeScript content module so Node's built-in test runner can verify the public contract. `App.tsx` renders the content through the existing React and bilingual patterns, while `App.css` provides route and tier layouts using the current visual tokens.

**Tech Stack:** React 19, TypeScript, CSS Grid/Flexbox, Node 24 built-in test runner, Vite.

---

### Task 1: Contract tests

**Files:**
- Create: `tests/commission-content.test.ts`
- Modify: `package.json`

- [x] Add a `test` script that runs `node --test tests/*.test.ts`.
- [x] Write tests importing `pricingRoutes`, `supportPlans`, `corporateCollaboratorOptions`, `notesJa`, and `notesEn` from `src/commission-content.ts`.
- [x] Assert that Main and Hybrid each expose Standard and Flagship, all tiers include a representative work, the corporate field exposes all four consent levels, and the old phrase `常識の範囲内` is absent.
- [x] Run `npm test` and confirm failure because `src/commission-content.ts` does not exist.

### Task 2: Content model

**Files:**
- Create: `src/commission-content.ts`
- Modify: `src/App.tsx`

- [x] Define typed bilingual route, tier, support-plan, and option records using the exact approved copy from the design spec.
- [x] Export the revision notes and corporate collaborator options.
- [x] Import these exports in `App.tsx` and remove the superseded `featuredPlans`, `secondaryPlans`, `planComparisonRows`, `notesJa`, and `notesEn` constants.
- [x] Run `npm test` and confirm all content-contract tests pass.

### Task 3: Route-first pricing UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [x] Render an introductory two-step chooser: `1. 制作主導` then `2. 作り込み量`.
- [x] Render `Riesz Main` and `Hybrid` as route blocks, with Standard and Flagship tier rows containing owner, lyric-design owner, development level, best fit, and representative-work link.
- [x] Render Partner and Short / Light as secondary alternatives.
- [x] Remove the incomplete comparison table and redundant Hybrid note.
- [x] Keep existing plan names unchanged so work-card contact prefilling continues to work.

### Task 4: Corporate consent and revision wording

**Files:**
- Modify: `src/App.tsx`

- [x] Add the business-panel statement that collaborator scope is disclosed and approved before participation.
- [x] Add required select `collaborator_participation` after the NDA / contract field, populated from `corporateCollaboratorOptions`.
- [x] Render the objective bilingual revision wording through the imported notes arrays.

### Task 5: Verification and release

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/App.css`
- Verify: `src/commission-content.ts`
- Verify: `tests/commission-content.test.ts`

- [x] Run `npm test` and confirm zero failures.
- [x] Run `npm run lint` and confirm zero errors.
- [x] Run `npm run build` and confirm a production bundle is emitted.
- [x] Inspect desktop pricing, mobile pricing, and desktop/mobile business form screenshots.
- [x] Verify the pricing and business pages have no horizontal document overflow.
- [x] Commit and push the verified changes to `main`, then confirm the GitHub Pages deployment succeeds.
