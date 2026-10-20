import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dir, "../../../..");
const coverage = fs.readFileSync(path.join(root, "notes/alignment/proposal-coverage.md"), "utf8");
const rows = coverage
  .split("\n")
  .filter((line) => /^\| acme-/.test(line))
  .map((line) => {
    const fields = line.split("|").map((part) => part.trim());
    return { tag: fields[1], destination: fields[2], action: fields[3] };
  });
const current = new Set<string>();
for (const file of new Bun.Glob("src/components/**/*.ts").scanSync(root)) {
  if (file.includes("__tests__")) continue;
  for (const match of fs.readFileSync(path.join(root, file), "utf8").matchAll(/["'](acme-[a-z0-9-]+)["']\s*:\s*Acme/g)) current.add(match[1]);
}
const removed = rows.filter((row) => !current.has(row.tag)).map((row) => row.tag);
const pkg = await Bun.file(path.join(root, "packages/core/package.json")).json();
const paths = ["README.md", ...["src", "site", "examples", "styles"].flatMap((directory) => [...new Bun.Glob(directory + "/**/*").scanSync(root)].filter((file) => /\.(ts|tsx|css|md)$/.test(file)))];
const hits = [];
for (const file of paths) {
  const lines = fs.readFileSync(path.join(root, file), "utf8").split("\n");
  for (let index = 0; index < lines.length; index++)
    for (const match of lines[index].matchAll(/\bacme-[a-z0-9-]+\b/g)) {
      if (removed.includes(match[0])) hits.push({ path: file, line: index + 1, tag: match[0], context: lines[index].slice(0, 220) });
    }
}
const removedExports = Object.keys(pkg.exports).filter((key) => removed.some((tag) => key === "./components/" + tag.slice(5) || key === "./define/" + tag.slice(5)));
const findings = hits.filter((hit) => hit.tag !== "acme-error");
const report = {
  date: new Date().toISOString(),
  version: pkg.version,
  originalTags: rows.length,
  removedOrRenamedTags: removed,
  removedStillRegistered: rows.filter((row) => row.action.startsWith("Remove") && current.has(row.tag)),
  removedExports,
  findings,
  classifiedHits: { note: "acme-error occurrences are the current event name and CSS token, not the retired custom element; no tag markup or definition remains.", hits },
};
await Bun.write(process.env.ACME_AUDIT_RESULTS ?? path.join(import.meta.dir, "removals-results.json"), JSON.stringify(report, null, 2) + "\n");
console.log({ originalTags: rows.length, removedOrRenamed: removed.length, findings: findings.length, removedExports });
if (!rows.length || report.removedStillRegistered.length || removedExports.length || findings.length) process.exitCode = 1;
