import { expect, test } from "bun:test";
import { copyFile, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { GeistMap, SpecNode } from "../gen";

test("composed descendant rules reach the terminal part through its ancestor host", async () => {
  // Run the real generator against a small reference fixture. The downloaded corpus is
  // deliberately absent: a clean checkout must reproduce this selector regression too.
  const scratch = await mkdtemp(path.join(tmpdir(), "acme-generator-test-"));
  try {
    const generator = path.join(scratch, "tools/geist");
    for (const directory of ["corpus/css", "corpus/html", "spec"]) {
      await mkdir(path.join(generator, directory), { recursive: true });
    }
    await mkdir(path.join(scratch, "scripts"));
    for (const file of ["gen.ts", "tw.ts", "simplify.ts"]) {
      await copyFile(path.join(import.meta.dir, "..", file), path.join(generator, file));
    }
    await mkdir(path.join(scratch, "src/shared"), { recursive: true });
    for (const file of ["scripts/local-inputs.ts", "scripts/styles.ts", "scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts", "src/shared/motion-tokens.ts"]) {
      await copyFile(path.join(import.meta.dir, "../../..", file), path.join(scratch, file));
    }
    await symlink(path.join(import.meta.dir, "../../../node_modules"), path.join(scratch, "node_modules"));
    await writeFile(path.join(generator, "corpus/html/fixture.html"), '<link rel="stylesheet" href="/fixture.css">');
    await writeFile(path.join(generator, "corpus/css/fixture.css"), ".crumbs > div { gap: 8px; }\n.crumbs > div > a { padding: 6px; }");

    const node = (tag: string, children: SpecNode[] = []): SpecNode => ({ tag, attrs: {}, styles: [], unresolved: [], children });
    const crumbs = node("section", [node("div", [node("a")])]);
    crumbs.styles.push({ cls: "crumbs", state: "", at: "", decl: "" });
    const root = node("header", [crumbs]);
    root.attrs["data-head"] = "";
    await writeFile(path.join(generator, "spec/fixture.json"), JSON.stringify({ page: "fixture", examples: [{ heading: "Composed breadcrumbs", code: "<Head />", dom: [root] }] }));

    const map: GeistMap = {
      page: "fixture",
      component: "Head",
      root: "data-head",
      ours: ".head",
      children: [{ ours: ".crumbs", pick: 0, children: [{ ours: "acme-breadcrumbs", part: "list", pick: 0, children: [{ ours: "acme-breadcrumb", part: "item", pick: 0 }] }] }],
    };
    const { generate } = await import(pathToFileURL(path.join(generator, "gen.ts")).href);
    const { css, report } = generate("fixture", map);

    expect(report).toEqual([]);
    expect(css).toContain(".head :where(.crumbs) > :where(acme-breadcrumbs)::part(list){gap:8px}");
    expect(css).toContain(".head :where(.crumbs) > :where(acme-breadcrumbs) > :where(acme-breadcrumb)::part(item){padding:6px}");
    expect(css).not.toMatch(/::part\([^)]*\)\s*[>+~]/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
