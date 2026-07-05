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

The build outputs both:

- `/`
- `/business/`

## Formspree Setup

Create two Formspree forms:

- `riesz-personal`
- `riesz-business`

Then set these GitHub Actions repository variables or replace the fallback URLs in `src/App.tsx`:

```text
VITE_FORMSPREE_PERSONAL_ENDPOINT=https://formspree.io/f/your-personal-id
VITE_FORMSPREE_BUSINESS_ENDPOINT=https://formspree.io/f/your-business-id
```

Until those endpoints are configured, the rendered forms use placeholder Formspree URLs.

## Analytics Setup

Create a Cloudflare Web Analytics site for `riesz.org`, then set this GitHub Actions repository variable:

```text
VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN=your-cloudflare-web-analytics-token
```

The build only injects the Cloudflare beacon when this variable is set.

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
