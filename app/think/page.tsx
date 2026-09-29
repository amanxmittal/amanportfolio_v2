import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { createMetadata } from "@/lib/metadata/createMetadata";

// Provisional think index. Copy is placeholder scaffolding, not final approved
// content; essays and writing land in a later milestone (design.md §8).
// Renders only its content — the <main> landmark and shared layout come from
// app/layout.tsx.
export const metadata = createMetadata({
  title: "Think",
  description: "Essays and observations — provisional placeholder page.",
  path: "/think",
});

export default function Think() {
  return (
    <Container>
      <Heading as="h1" size="xl">
        Think
      </Heading>
      <Body>Essays and observations will live here — coming soon.</Body>
    </Container>
  );
}
