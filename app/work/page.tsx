import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { createMetadata } from "@/lib/metadata/createMetadata";

// Provisional work index. Copy is placeholder scaffolding, not final approved
// content from content.md; the real Selected Work index lands in a later
// milestone (design.md §8). Renders only its content — the <main> landmark and
// shared layout come from app/layout.tsx.
export const metadata = createMetadata({
  title: "Work",
  description: "Selected work index — provisional placeholder page.",
  path: "/work",
});

export default function Work() {
  return (
    <Container>
      <Heading as="h1" size="xl">
        Work
      </Heading>
      <Body>Selected work will live here — index coming soon.</Body>
    </Container>
  );
}
