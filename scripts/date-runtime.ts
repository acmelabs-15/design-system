import path from "node:path";
import fs from "node:fs";
import { createHash } from "node:crypto";

/** Ships the corrected dependency with split ESM as well as bundled distributions. */
export async function writeDateRuntime(root: string, dist: string): Promise<void> {
  const packageRoot = path.join(root, "node_modules/@internationalized/date");
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  if (manifest.version !== "3.12.4") {
    throw new Error("Date runtime requires the reviewed @internationalized/date 3.12.4 patch");
  }
  const patch = fs.readFileSync(path.join(root, "patches/@internationalized%2Fdate@3.12.4.patch"), "utf8");
  const hash = createHash("sha256").update(patch).digest("hex");
  const result = await Bun.build({
    entrypoints: [path.join(root, "src/shared/date.ts")],
    outdir: path.join(dist, "shared"),
    naming: "date.js",
    target: "browser",
    format: "esm",
    sourcemap: "none",
    banner: `/*! @internationalized/date 3.12.4, Apache-2.0. Parser corrections; patch SHA256 ${hash}. See ../licenses/date-runtime.json. */`,
  });
  if (!result.success) {
    throw new AggregateError(result.logs, "Date runtime build failed");
  }
  const runtime = await import(path.join(dist, "shared/date.js") + "?verify=" + hash);
  if (runtime.parseAbsolute("2026-09-22T00:30:00-03:30", "UTC").toDate().toISOString() !== "2026-09-22T04:00:00.000Z") {
    throw new Error("Date runtime patch is missing");
  }
  for (const parse of [() => runtime.parseDateTime("2026-09-00T12:00"), () => runtime.parseAbsolute("2026-09-00T12:00Z", "UTC")]) {
    let rejected = false;
    try {
      parse();
    } catch {
      rejected = true;
    }
    if (!rejected) {
      throw new Error("Date runtime day validation patch is missing");
    }
  }
  const licenses = path.join(dist, "licenses");
  fs.mkdirSync(licenses, { recursive: true });
  for (const [name, directory] of [
    ["internationalized-date", packageRoot],
    ["swc-helpers", path.join(root, "node_modules/@swc/helpers")],
  ]) {
    fs.copyFileSync(path.join(directory, "LICENSE"), path.join(licenses, name + ".txt"));
  }
  fs.writeFileSync(
    path.join(licenses, "date-runtime.json"),
    JSON.stringify(
      {
        package: "@internationalized/date",
        version: manifest.version,
        license: "Apache-2.0",
        upstream: manifest.repository.url,
        sourceCommit: manifest.gitHead,
        patchSha256: hash,
        modifications: ["Preserve negative fractional offset signs, including negative zero hours", "Reject day zero in date-time parsers"],
        bundledHelpers: { package: "@swc/helpers", license: "Apache-2.0" },
      },
      null,
      2,
    ) + "\n",
  );
}
