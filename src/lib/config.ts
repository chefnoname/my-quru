/**
 * Settings, read from environment variables at build time (see .env.example).
 *
 * NEXT_PUBLIC_FORM_ENDPOINT  The Formspree form the answers go to, like https://formspree.io/f/xxxxxxxx. While it is
 *                            empty the form sends nothing, and the thank-you panel says it was a preview.
 * NEXT_PUBLIC_CONTACT_EMAIL  Shown on the thank-you panel if set.
 * NEXT_PUBLIC_SHOWCASE       "true" for a copy shown to investors: the thank-you panel shows without the preview
 *                            note, though nothing is saved.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const SHOWCASE = process.env.NEXT_PUBLIC_SHOWCASE === "true";

/** The form really sends. */
export const LIVE = FORM_ENDPOINT !== "";
/** A design preview: nothing is sent, and the thank-you panel says so. */
export const PREVIEW = !LIVE && !SHOWCASE;
