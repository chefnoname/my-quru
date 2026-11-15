import { Lock } from "lucide-react";
import { JoinForm } from "../JoinForm";

const PRIVATE = [
  "Your log stays on your phone.",
  "Reminders never say “period” on your lock screen.",
  "Your question goes to your teacher and nobody else, and the chat is anonymous.",
  "What you tell us here is seen only by the Quru team. It is never sold, and we delete it when you ask.",
];

export function Join() {
  return (
    <section className="lp-alt lp-section" id="join" aria-labelledby="h-join">
      <div className="lp-wrap lp-join-grid">
        <div className="lp-join-copy" data-reveal>
          <h2 className="lp-h2" id="h-join">
            Pray with certainty
          </h2>
          <p className="lp-lead">
            Fill in the short form and we&apos;ll write to you the day Quru opens. Your answers tell us what to build first. We take no payment.
          </p>
          <div>
            <h3 className="lp-h3" style={{ marginBottom: "var(--space-3)" }}>
              Private, the way this should be
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
