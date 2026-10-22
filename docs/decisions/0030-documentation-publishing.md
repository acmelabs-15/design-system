# Build the documentation website in its publishing workflow

Build the site from reviewed source in a GitHub Pages workflow and stop committing generated website pages. Peter selected this over continuing to publish the committed `main/docs` folder. It separates authored content from disposable output and avoids requiring every source change to carry a rebuilt website in Git.

Decided 2026-09-19 by Peter.

The live Pages settings inspected on 2026-09-19 used legacy branch source main, path /docs. This required a tested build/deployment workflow and publishing-source change; a local folder rename was insufficient. The resulting structure uses site/ for authored content and _site/ for disposable output, with the existing Lit site builder. The [release record](../releases/0.3.2.md) records subsequent implementation and verification.

Chakra, Radix and TanStack exclude their website build outputs from Git; Material Web builds its catalog in a deployment workflow. Their hosts and rendering frameworks differ. This decision adopts source/build separation, not another site's entire technology stack.

The initial review changed no site setting, workflow, deployment or generated output. It required source/build consistency and site validation before the publishing switch.

Evidence: [layout and deployment comparison](../research/18-repository-layout.md#website-source-and-build-output) and [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
