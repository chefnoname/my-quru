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
        <p className="lp-fine">This page sets no cookies and runs no analytics. © 2026 Quru</p>
      </div>
    </footer>
  );
}
