"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { useMotion } from "./Motion";

/**
 * One question. Its answer opens and closes smoothly; without motion it is a plain <details>. The open state lives
 * on the element itself (and its is-open / is-closing classes), so the browser's find-in-page can open it too.
 */
export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  const { calm } = useMotion();
  const item = useRef<HTMLDetailsElement>(null);
  const closing = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closing.current), []);

  const onSummary = (e: MouseEvent) => {
    const el = item.current;
    if (calm || !el) return;
    e.preventDefault();
    window.clearTimeout(closing.current);
    if (el.open && !el.classList.contains("is-closing")) {
      el.classList.add("is-closing");
      el.classList.remove("is-open");
      closing.current = window.setTimeout(() => {
        el.open = false;
        el.classList.remove("is-closing");
      }, 460);
    } else {
      el.classList.remove("is-closing");
      el.open = true;
      void el.offsetWidth;
      el.classList.add("is-open");
    }
  };

  // Opened or closed some other way, such as find-in-page
  const onToggle = () => {
    const el = item.current;
    if (!el) return;
    if (el.open) el.classList.add("is-open");
    else el.classList.remove("is-open", "is-closing");
  };

  return (
    <details ref={item} onToggle={onToggle}>
      <summary onClick={onSummary}>{question}</summary>
      <div className="lp-faq-a">
        <div>
          <p>{children}</p>
        </div>
      </div>
    </details>
  );
}
