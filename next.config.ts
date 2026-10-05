import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow .mdx (alongside .ts/.tsx) as page and content extensions so the
  // App Router can render MDX documents directly.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // Opt out of the Next.js 16.3+ AI-agent instruction auto-generation. When an
  // AI coding agent is detected in the environment, `next dev` otherwise
  // upserts a managed block into AGENTS.md / CLAUDE.md at the project root
  // (https://nextjs.org/docs/app/guides/ai-agents). CLAUDE.md here is a
  // governance file whose contents are owned deliberately, so the framework
  // must not mutate it — `agentRules: false` disables that behaviour.
  agentRules: false,
};

const withMDX = createMDX({
  // Use the default @mdx-js/loader compilation pipeline. No extra remark/rehype
  // plugins for this milestone — component mapping lives in mdx-components.tsx.
});

export default withMDX(nextConfig);
