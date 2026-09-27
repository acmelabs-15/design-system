import { expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { browserChecks, checkStages } from "../check";

type Workflow = {
  permissions: Record<string, string>;
  jobs: Record<
    string,
    {
      if?: string;
      permissions?: Record<string, string>;
      needs?: string;
      uses?: string;
      steps?: { uses?: string; run?: string; with?: Record<string, string> }[];
    }
  >;
};
const root = path.resolve(import.meta.dir, "../..");
const workflow = (name: string) => Bun.YAML.parse(fs.readFileSync(path.join(root, ".github/workflows", name + ".yml"), "utf8")) as Workflow;
test("quality workflow runs every defined gate under the pinned Bun runtime", () => {
  const quality = workflow("quality"),
    steps = quality.jobs.verify.steps!;
  expect(quality.permissions).toEqual({ contents: "read" });
  for (const stage of checkStages) {
    expect(steps.some((step) => step.run === `bun scripts/check.ts ${stage}`)).toBe(true);
  }
  expect(steps.some((step) => step.run === "bun install --frozen-lockfile --ignore-scripts")).toBe(true);
  expect(steps.find((step) => step.uses?.startsWith("oven-sh/setup-bun@"))?.with?.["bun-version"]).toBe("1.4.2");
  for (const step of steps) {
    if (step.uses) {
      expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
    }
  }
  expect(steps.some((step) => /\b(?:node|npx|npm)\s/.test(step.run ?? ""))).toBe(false);
  for (const file of browserChecks) {
    expect(fs.existsSync(path.join(root, file))).toBe(true);
  }
});
test("publication and Pages deployment remain explicitly gated after verification", () => {
  const publishing = workflow("publish-package"),
    pages = workflow("pages");
  expect(publishing.jobs.verify.uses).toBe("./.github/workflows/quality.yml");
  expect(publishing.jobs.publish.needs).toBe("verify");
  expect(publishing.jobs.publish.if).toContain("vars.ACME_RELEASE_ENABLED == 'true'");
  expect(publishing.jobs.publish.if).toContain("refs/tags/v");
  expect(publishing.jobs.publish.permissions?.["id-token"]).toBe("write");
  expect(pages.jobs.deploy.needs).toBe("verify");
  expect(pages.jobs.deploy.if).toContain("vars.ACME_PAGES_ENABLED == 'true'");
  expect(pages.jobs.deploy.permissions?.pages).toBe("write");
  expect(publishing.permissions).toEqual({ contents: "read" });
  expect(pages.permissions).toEqual({ contents: "read" });
});
