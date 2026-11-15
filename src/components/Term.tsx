"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cx } from "@/lib/cx";

type ShownBy = "hover" | "focus" | "tap" | null;

/**
 * "TahaaraEngine™", underlined with an info sign. What the name means shows on hover, on keyboard focus and on tap.
 */
export function Term() {
  const tipId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const wait = useRef<number | undefined>(undefined);
  const [by, setBy] = useState<ShownBy>(null);
  // Stays in the page a moment after hiding, so it can fade out.
  const [present, setPresent] = useState(false);
  const [on, setOn] = useState(false);

  const show = useCallback((how: Exclude<ShownBy, null>) => {
    window.clearTimeout(wait.current);
    setBy(how);
    setPresent(true);
  }, []);
  const hide = useCallback(() => {
    window.clearTimeout(wait.current);
    setBy(null);
    setOn(false);
    wait.current = window.setTimeout(() => setPresent(false), 200);
  }, []);
  const hideSoon = useCallback(() => {
    window.clearTimeout(wait.current);
    wait.current = window.setTimeout(hide, 160);
  }, [hide]);

  // Place it above the word, or below when there is no room under the header; the arrow points at the word.
  const place = useCallback(() => {
    const el = tip.current;
    const word = button.current;
    if (!el || !word) return;
    const r = word.getBoundingClientRect();
    const base = (el.offsetParent || document.body).getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const mid = r.left + r.width / 2;
    const x = Math.max(12, Math.min(document.documentElement.clientWidth - w - 12, mid - w / 2));
    const headerHeight = document.getElementById("site-top")?.offsetHeight ?? 0;
    const above = r.top - h - 12 >= headerHeight + 4;
    el.style.left = `${x - base.left}px`;
    el.style.top = `${(above ? r.top - h - 12 : r.bottom + 12) - base.top}px`;
    el.style.setProperty("--ax", `${Math.max(20, Math.min(w - 20, mid - x))}px`);
    // An attribute, not a class, so React's own className updates leave it alone.
    el.toggleAttribute("data-below", !above);
  }, []);

  useLayoutEffect(() => {
    if (!present) return;
    place();
    const fadeIn = window.requestAnimationFrame(() => setOn(by !== null));
    return () => window.cancelAnimationFrame(fadeIn);
  }, [present, by, place]);

  useEffect(() => {
    if (by === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") hide();
    };
    const onDown = (e: globalThis.PointerEvent) => {
      const t = e.target as Node;
      if (!button.current?.contains(t) && !tip.current?.contains(t)) hide();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", place);
    };
  }, [by, hide, place]);

  useEffect(() => () => window.clearTimeout(wait.current), []);

  const mouse = (e: PointerEvent) => e.pointerType === "mouse";

  return (
    <>
      <button
        type="button"
        className="lp-term"
        ref={button}
        aria-describedby={tipId}
        onPointerEnter={(e) => mouse(e) && show(by === "tap" ? "tap" : "hover")}
        onPointerLeave={(e) => mouse(e) && by === "hover" && hideSoon()}
        onFocus={() => by === null && show("focus")}
        onBlur={hide}
        onClick={() => (by === "tap" ? hide() : show("tap"))}
      >
        <span className="lp-term-w">TahaaraEngine</span>
        <span className="lp-tm">™</span>
        <Info />
      </button>
      {present &&
        createPortal(
          <div
            className={cx("lp-tip", on && "is-on")}
            id={tipId}
            role="tooltip"
            ref={tip}
            onPointerEnter={() => window.clearTimeout(wait.current)}
            onPointerLeave={(e) => mouse(e) && by === "hover" && hideSoon()}
          >
            <b>TahaaraEngine™</b> is a set of personalised questions. You answer them and describe your symptoms, and that helps determine what kind of
            bleeding you have.
          </div>,
          document.body,
        )}
    </>
  );
}
