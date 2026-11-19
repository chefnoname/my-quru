"use client";

import { type AnimationEvent, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { useMotion, useRoll } from "./Motion";

/** Each question: the words before the highlight, and the highlighted last words. */
const QUESTIONS: Array<[string, string]> = [
  ["Can I pray ", "today, sis?"],
  ["When might my next ", "period arrive?"],
  ["Can I fast ", "tomorrow?"],
  ["Is this hayd or ", "istihada?"],
  ["Do I need to make ", "anything up?"],
  ["Is it time for ", "ghusl?"],
];

/** How long each question stays. The pill under it fills over this time, then the next question rolls in. */
const QUESTION_MS = 5200;

/**
 * The hero's headline: the questions a sister asks, one after another. Pausing, or leaving the tab, freezes the
 * pill where it is. Screen readers hear only the first question.
 */
export function RotatingQuestion() {
  const { calm, ready, paused, togglePaused } = useMotion();
  const roll = useRoll(0);

  const onFill = (e: AnimationEvent<HTMLSpanElement>) => {
    const dot = (e.target as HTMLElement).parentElement;
    if (e.animationName === "lp-fill" && dot?.classList.contains("is-on")) roll.go((roll.on + 1) % QUESTIONS.length);
  };

  return (
    <>
      <h1 className="lp-h1 lp-rot" id="h-hero">
        {QUESTIONS.map(([lead, mark], i) => (
          <span key={mark} className={["lp-rot-item", roll.classFor(i)].filter(Boolean).join(" ")} aria-hidden={i === 0 ? undefined : true}>
            {lead}
            <span className="lp-mark">{mark}</span>
          </span>
        ))}
      </h1>
      <div className="lp-rot-ctl" hidden={!ready || calm}>
        <span className="lp-rot-dots" aria-hidden="true" style={{ "--q": `${QUESTION_MS}ms` } as CSSProperties} onAnimationEnd={onFill}>
          {QUESTIONS.map(([, mark], i) => (
            <i key={mark} className={i === roll.on ? "is-on" : undefined}>
              <b />
            </i>
          ))}
        </span>
        <button type="button" className="lp-pause" aria-label={paused ? "Play the animations." : "Pause the animations."} onClick={togglePaused}>
          <span className="lp-ico-pause">
            <Pause />
          </span>
          <span className="lp-ico-play">
            <Play />
          </span>
        </button>
      </div>
    </>
  );
}
