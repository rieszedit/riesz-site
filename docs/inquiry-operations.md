# Inquiry Operations

## Architecture and limits

- Static GitHub Pages frontend -> Formspree archive -> Gmail notification.
- Individual and corporate inquiries use separate Formspree forms.
- Each inquiry carries `submission_id` and a subject containing the existing personal/business prefix, the requester name and a unique reference. Keep these prefixes compatible with the Gmail inquiry-label filter.
- A positive Formspree response confirms provider acceptance, not inbox placement or that Riesz has read or replied.
- Timeout or connection failure means receipt is unknown. Do not automatically retry. Keep the reference when checking via email so duplicates can be reconciled.
- The site does not persist inquiry text in browser storage. Failed input remains in the current page; users can copy it or compose an email. Reloading discards unsaved input.

## Spam protection

1. Keep Form Enabled and Submission Archive enabled in both forms.
2. Enable Turnstile CAPTCHA in Formspree with the matching secret. The site key is public and belongs in `VITE_TURNSTILE_SITE_KEY`; the secret stays in Formspree only.
3. Deploy the frontend widget before enabling server CAPTCHA. Test actual verified submission and rejection of missing/invalid tokens.
4. Only after the above succeeds, turn off Formshield content classification if avoiding silent content-based false positives. Turnstile is bot protection, not a guarantee against human spam. Re-check inbox volume and provider quota.
5. Keep notification Email actions enabled with the intended recipient. Do not use a client honeypot that silently drops real visitors.
6. Verify each form's archive and Gmail receipt independently. Subject prefixes alone do not guarantee the Gmail filter matched; inspect the received label.

## Daily inbox check

1. Review Gmail's inquiry label and record which genuine inquiries have been replied to. Read/unread and thread count are not reliable reply-status records.
2. Check Formspree Inbox AND Spam for both forms. Match new genuine submissions to Gmail by inquiry reference; legacy inquiries require sender and time matching.
3. If Formspree has a real inquiry without email, handle it from the archive and investigate the notification workflow. Do not delete the evidence.
4. If neither archive nor Gmail has a claimed submission, ask for approximate time and reference. Unrecorded submissions cannot be recovered or ruled out from the current archive alone.
5. Check account usage limits, recipient verification and service notices. Archive retention depends on the current plan; export needed records securely before expiry, outside this public repository.

This is an operator checklist, not an automatic monitoring service. No new scheduled job is installed.

## Monthly measurement

- Cloudflare Web Analytics: select `riesz.org`, a fixed reporting period, and record visits, page views, referrers and device breakdown. Keep bot filters and timezone consistent. Note the sampling rate. Visits are not unique people.
- Formspree: count genuine individual + corporate receipts for the same interval. Exclude our tests, spam and duplicate retries. Include legitimate inquiries that were incorrectly classified as spam.
- Keep direct-email inquiries separately, and record estimates and confirmed commissions if evaluating commercial outcomes.
- `genuine form receipts / visits` is an approximate operational ratio, not person-level conversion attribution. Form abandonment and exact source-to-customer attribution are not measured.
- Revisit real-user CLS after the release. Local browser stability tests do not prove every visitor's CLS is good.

## Release and rollback

The automated release gate runs lint, unit tests and browser tests before the final production build. The browser suite uses mocked delivery; the live verification is separate and must confirm both archive storage and Gmail receipt.

Pre-change restore point: `backup-before-intake-improvements-2026-09-05` (`905fc0b9a1bdf158766de4f3d83400e5fdfe26af`).

Before deploying an older frontend that has no Turnstile widget, re-enable Formshield and disable CAPTCHA in BOTH Formspree forms. Otherwise the old site will be blocked by the new server-side CAPTCHA requirement. Coordinate the setting change and rollback; never leave both protections disabled. Restore source with a reviewed revert commit, not a force-push or hard reset.

## Contract review

The published notes distinguish agreed minor revisions, production-error correction, scope changes, final-art preparation, cancellation settlement and third-party file licenses. Confirm exact scope, review period, usage rights, tax treatment and non-cancellable external costs in each quote. These pages are not a substitute for project-specific legal or tax review.

References:

- [Formspree Turnstile integration](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile)
- [Cloudflare widget rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [NTA total-price display](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6902.htm)
- [CAA Consumer Contract Act commentary](https://www.caa.go.jp/policies/policy/consumer_system/consumer_contract_act/annotations)
