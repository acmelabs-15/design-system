Decided 2026-09-19 by Peter.

# Build the documentation website in its publishing workflow

Build the site from reviewed source in a GitHub Pages workflow and stop committing generated website pages. Peter selected this over continuing to publish the committed `main/docs` folder. It separates authored content from disposable output and avoids requiring every source change to carry a rebuilt website in Git.

The live Pages settings inspected on 2026-09-19 use the legacy branch source `main`, path `/docs`. The migration therefore needs a tested build/deployment workflow and a publishing-source change; renaming a local folder is insufficient. `_site/` is the proposed disposable output path, and `site/` is the proposed authored-site path. The complete path and deployment changes remain to specify in Phase 5. Keep the existing Lit site builder.

Chakra, Radix and TanStack exclude their website build outputs from Git; Material Web builds its catalog in a deployment workflow. Their hosts and rendering frameworks differ. This decision adopts source/build separation, not another site's entire technology stack.

No site setting, workflow, deployment or generated output changed during this review. Implement only after Phase 5 approval, with source/build consistency and site validation before the publishing switch.

Evidence: [layout and deployment comparison](../analysis/repository-layout.md#website-source-and-build-output) and [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
