import { HeaderShell } from "./HeaderShell";
import { Container } from "./Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";

/**
 * Header — Server Component (design.md §6/§7). It builds the server-rendered
 * navigation markup — the `<header>`/`<nav aria-label="Primary">` landmarks
 * and `DesktopNav` — and passes it as `children` into the thin `"use client"`
 * `HeaderShell`. Header itself carries NO `"use client"` directive, so
 * DesktopNav, its links, and the typography primitives they use stay out of
 * the client bundle (Req 11.7; "Server Components by default").
 *
 * MobileNav is a self-contained client island composed alongside DesktopNav
 * below. Header itself stays a Server Component — MobileNav carries its own
 * `"use client"` directive, so composing it here does not change this file's
 * server/client boundary.
 */
export function Header() {
  return (
    <HeaderShell>
      <header className="header-bar border-b border-transparent">
        <Container
          as="div"
          className="flex items-center justify-between py-4"
        >
          <nav aria-label="Primary" className="flex w-full items-center">
            {/* DesktopNav is hidden below lg; MobileNav's trigger + overlay
                occupy that space and hide at lg and up. */}
            <DesktopNav />
            <MobileNav />
          </nav>
        </Container>
      </header>
    </HeaderShell>
  );
}
