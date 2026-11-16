import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { CLARITY_ID, LIVE } from "@/lib/config";
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
      {/* Microsoft Clarity: heatmaps and session replays, only when NEXT_PUBLIC_CLARITY_ID is set. Loads after the page is interactive. */}
      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </html>
  );
}
