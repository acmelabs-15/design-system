import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { browserAssetPlugin } from "./browser-assets";
import { componentFixtureSource } from "./component-browser-checks";
import { repositoryRoot } from "./core-package";

const version = "156.0.1";
const archiveBase = `https://archive.mozilla.org/pub/firefox/releases/${version}/`;

export function firefoxArchive(platform = process.platform, architecture = process.arch): string {
  if (platform === "darwin") {
    return `mac/en-US/Firefox ${version}.dmg`;
  }
  if (platform === "linux" && architecture === "x64") {
    return `linux-x86_64/en-US/firefox-${version}.tar.xz`;
  }
  if (platform === "linux" && architecture === "arm64") {
    return `linux-aarch64/en-US/firefox-${version}.tar.xz`;
  }
  throw new Error(`Unsupported official Firefox platform: ${platform}/${architecture}`);
}

export function firefoxChecksum(sums: string, archive: string): string {
  const line = sums
    .split(/\r?\n/)
    .map((value) => /^([a-f0-9]{128})\s+(.+)$/i.exec(value))
    .find((match) => match?.[2] === archive);
  if (!line) {
    throw new Error("Missing official Firefox checksum: " + archive);
  }
  return line[1].toLowerCase();
}

async function sha512(file: string) {
  const hasher = new Bun.CryptoHasher("sha512");
  for await (const chunk of Bun.file(file).stream()) {
    hasher.update(chunk);
  }
  return hasher.digest("hex");
}

function command(args: string[]): string {
  const result = Bun.spawnSync(args, { stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) {
    throw new Error(result.stdout.toString() + result.stderr.toString());
  }
  return result.stdout.toString() + result.stderr.toString();
}

/** Install Linux CI's pinned archive, or verify the existing isolated macOS browser. */
export async function officialFirefoxRuntime(root = repositoryRoot) {
  const archive = firefoxArchive();
  const response = await fetch(archiveBase + "SHA512SUMS", { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    throw new Error("Mozilla checksum request failed: " + response.status);
  }
  const expected = firefoxChecksum(await response.text(), archive);
  const cache = path.join(process.env.ACME_BROWSER_RUNTIME ?? path.join(root, ".artifacts/browser-runtime"), "official-firefox", version);
  fs.mkdirSync(cache, { recursive: true });
  let archiveFile: string;
  let executable: string;
  let signature: string | undefined;
  if (process.platform === "darwin") {
    const local = path.join(os.homedir(), "Library/Caches/acme-design-system/browser-checks");
    archiveFile = process.env.ACME_OFFICIAL_FIREFOX_ARCHIVE ?? path.join(local, `firefox-${version}.dmg`);
    const application = process.env.ACME_OFFICIAL_FIREFOX_APP ?? path.join(local, `Firefox-${version}.app`);
    executable = path.join(application, "Contents/MacOS/firefox");
    if (!fs.existsSync(archiveFile) || !fs.existsSync(executable)) {
      throw new Error("Provide the isolated official Firefox application and its original Mozilla archive");
    }
    signature = command(["codesign", "--verify", "--deep", "--strict", application]);
  } else {
    archiveFile = path.join(cache, path.basename(archive));
    if (!fs.existsSync(archiveFile)) {
      const download = await fetch(archiveBase + archive, { signal: AbortSignal.timeout(180000) });
      if (!download.ok) {
        throw new Error("Mozilla browser download failed: " + download.status);
      }
      await Bun.write(archiveFile, download);
    }
    executable = path.join(cache, "firefox/firefox");
  }
  const digest = await sha512(archiveFile);
  if (digest !== expected) {
    throw new Error("Official Firefox archive SHA-512 mismatch");
  }
  if (process.platform === "linux") {
    // Re-extract the verified archive so an altered cache cannot become the trusted browser.
    fs.rmSync(path.join(cache, "firefox"), { recursive: true, force: true });
    command(["tar", "-xf", archiveFile, "-C", cache]);
  }
  const reportedVersion = command([executable, "--version"]).trim();
  if (!reportedVersion.includes("Mozilla Firefox " + version)) {
    throw new Error("Unexpected official Firefox version: " + reportedVersion);
  }
  const result = {
    version,
    platform: process.platform,
    architecture: process.arch,
    executable,
    archiveFile,
    archiveUrl: archiveBase + encodeURI(archive),
    sha512: digest,
    reportedVersion,
    ...(signature === undefined ? {} : { signatureVerified: true }),
  };
  await Bun.write(path.join(cache, "verified.json"), JSON.stringify(result, null, 2) + "\n");
  return result;
}

const docsProbe = String.raw`
const errors=[];
addEventListener("error",event=>errors.push(event.message));
addEventListener("unhandledrejection",event=>errors.push(String(event.reason)));
const wait=async(test)=>{const end=Date.now()+30000;while(!test()){if(Date.now()>end)throw Error("Official browser condition timed out");await new Promise(requestAnimationFrame)}};
addEventListener("DOMContentLoaded",async()=>{
 const index=Number(new URL(location.href).searchParams.get("__acme_docs")||0);
 try {
  await wait(()=>document.querySelector("main h1"));
  await wait(()=>[...document.querySelectorAll(".showcase .preview acme-button")].every(element=>element.shadowRoot));
  const failures=[...document.querySelectorAll("[data-example-error]:not([hidden])")].map(element=>element.textContent);
  const unknown=[...new Set([...document.querySelectorAll("main .preview *")].filter(element=>element.namespaceURI==="http://www.w3.org/1999/xhtml"&&element.localName.includes("-")&&!element.matches(":defined")).map(element=>element.localName))];
  const routes=window.__docsNav.flatMap(group=>group.items).map(item=>item.href);
  const result={kind:"page",index,route:routes[index],failures,unknown,errors,pass:!failures.length&&!unknown.length&&!errors.length};
  await fetch("/__official/report",{method:"POST",body:JSON.stringify(result)});
  if(!result.pass)return;
  if(index+1<routes.length)location.href="/"+(routes[index+1]==="index"?"":routes[index+1])+"?__acme_docs="+(index+1);
  else location.href="/__official/flow?cycle=0";
 } catch(error){await fetch("/__official/report",{method:"POST",body:JSON.stringify({kind:"page",index,error:String(error),errors,pass:false})})}
});`;

const flowProbe = String.raw`
import "/__official/modules/flow-diagram.browser.js";
const cycle=Number(new URL(location.href).searchParams.get("cycle")||0);
try{
 while(!window.flow?.scene)await new Promise(resolve=>setTimeout(resolve,1));
 flow.remove();document.body.append(flow);
 while(!flow.engine.engine)await new Promise(resolve=>setTimeout(resolve,0));
 await new Promise(resolve=>setTimeout(resolve,[0,5,10,16,30,60][cycle%6]));
 document.querySelector("acme-flow-node").remove();flow.nodes=[];flow.edges=[];await flow.layout();
 const empty=flow.scene===undefined;
 await fetch("/__official/report",{method:"POST",body:JSON.stringify({kind:"flow",cycle,empty,pass:empty})});
 if(cycle<19&&empty)location.href="/__official/flow?cycle="+(cycle+1);
}catch(error){await fetch("/__official/report",{method:"POST",body:JSON.stringify({kind:"flow",cycle,error:String(error),pass:false})})}`;

interface OfficialResult {
  kind: "page" | "flow";
  index?: number;
  cycle?: number;
  route?: string;
  pass: boolean;
  error?: string;
}

/** Run the complete ordered documentation navigation and preserved worker cancellation regression. */
export async function officialFirefoxChecks(root = repositoryRoot): Promise<void> {
  const runtime = await officialFirefoxRuntime(root);
  const output = path.join(root, ".artifacts/checks/official-firefox");
  const modules = path.join(output, "modules");
  const site = path.join(root, "_site");
  const core = process.env.ACME_RELEASE_CONSUMER ? path.join(process.env.ACME_RELEASE_CONSUMER, "node_modules/@acmelabs/design-system") : path.join(root, "packages/core");
  const fixture = path.join(root, "src/components/flow-diagram/__tests__/flow-diagram.browser.ts");
  fs.mkdirSync(output, { recursive: true });
  const build = await Bun.build({
    entrypoints: [fixture],
    outdir: modules,
    naming: "[name].js",
    splitting: true,
    target: "browser",
    format: "esm",
    plugins: [
      {
        name: "official-flow-fixture",
        setup(builder) {
          builder.onLoad({ filter: /flow-diagram\.browser\.ts$/ }, async (args) => ({
            contents: componentFixtureSource(await Bun.file(args.path).text(), args.path, root, core),
            loader: "ts",
            resolveDir: core,
          }));
        },
      },
      browserAssetPlugin(path.join(core, "dist")),
    ],
  });
  if (!build.success) {
    throw new AggregateError(build.logs, "Official Firefox fixture build failed");
  }
  const html = fs.readFileSync(path.join(site, "index.html"), "utf8");
  const nav = /window\.__docsNav = (.*?);<\/script>/.exec(html)?.[1];
  if (!nav) {
    throw new Error("Documentation navigation metadata missing");
  }
  const routes = (JSON.parse(nav) as { items: { href: string }[] }[]).flatMap((group) => group.items).map((item) => item.href);
  const pageHtml = html.replace(/href="https:\/\/fonts\.googleapis\.com[^"]*"/g, 'href="data:text/css,"').replace("<head>", "<head><script>" + docsProbe + "</script>");
  const results: OfficialResult[] = [];
  let finish: (status: string) => void = () => {
    throw new Error("Official browser completion was not initialized");
  };
  const done = new Promise<string>((resolve) => {
    finish = resolve;
  });
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/__official/report" && request.method === "POST") {
        const result = (await request.json()) as OfficialResult;
        results.push(result);
        console.log("official Firefox", result.kind, result.route ?? result.cycle, result.pass ? "PASS" : "FAIL");
        if (!result.pass) {
          finish("failed");
        } else if (result.kind === "flow" && result.cycle === 19) {
          finish("complete");
        }
        return new Response("recorded");
      }
      if (url.pathname === "/__official/flow") {
        return new Response('<!doctype html><link rel="stylesheet" href="/tokens.css"><script type="module">' + flowProbe + "</script>", { headers: { "Content-Type": "text/html" } });
      }
      let filePath: string;
      if (url.pathname === "/tokens.css") {
        filePath = path.join(core, "dist/styles/tokens.css");
      } else if (url.pathname === "/elk-worker.js") {
        filePath = path.join(core, "dist/shared/elk-worker.js");
      } else if (url.pathname.startsWith("/__official/modules/")) {
        filePath = path.resolve(modules, url.pathname.slice("/__official/modules/".length));
      } else {
        filePath = path.resolve(site, "." + url.pathname);
      }
      if (![site, modules, path.join(core, "dist")].some((directory) => filePath === directory || filePath.startsWith(directory + path.sep))) {
        return new Response("Invalid path", { status: 400 });
      }
      const asset = Bun.file(filePath);
      if ((await asset.exists()) && !fs.statSync(filePath).isDirectory()) {
        return new Response(asset);
      }
      if (path.extname(url.pathname)) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(pageHtml, { headers: { "Content-Type": "text/html" } });
    },
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "acme-official-firefox-"));
  fs.writeFileSync(
    path.join(profile, "user.js"),
    'user_pref("browser.shell.checkDefaultBrowser",false);\nuser_pref("browser.startup.homepage_override.mstone","ignore");\nuser_pref("ui.prefersReducedMotion",1);\n',
  );
  const child = Bun.spawn([runtime.executable, "-no-remote", "-headless", "-profile", profile, server.url.href + "?__acme_docs=0"], { stdout: "pipe", stderr: "pipe" });
  const stdout = new Response(child.stdout).text(),
    stderr = new Response(child.stderr).text();
  const timer = setTimeout(() => finish("timeout"), 600000);
  void child.exited.then((code) => finish("browser exited: " + code));
  let status: string;
  try {
    status = await done;
  } finally {
    clearTimeout(timer);
    child.kill();
    await child.exited;
    server.stop(true);
    fs.rmSync(profile, { recursive: true, force: true });
  }
  await Bun.write(path.join(output, "results.json"), JSON.stringify({ runtime, status, routes, results, stdout: await stdout, stderr: await stderr }, null, 2) + "\n");
  assert.equal(status, "complete");
  assert.deepEqual(
    results.filter((result) => result.kind === "page").map((result) => result.route),
    routes,
  );
  assert.deepEqual(
    results.filter((result) => result.kind === "flow").map((result) => result.cycle),
    Array.from({ length: 20 }, (_, index) => index),
  );
  assert.ok(results.every((result) => result.pass));
}

if (import.meta.main) {
  if (process.argv[2] === "install") {
    console.log(await officialFirefoxRuntime());
  } else {
    await officialFirefoxChecks();
  }
}
