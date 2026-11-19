import { Lock } from "lucide-react";
import { JoinForm } from "../JoinForm";

const PRIVATE = [
  "Your cycle log stays on your phone.",
  "Your reminders won’t display the word “period” on your lock screen.",
  "Your question is shared only with your teacher, and your chat is anonymous.",
  "The details you share on this sign-up form are seen only by the Quru team. We never sell them, and we’ll delete them if you ask.",
];

export function Join() {
  return (
    <section className="lp-alt lp-section" id="join" aria-labelledby="h-join">
      <div className="lp-wrap lp-join-grid">
        <div className="lp-join-copy" data-reveal>
          <h2 className="lp-h2" id="h-join">
            A little more peace of mind. A little more certainty.
          </h2>
          <p className="lp-lead">
            Add your details to the list and we&apos;ll send you a message the day Quru opens. Your answers will also help us understand what sisters need most, so we can build with you in mind. And don&apos;t worry, there&apos;s nothing to pay.
          </p>
          <div>
            <h3 className="lp-h3" style={{ marginBottom: "var(--space-3)" }}>
              Your privacy matters. Always.
            </h3>
            <ul className="lp-private-list lp-join-private">
              {PRIVATE.map((line) => (
                <li key={line}>
                  <Lock />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-reveal>
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
