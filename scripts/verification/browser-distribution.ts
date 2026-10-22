import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

/** Public browser paths have the same meaning in local and packed-consumer checks. */
export function browserDistribution(root: string, explicitPackage: string | undefined, consumerRoot?: string) {
  const packageRoot = explicitPackage ?? (consumerRoot ? path.join(consumerRoot, "node_modules/@acmelabs/design-system-browser") : undefined);
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot ?? path.join(root, "packages/browser"), "package.json"), "utf8"));
  assert.equal(manifest.name, "@acmelabs/design-system-browser", "Expected the browser package");
  assert.equal(typeof manifest.version, "string", "Browser package version is missing");
  const directories = {
    dist: packageRoot ? path.join(packageRoot, "dist") : path.join(root, "dist/cdn"),
    bundle: packageRoot ? path.join(packageRoot, "bundle") : path.join(root, "dist/bundle"),
    styles: packageRoot ? path.join(packageRoot, "styles") : path.join(root, "dist/styles"),
  };
  return {
    version: manifest.version as string,
    moduleRoot: directories.dist,
    file(route: string): string | undefined {
      let decoded: string;
      try {
        decoded = decodeURIComponent(route);
      } catch {
        return undefined;
      }
      for (const [prefix, directory] of Object.entries(directories)) {
        if (!decoded.startsWith(`/${prefix}/`)) {
          continue;
        }
        const file = path.resolve(directory, decoded.slice(prefix.length + 2));
        return !decoded.includes("\0") && file.startsWith(directory + path.sep) ? file : undefined;
      }
      return undefined;
    },
  };
}
