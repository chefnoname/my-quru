"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { cx } from "@/lib/cx";
import { LogoMark } from "./LogoMark";
import { useMotion, useRoll } from "./Motion";

/** How far down the page the header starts to shrink, and over how many pixels it becomes a floating pill. */
const MORPH_FROM = 24;
const MORPH_OVER = 220;
/** How much scrolling (either way) it takes before the wordmark swaps language. */
const SWAP_EVERY = 1100;

/**
 * The header stays in reach. It is see-through at the very top; as she scrolls it shrinks into a small floating
 * pill (--nav-morph runs from 0 to 1). Its button fills in once the hero's button has scrolled away. While the form
 * itself is on screen the button folds away and the pill closes in around a smaller wordmark.
 */
export function Header() {
  const [atTop, setAtTop] = useState(true);
  const [heroButtonGone, setHeroButtonGone] = useState(false);
  const [atJoin, setAtJoin] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const last = (entries: IntersectionObserverEntry[]) => entries[entries.length - 1].isIntersecting;
    const watch: Array<[string, (on: boolean) => void, IntersectionObserverInit?]> = [
      ["top-mark", setAtTop],
      ["hero-join", (on) => setHeroButtonGone(!on), { rootMargin: "-72px 0px 0px 0px" }],
      ["join", setAtJoin, { rootMargin: "-50% 0px -50% 0px" }],
    ];
    const observers = watch.flatMap(([id, set, options]) => {
      const el = document.getElementById(id);
      if (!el) return [];
      const io = new IntersectionObserver((entries) => set(last(entries)), options);
      io.observe(el);
      return [io];
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const morph = Math.min(1, Math.max(0, (window.scrollY - MORPH_FROM) / MORPH_OVER));
      header.current?.style.setProperty("--nav-morph", morph.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="lp-top-mark" id="top-mark" aria-hidden="true" />
      <div className="lp-top-space" aria-hidden="true" />
      <header className={cx("lp-top", atTop && "is-top", atJoin && "at-join")} id="site-top" ref={header}>
        <div className="lp-wrap lp-top-in">
          <Wordmark />
          <a className={cx("qu-btn", heroButtonGone && "qu-btn-primary")} href="#join" tabIndex={atJoin ? -1 : undefined} aria-hidden={atJoin || undefined}>
            Join our sisterhood
          </a>
        </div>
      </header>
    </>
  );
}

/**
 * The wordmark rolls from English to Arabic and back once as the page opens. After that it swaps language every
 * so often as she scrolls (every SWAP_EVERY pixels, either way), and shows the other language while a mouse or the
 * keyboard is on it.
 */
function Wordmark() {
  const { calm, ready } = useMotion();
  const roll = useRoll<"en" | "ar">("en");
  const intro = useRef(false);
  const over = useRef(false);
  const base = useRef<"en" | "ar">("en");
  const { go } = roll;
  const sync = useCallback(() => {
    const flip = intro.current || over.current;
    go(flip ? (base.current === "en" ? "ar" : "en") : base.current);
  }, [go]);

  useEffect(() => {
    if (!ready || calm) return;
    const toArabic = window.setTimeout(() => {
      intro.current = true;
      go("ar");
    }, 1300);
    const back = window.setTimeout(() => {
      intro.current = false;
      sync();
    }, 3900);
    return () => {
      window.clearTimeout(toArabic);
      window.clearTimeout(back);
    };
  }, [ready, calm, go, sync]);

  useEffect(() => {
    if (!ready || calm) return;
    let last = window.scrollY;
    let travelled = 0;
    const onScroll = () => {
      const y = window.scrollY;
      travelled += Math.abs(y - last);
      last = y;
      if (travelled < SWAP_EVERY || intro.current) return;
      travelled = 0;
      base.current = base.current === "en" ? "ar" : "en";
      sync();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, calm, sync]);

  const moving = ready && !calm;
  const enter = (e: PointerEvent) => {
    if (!moving || e.pointerType === "touch") return;
    over.current = true;
    sync();
  };
  const leave = () => {
    if (!moving) return;
    over.current = false;
    sync();
  };
  const focus = (e: FocusEvent<HTMLAnchorElement>) => {
    if (!moving) return;
    try {
      over.current = e.currentTarget.matches(":focus-visible");
    } catch {
      over.current = true;
    }
    sync();
  };

  return (
    <a className="lp-logo" href="#top" aria-label="Quru, back to the top of the page." onPointerEnter={enter} onPointerLeave={leave} onFocus={focus} onBlur={leave}>
      <LogoMark />
      <span className="lp-logo-roll" aria-hidden="true">
        <span className={cx("lp-logo-ar", roll.classFor("ar"))} lang="ar" dir="rtl">
          قروء
        </span>
        <span className={cx("lp-logo-en", roll.classFor("en"))}>Quru</span>
      </span>
    </a>
  );
}
