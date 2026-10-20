import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { AcmeTabs } from "../tabs";

const root = path.resolve(import.meta.dir, "../../../.."),
  output = path.join(root, ".artifacts/tabs-indicator");
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) {
  throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright runtime directory");
}
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const pw = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const build = await Bun.build({
  entrypoints: [path.join(import.meta.dir, "tabs.browser.ts")],
  outdir: output,
  target: "browser",
  format: "esm",
  splitting: true,
  naming: { entry: "fixture.js" },
});
if (!build.success) {
  throw new AggregateError(build.logs, "Tabs browser fixture build failed");
}
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(
        '<!doctype html><link rel="stylesheet" href="/tokens.css"><style>body{margin:24px}main{width:560px;max-width:100%}</style><script type="module" src="/fixture.js"></script>',
        { headers: { "Content-Type": "text/html" } },
      );
    }
    const file = Bun.file(url.pathname === "/tokens.css" ? path.join(root, "src/generated/css/document/tokens.css") : path.join(output, url.pathname));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});
const reports = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    const browser = await pw[engine].launch({
      headless: true,
      ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}),
    });
    try {
      const page = await browser.newPage({
        viewport: { width: 900, height: 650 },
        reducedMotion: "reduce",
      });
      page.setDefaultTimeout(10000);
      const errors: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(String(error)));
      for (const variant of ["primary", "inset"] as const) {
        for (const orientation of ["horizontal", "vertical"] as const) {
          await page.goto(server.url.href);
          await page.locator("acme-tab button").first().waitFor();
          await page.locator("acme-tabs").evaluate(
            (tabs: AcmeTabs, settings: { variant: "primary" | "inset"; orientation: "horizontal" | "vertical" }) => {
              tabs.variant = settings.variant;
              tabs.orientation = settings.orientation;
            },
            { variant, orientation },
          );
          const selected = page.locator("acme-tab button").nth(1);
          await selected.click();
          await selected.hover();
          await page.waitForFunction(() => document.querySelector("acme-tabs")?.value === "output");
          await page.waitForFunction(() => {
            const indicator = document.querySelector("acme-tabs")?.shadowRoot?.querySelector("acme-selection-indicator");
            return indicator && !indicator.isAnimating && !indicator.shadowRoot?.querySelector<HTMLElement>("[part=paint]")?.hidden;
          });
          const geometry = await page.locator("acme-tabs").evaluate((tabs: AcmeTabs) => {
            const indicator = tabs.shadowRoot!.querySelector("acme-selection-indicator")!,
              paint = indicator.shadowRoot!.querySelector<HTMLElement>("[part=paint]")!,
              target = indicator.target!,
              button = tabs.querySelectorAll("acme-tab")[1].shadowRoot!.querySelector("button")!;
            return {
              targetIsSelected: target === (tabs.variant === "inset" ? button : button.querySelector("[part=label]")),
              paint: paint.getBoundingClientRect().toJSON(),
              target: target.getBoundingClientRect().toJSON(),
              color: getComputedStyle(paint).backgroundColor,
              stacking: getComputedStyle(indicator).zIndex,
              focused: button.matches(":focus"),
              hovered: button.matches(":hover"),
            };
          });
          assert.equal(geometry.targetIsSelected, true);
          assert.equal(geometry.focused, true);
          assert.equal(geometry.hovered, true);
          if (variant === "primary") {
            if (orientation === "horizontal") {
              assert.ok(Math.abs(geometry.paint.x + geometry.paint.width / 2 - geometry.target.x - geometry.target.width / 2) < 1);
            } else {
              assert.ok(Math.abs(geometry.paint.y + geometry.paint.height / 2 - geometry.target.y - geometry.target.height / 2) < 1);
            }
          } else {
            assert.equal(geometry.stacking, "-1");
          }
          const x = Math.floor(variant === "inset" ? geometry.paint.x + 8 : geometry.paint.x + geometry.paint.width / 2);
          const y = Math.floor(geometry.paint.y + geometry.paint.height / 2);
          const png = (await page.screenshot()).toString("base64");
          const pixels = await page.evaluate(
            async ({ png, x, y, color }: { png: string; x: number; y: number; color: string }) => {
              const image = new Image();
              image.src = "data:image/png;base64," + png;
              await image.decode();
              const canvas = document.createElement("canvas");
              canvas.width = image.width;
              canvas.height = image.height;
              const context = canvas.getContext("2d")!;
              context.drawImage(image, 0, 0);
              const actual = [...context.getImageData(x, y, 1, 1).data];
              context.fillStyle = color;
              context.fillRect(0, 0, 1, 1);
              return { actual, expected: [...context.getImageData(0, 0, 1, 1).data] };
            },
            { png, x, y, color: geometry.color },
          );
          assert.deepEqual(pixels.actual, pixels.expected, `${engine} ${variant} ${orientation}: selected indicator must paint under focused hover`);
          reports.push({ engine, variant, orientation, geometry, pixels, pass: true });
          console.log(engine, variant, orientation, "PASS");
        }
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
    }
  }
} finally {
  server.stop(true);
}
fs.mkdirSync(output, { recursive: true });
await Bun.write(path.join(output, "results.json"), JSON.stringify(reports, null, 2) + "\n");
