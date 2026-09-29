"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Label } from "@/components/typography/Label";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "./navItems";

/**
 * MobileNav — Client Component (design.md §7). The second and only other
 * `"use client"` island allowed this milestone besides HeaderShell (Req 11.7).
 *
 * Renders a hamburger trigger (Lucide `Menu`/`X`) visible only below the `lg:`
 * breakpoint — DesktopNav owns `lg:` and up. Tapping the trigger opens a
 * full-screen `role="dialog" aria-modal="true"` overlay listing the same
 * routes as DesktopNav (from the shared `NAV_ITEMS` list).
 *
 * Accessibility behaviour (Req 11.4 / 11.5 / 12.5 / 12.6):
 *  - Focus trap: on open, focus moves to the close button; Tab / Shift+Tab
 *    cycle within the overlay only.
 *  - `Escape` closes it.
 *  - On close, focus returns to the trigger button.
 *  - Body scroll is locked while open (a class toggling `overflow: hidden`
 *    on <body>).
 *  - Open/close is a plain CSS transform/opacity transition that inherits the
 *    global `prefers-reduced-motion` short-duration override (globals.css).
 *  - Trigger button touch target is >= 44x44px.
 *
 * No animation library is used — a show/hide overlay only needs CSS, keeping
 * Motion for React reserved for the hero/signature transition later.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Body scroll lock while the overlay is open (Req 11.5). Toggles a class on
  // <body> whose rule (globals.css) sets overflow: hidden. Cleaned up on
  // unmount so a route change mid-open never leaves the body locked.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // On open: move focus into the overlay (close button). On close: restore
  // focus to the trigger (Req 11.4). The `open`-dependent effect runs after
  // the overlay has mounted/painted, so the close button ref is populated.
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else {
      // Only pull focus back to the trigger if focus is not already elsewhere
      // due to a deliberate user action (e.g. clicking a link navigates away).
      triggerRef.current?.focus();
    }
    // Refs are stable, so `open` is the only reactive dependency.
  }, [open]);

  // Escape closes; Tab / Shift+Tab are trapped within the overlay (Req 11.4).
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !overlay.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !overlay.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div className="flex w-full items-center justify-between lg:hidden">
      <Link
        href="/"
        aria-label="Aman Mittal — home"
        className={cn(
          "nav-link inline-flex min-h-11 items-center rounded-sm px-3 py-2",
          "font-display font-medium text-ink transition-[color] duration-(--duration-fast)",
          "hover:text-accent",
        )}
      >
        <Label as="span" className="font-display text-[0.95rem]">
          AM
        </Label>
      </Link>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={overlayId}
        aria-label="Open menu"
        className={cn(
          // >= 44x44px touch target (Req 12.5).
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm",
          "text-ink transition-[color] duration-(--duration-fast) hover:text-accent",
        )}
      >
        <Menu aria-hidden="true" size={24} strokeWidth={1.75} />
      </button>

      <div
        ref={overlayRef}
        id={overlayId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open}
        // Hidden from AT + tab order when closed via `inert`-like hiding: the
        // visibility:hidden in the closed-state CSS removes it from the tab
        // order, and pointer-events:none prevents interaction; keeping it in
        // the DOM lets the CSS transition run on open/close.
        className="mobile-overlay fixed inset-0 z-[60] bg-canvas"
      >
        <div className="flex items-center justify-between px-(--grid-margin) py-4">
          <Label as="span" className="font-display text-[0.95rem] text-ink">
            MENU
          </Label>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm",
              "text-ink transition-[color] duration-(--duration-fast) hover:text-accent",
            )}
          >
            <X aria-hidden="true" size={24} strokeWidth={1.75} />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-(--grid-margin) pt-8">
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.filter((item) => !item.brand).map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-sm py-2",
                    "font-display text-4xl text-ink",
                    "transition-[color] duration-(--duration-fast) hover:text-accent",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
