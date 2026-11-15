"use client";

import type { ReactNode } from "react";

export type PriceChoice = "monthly" | "yearly" | "founding" | "custom" | "free";

/** The event a price button sends, so the form below picks the same answer. */
export const PICK_EVENT = "quru:pick";

/** A button in the prices section. It goes to the form and picks the matching price there. */
export function PickLink({ pick, className, children }: { pick: PriceChoice; className: string; children: ReactNode }) {
  return (
    <a className={className} href="#join" onClick={() => window.dispatchEvent(new CustomEvent<PriceChoice>(PICK_EVENT, { detail: pick }))}>
      {children}
    </a>
  );
}
