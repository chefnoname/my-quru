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
            Meet Quru: a thoughtful companion made <em>for Muslim women</em> 🖤 She helps you understand where you stand <em>today</em> with prayer and
            fasting, explains the reason behind your answer, and gets to know your cycle so you can feel a little more prepared for what&apos;s ahead.
            And when your situation needs a human touch, you can ask a teacher <em>personally</em> 🖤
          </p>
          <div className="lp-cta">
            <a className="qu-btn qu-btn-primary" id="hero-join" href="#join">
              Keep me in the loop
            </a>
            <a className="qu-btn qu-btn-text" href="#engine">
              See how Quru helps
            </a>
          </div>
          <p className="lp-fine">Joining the list is completely free. We&apos;d just love to know who&apos;s waiting for Quru. For sisters aged 18 and over.</p>
        </div>
        <AnswerCard />
      </div>
    </section>
  );
}
