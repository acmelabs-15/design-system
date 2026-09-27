import { expect, test } from "bun:test";
import { mkdtemp, mkdir, cp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildConsumerSkills, consumerSkillNames } from "../consumer-skills";
import type { DocumentationRelease } from "../../packages/mcp/src/catalog";

const root = path.resolve(import.meta.dir, "../..");
const version: string = JSON.parse(await readFile(path.join(root, "packages/core/package.json"), "utf8")).version;
const incompatibleVersion = version === "0.0.0-test-mismatch" ? "0.0.1-test-mismatch" : "0.0.0-test-mismatch";
const release: DocumentationRelease = {
  schemaVersion: 1,
  packageName: "@acmelabs/design-system",
  version,
  documents: [
    {
      kind: "component",
      id: "acme-input",
      title: "Input",
      text: "Native form control",
      frameworks: ["html", "lit", "react"],
      declaration: { tagName: "acme-input", events: [{ name: "acme-change", type: { text: "CustomEvent" } }] },
    },
  ],
};
test("packaged skills share exact generated facts and deterministic release metadata", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "acme-skills-test-"));
  try {
    const out = path.join(directory, "out");
    expect(await buildConsumerSkills(release, { root, outDir: out })).toMatchObject({
      skills: 7,
      documents: 1,
      version,
    });
    for (const name of consumerSkillNames) {
      expect(await readFile(path.join(out, name, "SKILL.md"), "utf8")).toBe(await readFile(path.join(root, "skills", name, "SKILL.md"), "utf8"));
    }
    const before = await readFile(path.join(out, "references/release.json"), "utf8");
    const facts = JSON.parse(await readFile(path.join(out, `references/${version}/component/acme-input.json`), "utf8"));
    expect(facts.declaration).toEqual(release.documents[0]!.declaration);
    await buildConsumerSkills(release, { root, outDir: out });
    expect(await readFile(path.join(out, "references/release.json"), "utf8")).toBe(before);
    await expect(buildConsumerSkills({ ...release, version: incompatibleVersion }, { root, outDir: out })).rejects.toThrow("versions differ");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
test("stale skill versions fail before output changes", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "acme-skills-stale-"));
  try {
    await cp(path.join(root, "skills"), path.join(directory, "skills"), { recursive: true });
    await Bun.write(path.join(directory, "packages/core/package.json"), JSON.stringify({ name: release.packageName, version: release.version }));
    const file = path.join(directory, "skills/html-artifacts/SKILL.md");
    await Bun.write(file, (await readFile(file, "utf8")).replace(/^(\s*library_version:\s*).*$/m, '$1"0.0.0-stale"'));
    const output = path.join(directory, "out");
    await mkdir(output);
    await Bun.write(path.join(output, "keep.txt"), "unchanged");
    await expect(buildConsumerSkills(release, { root: directory, outDir: output })).rejects.toThrow("stale skill metadata");
    expect(await readFile(path.join(output, "keep.txt"), "utf8")).toBe("unchanged");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
