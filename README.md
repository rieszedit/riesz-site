# Riesz Site

Portfolio and commission site for `riesz.org`.

## Stack

- Vite
- React
- TypeScript
- GitHub Pages
- Formspree for form delivery

## Local Development

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

The build outputs:

- `/`
- `/business/`
- `/privacy/`

## Formspree Setup

Create two Formspree forms:

- `riesz-personal`
- `riesz-business`

Set these GitHub Actions repository variables (or a git-ignored `.env.local` for development):

```text
VITE_FORMSPREE_PERSONAL_ENDPOINT=https://formspree.io/f/your-personal-id
VITE_FORMSPREE_BUSINESS_ENDPOINT=https://formspree.io/f/your-business-id
VITE_TURNSTILE_SITE_KEY=your-public-turnstile-site-key
```

Production deployment rejects unconfigured endpoints or a missing Turnstile site key. Enable Turnstile CAPTCHA in both Formspree forms with the matching secret. The secret belongs only in Formspree, never in source, VITE variables, or GitHub build output. Leave the site key blank for offline local tests; never disable the server-side verification as a development workaround.

See [Inquiry operations](docs/inquiry-operations.md) for receipt checks, spam protection, incident handling and rollback.

## Analytics Setup

Create a Cloudflare Web Analytics site for `riesz.org`, then set this GitHub Actions repository variable:

```text
VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN=your-cloudflare-web-analytics-token
```

The build only injects the Cloudflare beacon when this variable is set.
No additional analytics service or form-abandonment tracking is used. Compare Cloudflare aggregate visits with genuine Formspree receipts for the same period, excluding test and duplicate messages.

## Verification

```powershell
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

Browser tests build a production preview with mocked Formspree endpoints and no live analytics/CAPTCHA. No customer inquiry is sent by this suite. Real delivery through CAPTCHA, Formspree, and Gmail is a separate manual release check.

## Search Console Setup

The site publishes:

- `https://riesz.org/sitemap.xml`
- `https://riesz.org/robots.txt`

Recommended Search Console setup:

1. Add a Domain property for `riesz.org`.
2. Verify ownership with a DNS TXT record in Cloudflare.
3. Submit `https://riesz.org/sitemap.xml` in the Sitemaps report.

If using URL prefix verification instead, get the HTML tag or HTML file from Search Console and add it to the site before verifying.

## Domain

The `public/CNAME` file contains:

```text
riesz.org
```

Cloudflare DNS for GitHub Pages apex domain:

```text
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   rieszedit.github.io
```

Enable GitHub Pages with the GitHub Actions source after pushing.
