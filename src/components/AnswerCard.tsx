"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { LogoMark } from "./LogoMark";
import { useMotion } from "./Motion";

/** November 2026 starts on a Sunday. Days 3 to 9 are crossed (seven days of bleeding); today is the 10th. */
const LEADING_BLANKS = 6;
const DAYS = 30;
const BLEEDING = { from: 3, to: 9 };
const TODAY = 10;

function Cross() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <path pathLength={1} d="M6.5 6C10.5 10.5 17 17.5 21.5 22" />
      <path pathLength={1} d="M21.5 6.5C17.5 10 10.5 17.5 6.5 21.5" />
    </svg>
  );
}

/**
 * The example answer. It plays when the card comes on screen (on a phone that is after a scroll), and the crosses
 * are drawn again when a mouse comes over the card, or on a touch screen when the card scrolls back into view.
 */
export function AnswerCard() {
  const { calm, ready, paused } = useMotion();
  const art = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const drawnBy = useRef(0);
  const refill = useRef<number | undefined>(undefined);
  const pausedNow = useRef(paused);
  useEffect(() => {
    pausedNow.current = paused;
  }, [paused]);

  const redraw = () => {
    const el = card.current;
    const now = Date.now();
    if (!el || pausedNow.current || now < drawnBy.current) return;
    drawnBy.current = now + 1700;
    el.classList.add("is-emptying");
    window.clearTimeout(refill.current);
    refill.current = window.setTimeout(() => {
      el.classList.add("is-refill");
      el.classList.remove("is-emptying");
    }, 190);
  };

  useEffect(() => {
    if (!ready || calm) return;
    const root = document.documentElement;
    const el = card.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    // The card's animation is held (root class lp-wait, set by a script in the layout) until it is on screen.
    root.classList.add("lp-wait");
    const touch = !!window.matchMedia?.("(hover: none)").matches;
    let shown = false;
    let away = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.35) {
            if (!shown) {
              shown = true;
              drawnBy.current = Date.now() + 2800;
              setSeen(true);
            } else if (away && touch) {
              redraw();
            }
            away = false;
          } else if (!entry.isIntersecting) {
            away = true;
          }
        });
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      root.classList.remove("lp-wait");
      window.clearTimeout(refill.current);
    };
  }, [ready, calm]);

  const cells = [
    ...Array.from({ length: LEADING_BLANKS }, (_, i) => <span key={`blank-${i}`} />),
    ...Array.from({ length: DAYS }, (_, i) => {
      const day = i + 1;
      const bleeding = day >= BLEEDING.from && day <= BLEEDING.to;
      return (
        <span
          key={day}
          className={cx("qu-cal-day", bleeding && "is-bleed", day === TODAY && "is-today")}
          style={bleeding ? ({ "--i": day - BLEEDING.from } as CSSProperties) : undefined}
        >
          {day}
          {bleeding && <Cross />}
        </span>
      );
    }),
  ];

  return (
    <div className={cx("lp-hero-art", seen && "is-seen")} ref={art}>
      <span className="lp-dot" aria-hidden="true" />
      <LogoMark className="lp-disc" />
      <figure>
        <div
          className="lp-answer"
          ref={card}
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch" && ready && !calm) redraw();
          }}
        >
          <p className="lp-answer-kicker">
            <span>Example answer</span>
            <span>November</span>
          </p>
          <div className="qu-cal" role="img" aria-label="A calendar for November. The 3rd to the 9th are crossed, to show seven days of bleeding. Today is the 10th.">
            <div className="qu-cal-week">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="qu-cal-grid">{cells}</div>
            <p className="qu-cal-key">
              <span>
                <Cross /> Bleeding
              </span>
              <span>
                <i /> Today
              </span>
            </p>
          </div>
          <p className="lp-answer-title">You&apos;re clear to pray today, sis!</p>
          <p className="lp-answer-text">You have had seven days of hayd and the signs of purity have appeared, so take your ghusl and pray.</p>
          <div className="lp-answer-foot">
            <span className="qu-status qu-status-confirmed">Confirmed</span>
          </div>
        </div>
        <figcaption className="lp-fine lp-answer-note">An illustration of the app. Your answer follows your own dates.</figcaption>
      </figure>
    </div>
  );
}
