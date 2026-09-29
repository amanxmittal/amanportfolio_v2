import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { createMetadata } from "@/lib/metadata/createMetadata";

// Provisional build index. Copy is placeholder scaffolding, not final approved
// content; experiments and prototypes land in a later milestone (design.md §8).
// Renders only its content — the <main> landmark and shared layout come from
// app/layout.tsx.
export const metadata = createMetadata({
  title: "Build",
  description: "Experiments and prototypes — provisional placeholder page.",
  path: "/build",
});

export default function Build() {
  return (
    <Container>
      <Heading as="h1" size="xl">
        Build
      </Heading>
      <Body>Experiments and prototypes will live here — coming soon.</Body>
    </Container>
  );
}
