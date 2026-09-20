import { afterEach, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fetch as nativeFetch } from "bun";

const fixtures: { root: string; child: ReturnType<typeof Bun.spawn> }[] = [];
afterEach(async () => {
  for (const { root, child } of fixtures.splice(0)) {
    child.kill();
    await child.exited;
    await rm(root, { recursive: true, force: true });
  }
});

async function waitFor<T>(read: () => Promise<T>, accepts: (value: T) => boolean): Promise<T> {
  const deadline = Date.now() + 5000;
  let value: T;
  do {
    value = await read();
    if (accepts(value)) return value;
    await Bun.sleep(25);
  } while (Date.now() < deadline);
  throw new Error(`Expected watcher outcome was not observed: ${JSON.stringify(value!)}`);
}

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "acme-dev-watch-"));
  for (const dir of ["scripts", "styles", "src/generated", "docs-src", "docs", "dist"]) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  const source = process.env.ACME_DEV_TEST_SOURCE ? await Bun.file(process.env.ACME_DEV_TEST_SOURCE).text() : await Bun.file(path.join(import.meta.dir, "../dev.ts")).text();
  await Bun.write(path.join(root, "scripts/dev.ts"), `${source.replace("Bun.serve({", "const server = Bun.serve({").replace("port: 4180", "port: 0")}\nconsole.log("TEST_PORT=" + server.port);\n`);
  await Bun.write(path.join(root, "styles/house.css"), "initial");
  await Bun.write(path.join(root, "docs/index.html"), "initial");
  await Bun.write(path.join(root, "runs.txt"), "0");
  await Bun.write(
    path.join(root, "scripts/split-css.ts"),
    'const css = await Bun.file("styles/house.css").text(); if(css==="FAIL"){await Bun.write("failure.txt","rejected");process.exit(1);} await Bun.write("src/generated/theme.css",css); await Bun.write("src/probe.styles.ts",css); await Bun.write("runs.txt",String(Number(await Bun.file("runs.txt").text())+1));',
  );
  await Bun.write(path.join(root, "scripts/build.ts"), 'await Bun.write("dist/page.html",await Bun.file("src/generated/theme.css").text());');
  await Bun.write(path.join(root, "docs-src/build.ts"), 'await Bun.write("docs/index.html",await Bun.file("dist/page.html").text());');
  const child = Bun.spawn([process.execPath, "scripts/dev.ts", "--no-build"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  fixtures.push({ root, child });
  const reader = child.stdout.getReader();
  let output = "";
  while (!/TEST_PORT=\d+\n/.test(output)) {
    const chunk = await reader.read();
    if (chunk.done) throw new Error("Development server exited before listening");
    output += new TextDecoder().decode(chunk.value);
  }
  const port = Number(output.match(/TEST_PORT=(\d+)/)?.[1]);
  expect(port).toBeGreaterThan(0);
  void (async () => {
    while (!(await reader.read()).done) {}
  })();
  void new Response(child.stderr).text();
  return {
    root,
    page: async () => (await nativeFetch(`http://127.0.0.1:${port}/`)).text(),
    runs: () => Bun.file(path.join(root, "runs.txt")).text(),
  };
}

test("an authored stylesheet change reaches the served page without a regeneration loop", async () => {
  const f = await fixture();
  await Bun.write(path.join(f.root, "styles/house.css"), "changed stylesheet");
  expect(await waitFor(f.page, (value) => value === "changed stylesheet")).toBe("changed stylesheet");
  await Bun.sleep(500);
  expect(await f.runs()).toBe("1");
  await Bun.write(path.join(f.root, "src/generated/theme.css"), "generated only");
  await Bun.write(path.join(f.root, "src/probe.styles.ts"), "generated only");
  expect(await waitFor(f.page, (value) => value === "generated only")).toBe("generated only");
  await Bun.sleep(500);
  expect(await f.runs()).toBe("1");
}, 10000);

test("a failed style generation leaves the last successful page intact", async () => {
  const f = await fixture();
  await Bun.write(path.join(f.root, "styles/house.css"), "successful");
  await waitFor(f.page, (value) => value === "successful");
  await Bun.write(path.join(f.root, "styles/house.css"), "FAIL");
  await waitFor(
    () => Bun.file(path.join(f.root, "failure.txt")).exists(),
    (exists) => exists,
  );
  expect(await f.page()).toBe("successful");
  expect(await f.runs()).toBe("1");
}, 10000);
