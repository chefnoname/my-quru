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
  ticks: string[];
  button: string;
}> = [
  {
    pick: "monthly",
    name: "Monthly",
    amount: "£3",
    per: "a month",
    blurb: "Pay month by month.",
    ticks: ["Full app access", "Cancel whenever you like"],
    button: "I'd choose monthly",
  },
  {
    pick: "yearly",
    name: "Yearly",
    amount: "£25",
    per: "a year",
    blurb: "One payment for the year.",
    ticks: ["Full app access", "Save £11 compared with paying monthly"],
    button: "I'd choose yearly",
  },
  {
    pick: "founding",
    name: "Founding sister",
    tag: "Founding price",
    amount: "£75",
    per: "one-time payment",
    blurb: "Pay once, right at the start.",
    ticks: ["Full app access", "Nothing to renew", "A say in what we build first"],
    button: "I'd choose founding",
  },
];

/** The prices we plan to open with. Each button takes her to the form with that price already picked. */
export function Prices() {
  return (
    <section className="lp-alt lp-section" id="options" aria-labelledby="h-options">
      <div className="lp-wrap">
        <div className="lp-head" data-reveal>
          <h2 className="lp-h2" id="h-options">
            Simple pricing, with <em>you</em> in mind.
          </h2>
          <p className="lp-lead">
            We want Quru to feel accessible. These are the prices we&apos;re thinking of opening with, but nothing is being charged right now. Have a look and tell us what feels right for you. We&apos;d genuinely love to hear.
          </p>
          <div className="qu-notice lp-nopay">
            <ShieldCheck />
            <p>
              <strong>A little note:</strong> No payments are being taken today. For now, we&apos;re only asking you to fill in a short form with your
              name, age, location, and email. We&apos;ll be in touch when Quru is ready.
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
            <p>Have another price in mind? Tell us 🖤</p>
          </div>
          <div className="lp-own-btns">
            <PickLink pick="custom" className="qu-btn">
              I&apos;d like to suggest my own price
            </PickLink>
            <PickLink pick="free" className="qu-btn">
              I think it should be free
            </PickLink>
          </div>
        </article>
        <div className="qu-notice lp-options-note" data-reveal>
          <HeartHandshake />
          <p>
            <strong>If paying isn&apos;t possible.</strong> Please don&apos;t worry. Sisters who can&apos;t afford to pay won&apos;t be turned away. Just let
            us know when we get in touch, and we&apos;ll arrange access quietly and with care.
          </p>
        </div>
      </div>
    </section>
  );
}
