# Pricing Clarity Design

## Goal

Make the public pricing guide understandable to first-time VTuber, VSinger, and corporate visitors by separating two decisions: who leads production, then how deeply the MV is developed. Add explicit corporate consent for collaborator participation and replace the subjective revision boundary with contract-ready wording.

## Approved Scope

### Pricing structure

The section becomes route-first:

1. `Riesz Main`: Riesz leads movie, direction, design, and finishing.
   - `Standard` from JPY 150,000.
   - `Flagship` from JPY 250,000.
2. `Hybrid`: Riesz leads direction and finishing while a trusted collaborator strengthens lyric design or another agreed specialist area.
   - `Standard` from JPY 130,000.
   - `Flagship` from JPY 250,000.
3. `Partner Plan`: collaborator-led production with Riesz direction and quality review, from JPY 50,000.
4. `Short / Light`: shorts, teasers, partial production, and simple edits, around JPY 50,000-100,000.

Each Main and Hybrid tier shows:

- production owner;
- lyric-design owner;
- development level;
- best-fit request;
- one representative public work.

The page must not promise fixed scene counts, turnaround, or deliverables that have not been agreed. It must state that the final scope and price depend on song length, provided materials, deadline, and expression volume.

### Corporate collaborator consent

The business page states that collaborator participation is disclosed and confirmed in advance. The corporate form adds a required `collaborator_participation` field with four levels:

1. Riesz-led production preferred.
2. Hybrid participation in a limited specialist area is acceptable after scope disclosure and prior approval.
3. Partner-led production is also acceptable after scope disclosure and prior approval.
4. Decide after reviewing the project.

Any NDA required for an approved collaborator is handled before unreleased materials are shared.

### Revision policy

Japanese:

> 事前に合意した構成・方向性の範囲内における軽微な修正は、回数上限を設けず対応します。

> 構成変更、演出方針の変更、素材の大幅な差し替え、追加制作、納品後修正は別途お見積もりとなります。

English:

> Minor revisions within the structure and direction agreed before production are handled without a fixed round limit.

> Structural changes, direction changes, major asset replacements, additional production, and post-delivery revisions require an additional estimate.

## Visual Treatment

Preserve the existing dark, sharp, lime-accent identity. Replace the three equal featured cards and incomplete comparison table with two route blocks (`Riesz Main`, `Hybrid`) containing paired tier rows. Keep `Partner Plan` and `Short / Light` in a visually secondary row. On mobile, every tier stacks vertically without horizontal scrolling.

## Verification

- Content tests verify all four Main/Hybrid tiers, representative works, consent options, and exact revision boundaries.
- Existing work-to-contact prefilling must still select matching plan names and budget ranges.
- `npm run lint`, `npm test`, and `npm run build` must pass.
- Desktop and mobile screenshots must show complete pricing and business-form layouts without horizontal overflow.

## Out Of Scope

The mobile hero-video optimization, broader form regrouping, corporate IP-highlight strip, and work-link accessibility labels remain separate P2 work.
