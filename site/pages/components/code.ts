// Docs page: Code — mirrors https://vercel.com/geist/code
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "code",
  title: "Code",
  lede: "A snippet of code with syntax highlighting.",
  tags: ["acme-code"],
  examples: [
    {
      h: "Default",
      html: `<acme-code syntax="javascript">import { Snippet } from '@vercel/geistcn/components';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return &lt;Snippet text="npm init next-app" width="300px" /&gt;;
}</acme-code>`,
    },
  ],
};
