import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { createMetadata } from "@/lib/metadata/createMetadata";

// Placeholder home content. The <main> landmark lives in the root layout
// (app/layout.tsx), so this page renders only its content — not its own <main>
// (a second <main> would create duplicate landmarks). Copy here is provisional
// scaffolding, not the approved hero copy from content.md; final content lands
// in a later milestone (design.md §8).
export const metadata = createMetadata({
  title: "Home",
  description: "Portfolio foundation — provisional home page.",
  path: "/",
});

export default function Home() {
  return (
    <Container>
      <Heading as="h1" size="xl">
        Home
      </Heading>
      <Body>Homepage placeholder — full experience coming soon.</Body>
    </Container>
  );
}
