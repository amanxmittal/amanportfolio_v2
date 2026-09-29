import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Display } from "@/components/typography/Display";
import { Label } from "@/components/typography/Label";
import { createMetadata } from "@/lib/metadata/createMetadata";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/content";

// Dynamic case-study route (design.md §8, §11; Req 9.2, 15.6).
//
// Case-study pages are statically generated from the known slug registry via
// generateStaticParams, so each resolves to a Server Component-rendered MDX
// body. Unknown slugs call notFound() and render the real 404 page rather than
// crashing.
//
// Next.js 16 route params are async — `params` is a Promise and must be awaited
// in both generateMetadata and the page component. No `any` is used.

type WorkCaseStudyParams = { slug: string };

type WorkCaseStudyPageProps = {
  params: Promise<WorkCaseStudyParams>;
};

export function generateStaticParams(): WorkCaseStudyParams[] {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  // Unknown slug: return minimal metadata. The page component itself calls
  // notFound(), which drives the actual 404 response; metadata just avoids
  // fabricating a title for a page that won't render.
  if (!caseStudy) {
    return createMetadata({
      title: "Not found",
      description: "This case study could not be found.",
      path: `/work/${slug}`,
    });
  }

  return createMetadata({
    title: caseStudy.meta.title,
    description: caseStudy.meta.summary,
    path: `/work/${slug}`,
  });
}

export default async function WorkCaseStudyPage({
  params,
}: WorkCaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const { Body, meta } = caseStudy;

  return (
    <Container>
      <article>
        {/*
          The route owns the page-level <h1> (the case-study title from
          meta.title), giving each case study exactly one top-level heading.
          The MDX body carries its own subsection structure (`##`/`###`), which
          then sits at levels 2/3 beneath this h1 — a correct heading order of
          1 → 2 → 3 (WCAG 1.3.1). role/discipline are shown as minimal
          supporting meta; both come straight from meta, nothing fabricated.
        */}
        <Display as="h1">{meta.title}</Display>
        <Label as="p" className="text-muted">
          {meta.role} · {meta.discipline}
        </Label>
        <Body />
      </article>
    </Container>
  );
}
