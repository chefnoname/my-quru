import { LogoMark } from "../LogoMark";

export function Footer() {
  return (
    <footer className="lp-foot">
      <div className="lp-wrap lp-foot-grid">
        <LogoMark label="Quru" />
        <p>
          Quru (
          <span lang="ar" dir="rtl">
            قروء
          </span>
          ) is the Quran&apos;s word for a woman&apos;s cycles, in Al-Baqarah 2:228.
        </p>
        <div className="lp-foot-legal">
          <p className="lp-fine">This page sets no cookies and runs no analytics.</p>
          <p className="lp-fine">© 2026 Quru. Made in London.</p>
          <p className="lp-fine">KOBCIN LTD · No. 17500293 · Registered in England &amp; Wales · 195 Wood Street, London, United Kingdom, E17 3NU</p>
        </div>
      </div>
    </footer>
  );
}
