"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { usePathname } from "next/navigation";
import { useScrollCompact } from "./useScrollCompact";

type HeaderShellProps = {
  children: ReactNode;
};

/**
 * HeaderShell — thin `"use client"` shell for the header (design.md §7).
 *
 * It accepts only `children` (the server-rendered nav markup built in
 * `Header`, a Server Component) and renders them unmodified. Because that
 * markup is constructed server-side and passed through as `children`, the
 * nav links + typography primitives do NOT enter the client bundle — only
 * this shell's small listener/effect code does. This is the mechanism that
 * satisfies Requirement 11.7 ("`use client` only on HeaderShell / MobileNav").
 *
 * Two responsibilities, both owned here rather than in DesktopNav so DesktopNav
 * can stay a Server Component:
 *
 *  1. Scroll compaction — `useScrollCompact` toggles `data-scrolled` on this
 *     root element (a neutral wrapper `<div>`; the `<header>`/`<nav>`
 *     landmarks are provided by the Server Component `Header` as children),
 *     driving CSS (backdrop blur, reduced height, border) via
 *     `[data-scrolled="true"]` selectors in globals.css.
 *
 *  2. Active-route indication (Req 11.6 / 12.4) — `aria-current="page"` must
 *     be a real DOM attribute for assistive tech, and `usePathname()` is
 *     client-only. Rather than making DesktopNav a client component (which
 *     Req 11.7 forbids) or adding a third client `NavLink` file, this shell —
 *     which already wraps the links — reads the pathname and sets
 *     `aria-current="page"` on the matching server-rendered link (identified
 *     by its `data-nav` attribute). CSS underlines `[aria-current="page"]`, so
 *     a single attribute drives both the AT signal and the non-colour cue.
 */
export function HeaderShell({ children }: HeaderShellProps) {
  const scrolled = useScrollCompact();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const links = root.querySelectorAll<HTMLAnchorElement>("a[data-nav]");
    links.forEach((link) => {
      // Provisional links (e.g. LET'S TALK, which points at /about until the
      // Contact route exists) are stand-ins, not the real destination for
      // their target route. Excluding them ensures exactly one nav item
      // receives aria-current="page" for /about — the real ABOUT link — rather
      // than both (M-03). The link's href is untouched, so it is not a dead
      // link.
      if (link.hasAttribute("data-nav-provisional")) {
        link.removeAttribute("aria-current");
        return;
      }

      const target = link.getAttribute("data-nav") ?? "";
      // Active when the path equals the target ("/" home) or is nested within
      // a section ("/work/foo" activates "/work"). "/" only matches exactly so
      // it isn't active on every route.
      const isActive =
        target === "/"
          ? pathname === "/"
          : pathname === target || pathname.startsWith(`${target}/`);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, [pathname, children]);

  return (
    <div
      ref={rootRef}
      data-scrolled={scrolled}
      className="header-shell fixed inset-x-0 top-0 z-50"
    >
      {children}
    </div>
  );
}
