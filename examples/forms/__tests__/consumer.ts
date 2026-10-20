import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export async function managedFormConsumer() {
  const root = path.resolve(import.meta.dir, "../../..");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "acme-managed-forms-"));
  try {
    const version = JSON.parse(fs.readFileSync(path.join(root, "packages/core/package.json"), "utf8")).version;
    const archive = (name: string) => path.join(root, ".artifacts/release/archives", name + "-" + version + ".tgz");
    const domTypes = JSON.parse(fs.readFileSync(path.join(root, "node_modules/@types/react-dom/package.json"), "utf8")).version;
    const types = JSON.parse(fs.readFileSync(path.join(root, "node_modules/@types/react/package.json"), "utf8")).version;
    fs.writeFileSync(
      path.join(work, "package.json"),
      JSON.stringify({
        name: "managed-form-acceptance",
        private: true,
        type: "module",
        dependencies: {
          "@acmelabs/design-system": "file:" + archive("acmelabs-design-system"),
          "@acmelabs/design-system-react": "file:" + archive("acmelabs-design-system-react"),
          "@tanstack/react-form": "1.33.5",
          react: "19.3.0",
          "react-dom": "19.3.0",
          lit: "3.3.3",
          "@types/react": types,
          "@types/react-dom": domTypes,
        },
      }),
    );
    const install = Bun.spawn([process.execPath, "install", "--ignore-scripts"], { cwd: work, stdout: "pipe", stderr: "pipe" });
    const [stdout, stderr, status] = await Promise.all([new Response(install.stdout).text(), new Response(install.stderr).text(), install.exited]);
    assert.equal(status, 0, stdout + stderr);
    for (const file of ["lit.ts", "react.tsx", "react-entry.ts"]) {
      fs.copyFileSync(path.join(root, "examples/forms", file), path.join(work, file));
    }
    fs.writeFileSync(
      path.join(work, "main.ts"),
      'import {registerManagedFormExample} from "./lit";import {registerReactManagedFormExample} from "./react-entry";registerManagedFormExample();registerReactManagedFormExample();',
    );
    const typecheck = Bun.spawn(
      [
        process.execPath,
        path.join(root, "node_modules/typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--target",
        "ES2022",
        "--module",
        "ESNext",
        "--moduleResolution",
        "bundler",
        "--jsx",
        "react-jsx",
        "main.ts",
      ],
      { cwd: work, stdout: "pipe", stderr: "pipe" },
    );
    const [typeout, typeerror, typecode] = await Promise.all([new Response(typecheck.stdout).text(), new Response(typecheck.stderr).text(), typecheck.exited]);
    assert.equal(typecode, 0, typeout + typeerror);
    const build = await Bun.build({ entrypoints: [path.join(work, "main.ts")], outdir: path.join(work, "built"), target: "browser", format: "esm" });
    assert.ok(build.success, String(build.logs));
    const tokens = fs.readFileSync(path.join(work, "node_modules/@acmelabs/design-system/dist/styles/tokens.css"), "utf8");
    const server = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === "/main.js") {
          return new Response(Bun.file(path.join(work, "built/main.js")));
        }
        return new Response(
          '<!doctype html><html lang="en"><meta charset="utf-8"><style>' +
            tokens +
            '</style><title>Managed forms</title><docs-form-demo></docs-form-demo><docs-form-react></docs-form-react><script type="module" src="/main.js"></script></html>',
          { headers: { "Content-Type": "text/html" } },
        );
      },
    });
    return {
      url: server.url.href,
      dispose() {
        server.stop(true);
        fs.rmSync(work, { recursive: true, force: true });
      },
    };
  } catch (error) {
    fs.rmSync(work, { recursive: true, force: true });
    throw error;
  }
}
