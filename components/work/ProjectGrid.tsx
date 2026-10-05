import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { ProjectCard } from "./ProjectCard";
import { getProjectsInOrder } from "@/lib/content/projects";
import { Reveal } from "@/components/motion/Reveal";

/**
 * ProjectGrid — Server Component (design.md §7; Requirement 3).
 *
 * Selected Work is the compositional climax of the homepage. Entries are
 * rendered as an ordered editorial sequence (<ol>) rather than a uniform card
 * wall: the ordering is meaningful content (flagship hierarchy, Requirement
 * 3.9), so an ordered list is the honest semantic.
 *
 * The lead project is `featured` and takes the full grid width; the rest
 * alternate in an offset composition handled by ProjectCard.
 */
export function ProjectGrid() {
  const projects = getProjectsInOrder();

  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-heading"
      className="py-24 lg:py-32"
    >
      <Container>
        {/*
          Heading is the approved section name (blueprint §6/§10). The blueprint
          supplies no tagline or lede for this section, so none is invented
          (CLAUDE.md §17).
        */}
        <div className="mb-16 lg:mb-24">
          <Heading as="h2" size="xl" id="selected-work-heading">
            Selected Work
          </Heading>
        </div>

        <ol className="flex flex-col gap-24 lg:gap-32">
          {projects.map((project, index) => (
            <li key={project.name}>
              {/* index resets the stagger per entry: each project reveals as
                  it is reached, rather than the whole list at once. */}
              <Reveal index={0}>
                <ProjectCard
                  project={project}
                  index={index}
                  featured={index === 0}
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
