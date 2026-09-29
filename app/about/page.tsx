import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { createMetadata } from "@/lib/metadata/createMetadata";

// Provisional about page. Copy is placeholder scaffolding, not final approved
// content from content.md; the real About content lands in a later milestone
// (design.md §8). Renders only its content — the <main> landmark and shared
// layout come from app/layout.tsx.
export const metadata = createMetadata({
  title: "About",
  description: "About Aman Mittal — provisional placeholder page.",
  path: "/about",
});

export default function About() {
  return (
    <Container>
      <Heading as="h1" size="xl">
        About
      </Heading>
      <Body>About page placeholder — full profile coming soon.</Body>
    </Container>
  );
}
