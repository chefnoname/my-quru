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
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where the form POSTs its answers, for example a Formspree, Basin or Zapier webhook address. While it is empty the page is a design preview: the form sends nothing, a strip at the top says so, and search engines are asked not to list the page. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the thank-you panel. |
| `NEXT_PUBLIC_SHOWCASE` | `true` for a copy to show investors: no preview strip, and the thank-you panel shows, though nothing is saved. |

The form sends these fields as `multipart/form-data`: `name`, `age`, `location`, `email`, `confused_recent`, `price` (`monthly`, `yearly`, `founding`, `custom` or `free`), `price_amount` and `price_period` (only when the price is `custom`), and `consent`. `_gotcha` is an empty trap for bots.

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
