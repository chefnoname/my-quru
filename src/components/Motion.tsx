"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Motion for the whole page. Everything that moves is switched off for anyone who asks their device for less
 * movement (prefers-reduced-motion). The styles key off classes on <html>:
 *   lp-motion  motion is on
 *   lp-reveal  sections rise as they come into view ([data-reveal] gets .is-in)
 *   is-paused  the visitor pressed pause
 *   is-held    the rotating question is held (paused, or the tab is hidden)
 */
type MotionState = {
  /** The visitor asked for less motion, or the page hasn't started yet. */
  calm: boolean;
  /** The page has started on the visitor's device. */
  ready: boolean;
  paused: boolean;
  togglePaused: () => void;
};

const MotionContext = createContext<MotionState>({ calm: true, ready: false, paused: false, togglePaused: () => {} });

export const useMotion = () => useContext(MotionContext);

function prefersLessMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [calm, setCalm] = useState(true);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const less = prefersLessMotion();
    const root = document.documentElement;
    if (!less) root.classList.add("lp-motion");
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    // Starting after the first paint keeps the server's page and the first render on the device the same.
    const start = window.requestAnimationFrame(() => {
      setCalm(less);
      setReady(true);
    });
    return () => {
      window.cancelAnimationFrame(start);
      document.removeEventListener("visibilitychange", onVisibility);
      root.classList.remove("lp-motion");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-paused", paused);
    root.classList.toggle("is-held", paused || tabHidden);
  }, [paused, tabHidden]);

  useReveal(ready && !calm);

  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  return <MotionContext.Provider value={{ calm, ready, paused, togglePaused }}>{children}</MotionContext.Provider>;
}

/** Sections rise as they come into view. The children of a [data-reveal-group] follow one another. */
function useReveal(on: boolean) {
  useEffect(() => {
    if (!on || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.setAttribute("data-reveal", "");
        (child as HTMLElement).style.setProperty("--d", String(Math.min(i, 7)));
      });
    });
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Whatever is already on screen stays shown, so nothing blinks as the page starts.
    const height = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < height && r.bottom > 0) el.classList.add("is-in");
    });
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            seen.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    items.filter((el) => !el.classList.contains("is-in")).forEach((el) => seen.observe(el));
    root.classList.add("lp-reveal");
    const showAll = () => items.forEach((el) => el.classList.add("is-in"));
    window.addEventListener("beforeprint", showAll);
    return () => {
      seen.disconnect();
      window.removeEventListener("beforeprint", showAll);
      root.classList.remove("lp-reveal");
    };
  }, [on]);
}

/**
 * One line rolls up and out as the next rolls in (the rotating question and the wordmark). Returns the active key,
 * a way to move to another, and the class for each line: is-on for the one showing, is-out for the one leaving.
 */
export function useRoll<T>(first: T) {
  const [state, setState] = useState<{ on: T; out: T | null }>({ on: first, out: null });
  const clear = useRef<number | undefined>(undefined);
  const go = useCallback((next: T) => {
    setState((s) => (s.on === next ? s : { on: next, out: s.on }));
    window.clearTimeout(clear.current);
    clear.current = window.setTimeout(() => setState((s) => ({ ...s, out: null })), 900);
  }, []);
  useEffect(() => () => window.clearTimeout(clear.current), []);
  const classFor = (key: T) => (key === state.on ? "is-on" : key === state.out ? "is-out" : undefined);
  return { on: state.on, go, classFor };
}
