import Link from "next/link";
import { Label } from "@/components/typography/Label";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "./navItems";

/**
 * DesktopNav — Server Component (design.md §7). Renders the primary nav items
 * as a semantic `<ul>` of `next/link`s. Authored entirely server-side: no
 * `"use client"`, no `usePathname`, so its markup + the six links do NOT enter
 * the client bundle (Req 11.7 restricts `"use client"` to HeaderShell /
 * MobileNav).
 *
 * Active-route indication is NOT computed here (a Server Component can't read
 * the pathname). Instead each link carries a `data-nav` attribute naming its
 * route; the client `HeaderShell` that wraps this markup reads `usePathname()`
 * and sets `aria-current="page"` on the matching link. CSS underlines
 * `[aria-current="page"]`, giving the required non-colour cue (Req 12.4)
 * without adding a client boundary here. See HeaderShell.tsx for the rationale.
 */

export function DesktopNav() {
  return (
    <ul className="hidden items-center gap-2 lg:flex">
      {NAV_ITEMS.map((item, index) => (
        <li key={`${item.label}-${index}`} className={cn(item.brand && "mr-auto")}>
          <Link
            href={item.href}
            data-nav={item.href}
            // Provisional links (e.g. LET'S TALK → /about until Contact exists)
            // are excluded from active-route matching so they never claim
            // aria-current — otherwise /about would mark both ABOUT and LET'S
            // TALK (M-03). The link target is unchanged, so it stays a real,
            // non-dead link.
            data-nav-provisional={item.provisional ? "" : undefined}
            aria-label={item.brand ? "Aman Mittal — home" : undefined}
            className={cn(
              // >= 44x44px touch target via padding + min-height; the nav-link
              // class (globals.css) owns the active underline off aria-current.
              "nav-link inline-flex min-h-11 items-center rounded-sm px-3 py-2",
              "text-ink transition-[color] duration-(--duration-fast)",
              "hover:text-accent",
              item.brand && "font-display font-medium",
            )}
          >
            <Label
              as="span"
              className={cn(item.brand ? "font-display" : "text-ink")}
            >
              {item.label}
            </Label>
          </Link>
        </li>
      ))}
    </ul>
  );
}
