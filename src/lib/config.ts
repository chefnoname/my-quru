/**
 * Settings, read from environment variables at build time (see .env.example). None are needed to go live.
 *
 * NEXT_PUBLIC_FORM_ENDPOINT  Where the answers go. By default, Quru's Formspree form. Set another
 *                            https://formspree.io/f/... address to use a different form, or "off" for a design
 *                            preview that sends nothing (its thank-you panel says so).
 * NEXT_PUBLIC_CONTACT_EMAIL  Shown on the thank-you panel if set.
 * NEXT_PUBLIC_SHOWCASE       "true" for a copy shown to investors: the form never sends, and the thank-you panel
 *                            shows without a preview note.
 * NEXT_PUBLIC_CLARITY_ID     Microsoft Clarity project for heatmaps and session replays. By default, Quru's project.
 *                            Set another ID to use a different project, or "off" for no analytics. Never loads on
 *                            the investor copy.
 */

/** Quru's sign-up list on Formspree. */
const QURU_FORM = "https://formspree.io/f/xvkakrqy";

const endpointSetting = process.env.NEXT_PUBLIC_FORM_ENDPOINT || QURU_FORM;
export const FORM_ENDPOINT = endpointSetting === "off" ? "" : endpointSetting;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const SHOWCASE = process.env.NEXT_PUBLIC_SHOWCASE === "true";
/** Quru's Microsoft Clarity project. The ID is public: it appears in the page's script anyway. */
const QURU_CLARITY = "zeqcdd2y9f";
const claritySetting = process.env.NEXT_PUBLIC_CLARITY_ID || QURU_CLARITY;
/** Clarity project ID, or "" for none. Only letters and digits are kept, since it is written into a script. */
export const CLARITY_ID = SHOWCASE || claritySetting === "off" ? "" : claritySetting.replace(/[^a-z0-9]/gi, "");

/** The form really sends. */
export const LIVE = FORM_ENDPOINT !== "" && !SHOWCASE;
/** A design preview: nothing is sent, and the thank-you panel says so. */
export const PREVIEW = FORM_ENDPOINT === "" && !SHOWCASE;
