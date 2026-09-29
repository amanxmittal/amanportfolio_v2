import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow .mdx (alongside .ts/.tsx) as page and content extensions so the
  // App Router can render MDX documents directly.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  // Use the default @mdx-js/loader compilation pipeline. No extra remark/rehype
  // plugins for this milestone — component mapping lives in mdx-components.tsx.
});

export default withMDX(nextConfig);
