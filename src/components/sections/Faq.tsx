import { FaqItem } from "../FaqItem";
import { Term } from "../Term";

export function Faq() {
  return (
    <section className="lp-section" aria-labelledby="h-faq">
      <div className="lp-wrap">
        <div className="lp-head" data-reveal>
          <h2 className="lp-h2" id="h-faq">
            Questions
          </h2>
        </div>
        <div className="lp-faq" data-reveal data-reveal-group>
          <FaqItem question="Is the app ready?">Not yet. It is being built now. Sign up and we will write to you when it is ready.</FaqItem>
          <FaqItem question="What if the app can't answer my question?">
            Then a teacher will. <Term /> answers the everyday cases, and it tells you honestly when yours isn&apos;t one of them. Then you ask an
            Ustadh in an anonymous chat and get a clear answer.
          </FaqItem>
          <FaqItem question="Are you taking payment?">
            No. We take nothing now. The prices on this page are what we plan to charge, and we are asking which you would pick.
          </FaqItem>
          <FaqItem question="Which school does Quru follow?">
            Quru is open to sisters of every school. Its answers are based on the Quran and Sunnah and are not specific to one madhhab.
          </FaqItem>
          <FaqItem question="Is this medical advice?">
            No. Quru answers the religious question: what your bleeding is, and what follows for prayer and fasting. Its tips for the days before your
            period are everyday self-care, not treatment. If your bleeding is heavy, painful or worrying, please see a doctor.
          </FaqItem>
        </div>
      </div>
    </section>
  );
}
