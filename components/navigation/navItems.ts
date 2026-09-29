/**
 * Shared primary-navigation item list (design.md §7, content.md).
 *
 * Single source of truth for the six primary nav entries so `DesktopNav`
 * (Server Component) and `MobileNav` (client overlay) render the same routes
 * without duplication. This is a plain data module with no React/client code,
 * so importing it does not pull anything into a client boundary that wouldn't
 * otherwise be there.
 */
export type NavItem = {
  label: string;
  href: string;
  /** Marks `AM` as the home/brand control rather than a text nav link. */
  brand?: boolean;
  /**
   * Provisional target: the Contact route is out of scope for this milestone,
   * so `LET'S TALK` points at `/about` for now. Replace when Contact exists.
   */
  provisional?: boolean;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "AM", href: "/", brand: true },
  { label: "WORK", href: "/work" },
  { label: "THINK", href: "/think" },
  { label: "BUILD", href: "/build" },
  { label: "ABOUT", href: "/about" },
  { label: "LET'S TALK", href: "/about", provisional: true },
];
