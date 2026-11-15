import { AnswerCard } from "../AnswerCard";
import { RotatingQuestion } from "../RotatingQuestion";

export function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="h-hero">
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy">
          <p className="lp-def">
            <span className="lp-def-ar" lang="ar" dir="rtl">
              قُرُوء
            </span>
            <span className="lp-def-body">
              <span className="lp-def-word">
                <b>Quru</b> · Arabic, noun
              </span>
              <span className="lp-def-mean">A woman&apos;s cycles: her days of bleeding and her days of purity.</span>
            </span>
          </p>
          <RotatingQuestion />
          <p className="lp-lead">
            Quru is an app for Muslim sisters. It tells you where you stand today, and why, and it learns your cycle so you know when the next one is
            coming. When your situation is one the app can&apos;t settle, a teacher answers you personally.
          </p>
          <div className="lp-cta">
            <a className="qu-btn qu-btn-primary" id="hero-join" href="#join">
              Tell me when Quru opens
            </a>
            <a className="qu-btn qu-btn-text" href="#engine">
              See what it will do
            </a>
          </div>
          <p className="lp-fine">No payment. We only want to know who needs this. For sisters aged 18 and over.</p>
        </div>
        <AnswerCard />
      </div>
    </section>
  );
}
