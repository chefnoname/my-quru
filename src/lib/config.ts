/**
 * Settings, read from environment variables at build time (see .env.example).
 *
 * NEXT_PUBLIC_FORM_ENDPOINT  The address of a form service that accepts a POST (for example Formspree, Basin or a
 *                            Zapier webhook). While it is empty the page is a design preview: the form sends nothing
 *                            and a strip at the top says so.
 * NEXT_PUBLIC_CONTACT_EMAIL  Shown on the thank-you panel if set.
 * NEXT_PUBLIC_SHOWCASE       "true" for a copy shown to investors: no preview strip, and the thank-you panel shows as
 *                            if the form were real, though nothing is saved.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const SHOWCASE = process.env.NEXT_PUBLIC_SHOWCASE === "true";

/** The form really sends. */
export const LIVE = FORM_ENDPOINT !== "";
/** A design preview: nothing is sent, and the page says so. */
export const PREVIEW = !LIVE && !SHOWCASE;
