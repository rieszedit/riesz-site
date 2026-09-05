const required = {
  VITE_FORMSPREE_PERSONAL_ENDPOINT: /^https:\/\/formspree\.io\/f\/xrewapoe$/,
  VITE_FORMSPREE_BUSINESS_ENDPOINT: /^https:\/\/formspree\.io\/f\/mbdvagpg$/,
  VITE_TURNSTILE_SITE_KEY: /^0x[\w-]+$/,
  VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN: /^[a-f0-9]{32}$/,
}
for (const [name, pattern] of Object.entries(required)) {
  if (!pattern.test(process.env[name] ?? '')) {
    throw new Error(`Missing or unexpected production configuration: ${name}`)
  }
}
console.log(
  'Production form, bot-protection and analytics configuration verified.',
)
