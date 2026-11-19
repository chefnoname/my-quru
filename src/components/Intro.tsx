import { LogoMark } from "./LogoMark";

/**
 * The opening screen. A purple cover with the mark and the name, which lifts away like a curtain after about two
 * seconds. It shows once per visit (a script in the layout hides it on later page loads in the same tab session),
 * never blocks a click, and is skipped for anyone who asks their device for less motion.
 */
export function Intro() {
  return (
    <div className="lp-intro" aria-hidden="true">
      <div className="lp-intro-lockup">
        <LogoMark className="lp-intro-mark" />
        <span className="lp-intro-type">
          <span className="lp-intro-name">Quru</span>
        </span>
        <span className="lp-intro-type">
          <span className="lp-intro-ar" lang="ar" dir="rtl">
            قروء
          </span>
        </span>
        <span className="lp-intro-type">
          <span className="lp-intro-caption">A little more certainty for your salah</span>
        </span>
      </div>
    </div>
  );
}
