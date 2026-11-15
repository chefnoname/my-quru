import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { LIVE } from "@/lib/config";
import "./globals.css";

/* Both fonts are variable and served from this site, so the page never calls Google. Licences sit beside them. */
const readex = localFont({
  src: "./fonts/ReadexPro-VF.woff2",
  weight: "160 700",
  variable: "--font-readex",
  display: "swap",
});
const markazi = localFont({
  src: "./fonts/MarkaziText-VF.woff2",
  weight: "400 700",
  variable: "--font-markazi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quru | Know if you can pray today",
  description:
    "Quru tells Muslim women where they stand for prayer and fasting, learns their cycle to remind them when the next one is due, and a teacher answers the rest.",
  // Kept out of search results until the form really sends.
  robots: LIVE ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf5ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The motion code adds classes to <html> on the visitor's device, so React is told not to mind.
    <html lang="en-GB" className={`${readex.variable} ${markazi.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Holds the example answer's animation until the card is on screen (see AnswerCard). Runs before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("lp-wait")' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
