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
          <FaqItem question="Is Quru ready yet?">Not quite, sis, we&apos;re working on it! Join the list and we&apos;ll send you a little note as soon as Quru is ready to welcome you.</FaqItem>
          <FaqItem question="What if Quru can't answer my question?">
            You won&apos;t be left on your own. <Term /> is designed to help with everyday situations and to be honest when a case needs more care.
            You&apos;ll be able to send your question to an Ustadh through an anonymous chat and receive a personal answer.
          </FaqItem>
          <FaqItem question="Are you taking payments now?">
            No, not at all. Joining the list is free, and we won&apos;t take any payment now. The prices on this page are simply the options we&apos;re
            considering for launch. We&apos;d love to know which one you&apos;d choose.
          </FaqItem>
          <FaqItem question="Which school of thought does Quru follow?">
            Quru is being created with sisters from every school in mind. Its answers are based on the Quran and Sunnah and are not limited to one
            madhhab.
          </FaqItem>
          <FaqItem question="Is Quru a medical app?">
            No, lovely. Quru is here to help with the religious side of your cycle: understanding your bleeding and what it means for prayer and
            fasting. Any tips for the days before your period are everyday self-care, not medical treatment. If your bleeding is heavy, painful, or
            worrying, please speak with a doctor.
          </FaqItem>
        </div>
      </div>
    </section>
  );
}
