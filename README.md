# Quru landing page

The sign-up page for Quru, an app that tells Muslim sisters where they stand for prayer and fasting, learns their cycle, and puts a teacher in reach for the rest. The page asks for interest only. It takes no payment.

Built with Next.js 16 (App Router), React 19 and TypeScript. It is one static page. Analytics (Microsoft Clarity) load only when `NEXT_PUBLIC_CLARITY_ID` is set.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Settings

None are needed to go live. To change one, copy `.env.example` to `.env.local`. They are read at build time.

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where the answers go. By default, Quru's Formspree form (`https://formspree.io/f/xvkakrqy`, set in `src/lib/config.ts`). Set another Formspree address to use a different form, or `off` for a design preview: the form sends nothing, the thank-you panel says so, and search engines are asked not to list the page. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the thank-you panel. |
| `NEXT_PUBLIC_SHOWCASE` | `true` for a copy to show investors: the form never sends, and the thank-you panel shows without a preview note. |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID. Turns on heatmaps and session replays, so you can see where visitors stop before the form. Empty means no analytics. Never loads when `NEXT_PUBLIC_SHOWCASE` is `true`. |

### Analytics

1. Sign in at [clarity.microsoft.com](https://clarity.microsoft.com), add a project with the site's address.
2. Copy the project ID from Settings > Overview (the code after `/tag/` in the install snippet).
3. Set `NEXT_PUBLIC_CLARITY_ID` on the host (on Vercel: Settings > Environment Variables) and redeploy.

The sign-up form is masked (`data-clarity-mask`), so replays never show what a sister typed or picked. Clarity sets cookies, so a privacy notice should say the site uses it.

### Where the answers go

Sign-ups are stored in [Formspree](https://formspree.io). Open your form there to read the answers, export them as CSV, or have each one emailed to you. Formspree asks you to confirm by email after the first sign-up.

The form sends these fields as `multipart/form-data`: `name`, `age`, `location`, `email`, `confused_recent`, `price` (`monthly`, `yearly`, `founding`, `custom` or `free`), `price_amount` and `price_period` (only when the price is `custom`), and `consent`. `_gotcha` is Formspree's trap for bots: people never see it, so a filled one means spam.

## Deploy

Any host that runs Next.js works. On Vercel: import the repository and deploy. Sign-ups go to Formspree straight away, including from `npm run dev`, so use `NEXT_PUBLIC_FORM_ENDPOINT=off` in `.env.local` when you don't want test entries.

## Where things are

```
src/app/layout.tsx          fonts, title, description, the site icon
src/app/page.tsx            the page, section by section
src/app/globals.css         all styles, with the Lilac colour tokens at the top
src/components/sections/    Hero, Engine, Prices, Faq, Join, Footer, PreviewStrip
src/components/             the moving parts: header, rotating question, example answer,
                            TahaaraEngine tooltip, FAQ item, price buttons, sign-up form
src/lib/config.ts           the three settings above
public/app-screens.webp     early designs of the app
```

Motion is switched off for anyone whose device asks for less movement. The fonts (Readex Pro and Markazi Text, both under the SIL Open Font Licence) are served from this site, so the page never calls Google.
