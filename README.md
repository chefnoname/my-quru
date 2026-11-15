# Quru landing page

The sign-up page for Quru, an app that tells Muslim sisters where they stand for prayer and fasting, learns their cycle, and puts a teacher in reach for the rest. The page asks for interest only. It takes no payment.

Built with Next.js 16 (App Router), React 19 and TypeScript. It is one static page with no cookies and no analytics.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Settings

Copy `.env.example` to `.env.local`. All three settings are optional, and are read at build time.

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_FORM_ENDPOINT` | The Formspree form the answers go to, like `https://formspree.io/f/xxxxxxxx`. While it is empty the form sends nothing, the thank-you panel says it was a preview, and search engines are asked not to list the page. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the thank-you panel. |
| `NEXT_PUBLIC_SHOWCASE` | `true` for a copy to show investors: the thank-you panel shows without the preview note, though nothing is saved. |

### Where the answers go

Sign-ups are stored in [Formspree](https://formspree.io). Open your form there to read the answers, export them as CSV, or have each one emailed to you. Formspree asks you to confirm by email after the first sign-up.

The form sends these fields as `multipart/form-data`: `name`, `age`, `location`, `email`, `confused_recent`, `price` (`monthly`, `yearly`, `founding`, `custom` or `free`), `price_amount` and `price_period` (only when the price is `custom`), and `consent`. `_gotcha` is Formspree's trap for bots: people never see it, so a filled one means spam.

## Deploy

Any host that runs Next.js works. On Vercel: import the repository, add `NEXT_PUBLIC_FORM_ENDPOINT` under Environment Variables, and deploy.

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
