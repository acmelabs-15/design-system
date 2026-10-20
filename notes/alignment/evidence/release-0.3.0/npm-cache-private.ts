import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const npmRoot = path.join(process.argv[2], "node_modules/npm");
const npmRequire = createRequire(path.join(npmRoot, "package.json"));
const fetchRequire = createRequire(npmRequire.resolve("make-fetch-happen"));
const { Request, Response } = npmRequire("make-fetch-happen");
const NpmCachePolicy = fetchRequire("./cache/policy.js");
const registryFetch = npmRequire("npm-registry-fetch");
const request = new Request("https://registry.example.test/fixture", { headers: { authorization: "Bearer synthetic-test-value" } });
const response = new Response("fixture", { headers: { "cache-control": "max-age=60", "set-cookie": "session=synthetic-test-value" } });
const options = { shared: true, cachePath: path.join(os.tmpdir(), "unused-private-policy-check") };
const wrapper = new NpmCachePolicy({ request, response, options });
assert.equal(wrapper.policy.toObject().sh, false);
assert.equal(wrapper.policy.maxAge(), 60);
assert.equal(wrapper.storable(), true);
assert.equal(NpmCachePolicy.storable(request, options), true);

const cachePath = await mkdtemp(path.join(os.tmpdir(), "acme-npm-cache-probe-"));
let originRequests = 0;
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  fetch() {
    originRequests++;
    return new globalThis.Response("synthetic cached body", { headers: { "cache-control": "max-age=0", "set-cookie": "session=synthetic-test-value; HttpOnly" } });
  },
});
try {
  const url = `http://127.0.0.1:${server.port}/fixture`;
  const first = await registryFetch(url, {
    cache: cachePath,
    retry: false,
    headers: { cookie: "user=synthetic-test-value" },
    cacheAdditionalHeaders: ["set-cookie"],
    proxy: null,
    noProxy: "*",
  });
  assert.equal(first.headers.get("set-cookie"), "session=synthetic-test-value; HttpOnly");
  assert.equal(await first.text(), "synthetic cached body");
  assert.equal(first.headers.get("x-local-cache-status"), "miss");
  const next = await registryFetch(url, {
    cache: cachePath,
    retry: false,
    headers: { "cache-control": "max-stale=31536000" },
    cacheAdditionalHeaders: ["set-cookie"],
    proxy: null,
    noProxy: "*",
  });
  assert.equal(await next.text(), "synthetic cached body");
  assert.equal(next.headers.get("x-local-cache-status"), "hit");
  assert.equal(originRequests, 1);
  assert.equal(next.headers.get("set-cookie"), null);
  console.log("npm private cache and cookie omission verified");
} finally {
  await server.stop(true);
  await rm(cachePath, { recursive: true, force: true });
}
