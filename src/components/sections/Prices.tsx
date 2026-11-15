import { Check, HeartHandshake, ShieldCheck } from "lucide-react";
import { cx } from "@/lib/cx";
import { PickLink } from "../PickLink";
import type { PriceChoice } from "../PickLink";

const PLANS: Array<{
  pick: PriceChoice;
  name: string;
  tag?: string;
  amount: string;
  per: string;
  blurb: string;
  ticks: [string, string];
  button: string;
}> = [
  {
    pick: "monthly",
    name: "Monthly",
    amount: "£3",
    per: "a month",
    blurb: "Pay month by month.",
    ticks: ["The whole app", "Stop whenever you like"],
    button: "I would pick monthly",
  },
  {
    pick: "yearly",
    name: "Yearly",
    amount: "£25",
    per: "a year",
    blurb: "One payment a year.",
    ticks: ["The whole app", "Saves £11 on paying monthly"],
    button: "I would pick yearly",
  },
  {
    pick: "founding",
    name: "Founding sister",
    tag: "Founding price",
    amount: "£75",
    per: "one payment",
    blurb: "Pay once, at the start.",
    ticks: ["The whole app, with nothing to renew", "A say in what gets built first"],
    button: "I would pick founding",
  },
];

/** The prices we plan to open with. Each button takes her to the form with that price already picked. */
export function Prices() {
  return (
    <section className="lp-alt lp-section" id="options" aria-labelledby="h-options">
      <div className="lp-wrap">
        <div className="lp-head" data-reveal>
          <h2 className="lp-h2" id="h-options">
            What it will cost
          </h2>
          <p className="lp-lead">
            These are the prices we plan to open with. Nothing is charged today. Tell us which you would pick, or name your own.
          </p>
          <div className="qu-notice lp-nopay">
            <ShieldCheck />
            <p>
              <strong>We are not taking any payment.</strong> All we ask for now is a short form: your name, age, where you live and your email. We
              will write to you when the app is ready.
            </p>
          </div>
        </div>
        <div className="lp-options" data-reveal-group>
          {PLANS.map((plan) => {
            const featured = plan.pick === "founding";
            return (
              <article key={plan.pick} className={cx("lp-option", featured && "lp-option-featured")}>
                <h3 className="lp-option-name">
                  {plan.name}
                  {plan.tag && <span className="lp-tag">{plan.tag}</span>}
                </h3>
                <p className="lp-price">
                  <b>{plan.amount}</b>
                  <span>{plan.per}</span>
                </p>
                <p>{plan.blurb}</p>
                <ul className="lp-ticks">
                  {plan.ticks.map((tick) => (
                    <li key={tick}>
                      <Check />
                      <span>{tick}</span>
                    </li>
                  ))}
                </ul>
                <PickLink pick={plan.pick} className={cx("qu-btn qu-btn-block", featured && "qu-btn-primary")}>
                  {plan.button}
                </PickLink>
              </article>
            );
          })}
        </div>
        <article className="lp-option lp-option-own" data-reveal>
          <div>
            <h3 className="lp-option-name">Your own price</h3>
            <p>Think it&apos;s worth a different amount, or that it should be free? Tell us what you would pay, a month or a year.</p>
          </div>
          <div className="lp-own-btns">
            <PickLink pick="custom" className="qu-btn">
              Name my own price
            </PickLink>
            <PickLink pick="free" className="qu-btn">
              It should be free
            </PickLink>
          </div>
        </article>
        <div className="qu-notice lp-options-note" data-reveal>
          <HeartHandshake />
          <p>
            <strong>If you can&apos;t pay.</strong> Sisters who can&apos;t pay won&apos;t be turned away. Tell us when we write to you and we will arrange
            it quietly.
          </p>
        </div>
      </div>
    </section>
  );
}
