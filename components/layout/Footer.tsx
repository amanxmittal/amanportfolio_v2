import Link from "next/link";
import { Container } from "./Container";
import { Label } from "@/components/typography/Label";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/components/navigation/navItems";

/**
 * Footer — Server Component (design.md §6). Minimal by design for this
 * milestone: links to the primary section routes plus a copyright line. No
 * fabricated contact/social content (email/LinkedIn/Resume are deferred with
 * the out-of-scope Contact section — adding them now would present unfinished
 * content as final; Req 10.4).
 *
 * Route links are derived from the shared NAV_ITEMS source of truth, filtered
 * to the real section routes: the `brand` entry (`AM` → `/`) becomes the home
 * link, and the `provisional` `LET'S TALK` entry is excluded (it points at
 * `/about` as a stand-in until Contact exists, so surfacing it here would just
 * duplicate the ABOUT link). Every remaining link therefore resolves to a real
 * route that exists this milestone.
 */

const currentYear = new Date().getFullYear();

// Real section routes only — drop brand (home is rendered separately) and any
// provisional placeholder target.
const footerRoutes = NAV_ITEMS.filter((item) => !item.brand && !item.provisional);

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas">
      <Container
        as="div"
        className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between"
      >
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                aria-label="Aman Mittal — home"
                className={cn(
                  "inline-flex min-h-11 items-center rounded-sm px-3 py-2",
                  "font-display font-medium text-ink",
                  "transition-[color] duration-(--duration-fast) hover:text-accent",
                )}
              >
                <Label as="span" className="font-display text-[0.95rem]">
                  AM
                </Label>
              </Link>
            </li>
            {footerRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-sm px-3 py-2",
                    "text-ink transition-[color] duration-(--duration-fast)",
                    "hover:text-accent",
                  )}
                >
                  <Label as="span" className="text-ink">
                    {item.label}
                  </Label>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Label as="p" className="px-3 text-muted md:px-0">
          © {currentYear} Aman Mittal
        </Label>
      </Container>
    </footer>
  );
}
