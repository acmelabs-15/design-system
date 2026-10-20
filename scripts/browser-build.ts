import type { BuildConfig } from "bun";

/** Build a browser delivery artifact with explicit dependency selection. */
export function buildProductionBrowser(config: Omit<BuildConfig, "target" | "conditions">) {
  return Bun.build({
    ...config,
    target: "browser",
    conditions: ["browser", "production"],
    define: { ...config.define, "process.env.NODE_ENV": JSON.stringify("production") },
  });
}
