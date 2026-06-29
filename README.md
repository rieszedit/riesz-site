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
