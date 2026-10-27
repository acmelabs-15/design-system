import { expect, test } from "bun:test";
import manifest from "../package.json";

// Decision 0116: consumers receive upstream fixes without a design-system release.
test("runtime dependencies are caret ranges", () => {
  for (const [name, range] of Object.entries(manifest.dependencies)) {
    expect(`${name}@${range}`).toMatch(/@\^\d+\.\d+\.\d+$/);
  }
});
