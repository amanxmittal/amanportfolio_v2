import { Hero } from "@/components/hero/Hero";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { Philosophy } from "@/components/sections/Philosophy";
import { Principles } from "@/components/sections/Principles";
import { Scale } from "@/components/sections/Scale";
import { DesignSystem } from "@/components/sections/DesignSystem";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { createMetadata } from "@/lib/metadata/createMetadata";

/**
 * Homepage — Server Component (design.md §3).
 *
 * Composes the approved homepage section stack (blueprint §6) in its approved
 * order. The <main id="main"> landmark is owned by the frozen root layout, so
 * this page renders only its content — adding a second <main> would duplicate
 * the landmark.
 *
 * Approved order, and where each item stands in this milestone:
 *
 *    1. Navigation          — frozen Header (root layout)
 *    2. Hero                — implemented (typography-only, OD-6)
 *    3. Signature transition — DEFERRED (OD-1); slot intentionally empty
 *    4. Selected Work       — implemented
 *    5. Philosophy          — implemented
 *    6. Principles          — implemented
 *    7. Scale               — implemented, content-gated (OD-4 / CR-3)
 *    8. Design System       — implemented, shallow/editorial (OD-2)
 *    9. Playground          — DEFERRED (OD-3); slot intentionally empty
 *   10. About               — implemented
 *   11. Contact             — implemented
 *   12. Footer              — frozen Footer (root layout)
 *
 * The two deferred slots hold their approved positions so a later milestone
 * drops them in without reordering anything (cross-cutting 4).
 */
export const metadata = createMetadata({
  title: "Home",
  // Approved positioning statement (product.md) — the same copy the frozen
  // site metadata already uses as its default description.
  description:
    "Product designer building products, systems and experiences at scale.",
  path: "/",
});

export default function Home() {
  return (
    <>
      {/* 2. Hero */}
      <Hero />

      {/* 3. Signature transition — DEFERRED (OD-1) */}

      {/* 4. Selected Work */}
      <ProjectGrid />

      {/* 5. Philosophy */}
      <Philosophy />

      {/* 6. Principles */}
      <Principles />

      {/* 7. Scale (content-gated) */}
      <Scale />

      {/* 8. Design System */}
      <DesignSystem />

      {/* 9. Playground — DEFERRED (OD-3) */}

      {/* 10. About */}
      <About />

      {/* 11. Contact */}
      <Contact />
    </>
  );
}
