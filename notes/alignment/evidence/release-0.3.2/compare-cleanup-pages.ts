import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root = process.argv[2];
assert.ok(root, "Provide the extracted final Pages artifact directory");
const previous = await Bun.file("notes/alignment/evidence/release-0.3.2/pages-public-verification.json").json();
const files = fs.readdirSync(root,{recursive:true,withFileTypes:true})
  .filter(file=>file.isFile()).map(file=>path.relative(root,path.join(file.parentPath,file.name))).sort();
assert.deepEqual(files,previous.hashes.map(file=>file.path).sort());
const expected = new Map(previous.hashes.map(file=>[file.path,file.sha256]));
const changed = [];
for (const file of files) {
  const digest = new Bun.CryptoHasher("sha256").update(await Bun.file(path.join(root,file)).arrayBuffer()).digest("hex");
  if (digest !== expected.get(file)) changed.push(file);
}
assert.deepEqual(changed,[], "Final Pages output differs from the fully verified public site");
const publicChecks=[];
for(const file of ["index.html","404.html","app.js","styles/docs.css","pages/components/flow-diagram.html"]) {
  const response=await fetch(new URL(file,previous.url));
  assert.equal(response.status,200);
  const digest=new Bun.CryptoHasher("sha256").update(await response.arrayBuffer()).digest("hex");
  assert.equal(digest,expected.get(file));
  publicChecks.push({path:file,status:response.status,sha256:digest});
}
const record={
  checkedAt:new Date().toISOString(),
  artifactCommit:process.env.ACME_FINAL_COMMIT,
  reviewedCleanupHead:"9eaa8dcafbfdfcd017fdcc13ae507071c579896c",
  run:Number(process.env.ACME_FINAL_PAGES_RUN),
  artifactId:Number(process.env.ACME_FINAL_PAGES_ARTIFACT),
  artifactZipSha256:process.env.ACME_FINAL_PAGES_SHA256,
  files:files.length,
  changedFiles:changed,
  previousRecord:"pages-public-verification.json",
  previousPublicFileCheck:previous.filesCheckedAt,
  previousBrowserCheck:previous.checkedAt,
  publicChecks,
  scope:"Every cleanup artifact file matches the previously downloaded public site. Five public entry/content files are fetched again during cleanup closure. The earlier full public crawl and three-engine functional acceptance are reused for identical output. This is artifact equivalence, not a claim that a post-merge deployment has completed.",
};
await Bun.write(".artifacts/pages-cleanup-comparison.json",JSON.stringify(record,null,2)+"\n");
console.log(JSON.stringify({files:files.length,changedFiles:changed,publicChecks:publicChecks.length}));
