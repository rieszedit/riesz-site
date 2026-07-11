# Corporate Proof and Form Grouping Design

## Goal

Strengthen trust for corporate, IP, VTuber, and VSinger clients before they reach the inquiry form, and make both inquiry forms easier to scan without changing what Formspree receives.

## Approved Page Structure

The business page uses this order:

1. Business hero and current contract-readiness panel.
2. Independent public corporate-work section.
3. Business project flow.
4. Business inquiry form.

The public-work section is not part of the form. Its purpose is to let a corporate visitor confirm public IP experience and Riesz's responsibility before deciding to inquire.

## Corporate Work Section

Show these three already-public projects:

1. `神っぽいな` / Project SEKAI / `Movie / Lyric Video`.
2. `メクルメ` / THE IDOLM@STER / `Lyric Video / Direction`.
3. `紡ぐ時間` / Blue Archive / `Movie / Direction: Riesz`, with the existing lyric-design collaborator note.

Each entry includes the public YouTube thumbnail, project title, client or IP name, Riesz's public role, relevant collaborator note when present, and a link to the public video. Do not add client logos, confidential claims, view counts, or claims not already supported by the public portfolio.

The visual treatment is an editorial full-width list rather than a set of decorative cards. On desktop, each entry is a horizontal row with a thumbnail and aligned project metadata. On mobile, the row stacks without horizontal scrolling. The section keeps the current sharp dark surface, thin rules, white type, and lime accent.

The existing business hero panel remains the concise operational trust summary for invoice payment, purchase orders, contracts, NDA handling, usage confirmation, collaborator approval, and possible advance payment for external production costs.

## Form Grouping

Both forms stay on one page. They do not become accordions, tabs, or multi-step forms. Existing field names, required flags, option values, Formspree endpoints, honeypot behavior, prefilling behavior, success states, and email subjects remain unchanged.

### Personal form

1. `ご連絡先 / Contact`
   - Name / artist name, email, Discord ID, X ID.
2. `ご依頼内容 / Request`
   - Request type, preferred plan, budget range.
3. `納期・素材 / Schedule & Materials`
   - Preferred delivery date, planned release date, song length, available materials, reference video URL, material URL.
4. `制作条件 / Production Terms`
   - Production setup, portfolio visibility, project-file delivery, additional notes.

### Business form

1. `ご連絡先 / Contact`
   - Company, contact person, email, company website.
2. `案件概要 / Project`
   - Project summary, usage scope, release media, reference-material URL.
3. `納期・素材 / Schedule & Materials`
   - Preferred delivery date, planned release date, budget range, material URL.
4. `契約・制作条件 / Contract & Production`
   - Portfolio visibility, NDA / contract, collaborator participation, invoice payment terms, project-file delivery, additional notes.

Each group has a two-digit number, bilingual or language-switched heading, and a thin separator. Groups are unframed page sections inside the form, not nested cards. Existing two-column field rows remain where useful and collapse to one column on mobile.

The work-reference preset notice remains above the personal form groups. Submit buttons and submit-status messages remain after the final group.

## Component Boundaries

- `BusinessExperienceSection` selects the three existing public corporate or major-IP work items and renders the editorial list.
- `FormSection` supplies a stable numbered heading and layout wrapper for a group of existing fields.
- Existing `Field`, `Select`, `TextArea`, and `CheckboxGroup` components remain the source of form-control behavior.
- Existing Formspree submit handling remains unchanged.

## Accessibility and Responsive Behavior

- Each work entry has a descriptive link label based on its title.
- Form group headings use semantic section headings and stable `aria-labelledby` relationships.
- Keyboard order remains the same as the visual order.
- Interactive targets remain at least 44px high.
- Desktop, 412px mobile, and 320px content-width checks must show no horizontal overflow.

## Verification

- Run `npm test`, `npm run lint`, and `npm run build`.
- Confirm all three corporate work links and public role labels render in Japanese and English.
- Compare every form control's `name` and `required` state before and after grouping.
- Verify personal work-prefill behavior still fills plan, budget, and reference URL.
- Verify both Formspree forms still reach their existing success states.
- Capture desktop and mobile screenshots of the corporate-work section and both grouped forms.

## Out of Scope

- Zaraz custom-event tracking remains a separate analytics change because it requires Cloudflare dashboard trigger setup.
- Hero-video re-encoding and responsive source selection remain a separate performance change.
- No form fields are removed or made optional in this change.
- No non-public client names, logos, or project details are added.
