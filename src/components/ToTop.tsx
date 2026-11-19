"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

/** A round button in the bottom right corner that takes her back to the top. It shows once she has scrolled past the first screen. */
export function ToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.9);
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
    <a className={cx("lp-totop", shown && "is-shown")} href="#top" aria-label="Back to the top" tabIndex={shown ? undefined : -1} aria-hidden={!shown || undefined}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
      </svg>
    </a>
  );
}
