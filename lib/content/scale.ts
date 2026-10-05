/**
 * Scale / Experience & Impact content model (design.md §9; Requirement 5.2).
 *
 * CONTENT GATE (OD-4 = gated, CR-3 outstanding):
 *
 * The blueprint §13 figures (600M+ digital users, 30+ ministries, 20+
 * products/websites audited, 50+ design-system pages) are explicitly
 * ILLUSTRATIVE AND UNVERIFIED (content.md; CLAUDE.md §19.2). They must not be
 * published as factual claims without Aman's confirmation, so they are
 * deliberately NOT reproduced in this file — not even commented out as a
 * ready-to-uncomment block, which would invite a future agent to ship them.
 *
 * `scaleFigures` is therefore empty. The Scale section detects the empty model
 * and renders a visibly gated state instead of figures. Supplying verified
 * figures here is a pure data change — the section already handles a populated
 * model.
 */
export interface ScaleFigure {
  /** The verified figure, e.g. "600M+". */
  value: string;
  /** What the figure counts, e.g. "digital users". */
  label: string;
}

/** Empty until CR-3 verified figures are confirmed by Aman. */
export const scaleFigures: ScaleFigure[] = [];

/** True only when verified figures have been supplied. */
export function hasVerifiedScaleFigures(): boolean {
  return scaleFigures.length > 0;
}
