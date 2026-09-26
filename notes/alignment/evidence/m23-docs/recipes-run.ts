import assert from "node:assert/strict";
import path from "node:path";
import { docStates, recipes } from "../../../../site/recipes";

const root = path.resolve(import.meta.dir, "../../../..");
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright installation directory.");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const pw = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const base = process.env.ACME_DOCS_URL ?? "http://localhost:4180";
const report: unknown[] = [];
const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(read: () => Promise<unknown>, expected: unknown) {
  let actual: unknown;
  for (let index = 0; index < 100; index++) {
    actual = await read();
    if (JSON.stringify(actual) === JSON.stringify(expected)) return;
    await sleep(50);
  }
  assert.deepEqual(actual, expected);
}

for (const engine of (process.env.ACME_BROWSER_ENGINES ?? "chromium,firefox,webkit").split(",")) {
  const browser = await pw[engine].launch({
    headless: true,
    ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH
      ? { executablePath: process.env.ACME_CHROMIUM_PATH }
      : {}),
  });
  const page = await browser.newPage({
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  page.setDefaultTimeout(10000);
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
  const cdp = engine === "chromium" ? await page.context().newCDPSession(page) : undefined;
  await page.addInitScript(() => {
    const attach = HTMLElement.prototype.attachInternals;
    const internals = new WeakMap<HTMLElement, ElementInternals>();
    (window as any).__recipeInternals = internals;
    HTMLElement.prototype.attachInternals = function () {
      const value = attach.call(this);
      internals.set(this, value);
      return value;
    };
    const Original = window.ResizeObserver;
    const observers: Set<Element>[] = [];
    (window as any).__recipeResizeTargets = observers;
    window.ResizeObserver = class extends Original {
      private targets = new Set<Element>();
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        observers.push(this.targets);
      }
      observe(target: Element, options?: ResizeObserverOptions) {
        this.targets.add(target);
        super.observe(target, options);
      }
      unobserve(target: Element) {
        this.targets.delete(target);
        super.unobserve(target);
      }
      disconnect() {
        this.targets.clear();
        super.disconnect();
      }
    };
  });
  let errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  const checks: unknown[] = [];
  for (const state of docStates.filter(
    (state) =>
      !process.env.ACME_RECIPE_STATES ||
      process.env.ACME_RECIPE_STATES.split(",").includes(state.name),
  )) {
    const record = recipes.find((recipe) =>
      recipe.examples.some((source) => source.exampleId === state.exampleId),
    );
    if (!record) throw new Error("No recipe for " + state.exampleId);
    const source = record.examples.find((source) => source.exampleId === state.exampleId)!;
    const mountedId = `${record.id}-${slug(source.example.h)}`;
    const selector = `[data-example="${mountedId}"] > .preview`;
    errors = [];
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`${base}/recipes/${record.id}`, { waitUntil: "domcontentloaded" });
      const preview = page.locator(selector);
      await preview.waitFor({ state: "visible" });
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".example-error")].every(
          (element) => (element as HTMLElement).hidden,
        ),
      );
      await page.evaluate(async () => {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
      });
      if (state.name === "settings-submitted") {
        const control = preview.locator('acme-switch[name="email"] input');
        await until(
          () =>
            control.evaluate((element: HTMLInputElement) =>
              element.ariaLabelledByElements?.map((label) => label.textContent).join(" "),
            ),
          "Email updates",
        );
        assert.equal(await control.getAttribute("role"), "switch");
        if (cdp) {
          const { nodes } = await cdp.send("Accessibility.getFullAXTree");
          assert.deepEqual(
            nodes
              .filter((node: any) => node.role?.value === "switch")
              .map((node: any) => node.name?.value)
              .sort(),
            ["Email updates", "Security alerts"],
          );
        }
        await control.focus();
        await page.keyboard.press("Space");
        await preview.getByRole("button", { name: "Save settings", exact: true }).click();
        await until(
          () => preview.locator("output").textContent(),
          "Saved locally: email off, security on",
        );
      } else if (state.name === "integration-action") {
        const url = page.url();
        await preview.getByRole("button", { name: "Manage integration", exact: true }).click();
        assert.equal(await preview.locator("output").textContent(), "Manage requested.");
        assert.equal(page.url(), url);
      } else if (state.name === "metric-selected") {
        await preview.locator('acme-radio-card[value="requests"] input').focus();
        await page.keyboard.press("ArrowRight");
        await until(
          () => preview.locator("acme-radio-group").evaluate((element: any) => element.value),
          "errors",
        );
        assert.equal(await preview.locator("output").textContent(), "Selected metric: errors");
      } else if (state.name === "file-branch-collapsed") {
        await preview.locator('[data-tree-row="source"]').focus();
        await page.keyboard.press("ArrowLeft");
        await until(
          () => preview.locator("acme-tree-view").evaluate((element: any) => element.expanded),
          [],
        );
        assert.equal(await preview.locator('[data-tree-row="index"]').isVisible(), false);
        assert.equal(
          await preview
            .locator('[data-tree-row="index"]')
            .evaluate((element: Element) => Boolean(element.closest("[inert]"))),
          true,
        );
        await page.keyboard.press("ArrowDown");
        assert.equal(
          await preview
            .locator('[data-tree-row="package"]')
            .evaluate(
              (element: Element) =>
                element.getRootNode() instanceof ShadowRoot &&
                (element.getRootNode() as ShadowRoot).activeElement === element,
            ),
          true,
        );
      } else if (state.name === "confirmation-enabled") {
        await preview.getByRole("button", { name: "Confirm deletion", exact: true }).click();
        const dialog = preview.locator("acme-alert-dialog");
        await until(() => dialog.evaluate((element: any) => element.open), true);
        const action = dialog.getByRole("button", { name: "Delete project", exact: true });
        assert.equal(await action.isDisabled(), true);
        await dialog.locator("acme-input input").fill("DELETE");
        await until(() => action.isEnabled(), true);
        await action.click();
        await until(() => dialog.evaluate((element: any) => element.open), false);
        assert.equal(await preview.locator("output").textContent(), "Confirmation recorded.");
        await until(
          () =>
            preview
              .getByRole("button", { name: "Confirm deletion", exact: true })
              .evaluate(
                (element: Element) =>
                  element.getRootNode() instanceof ShadowRoot &&
                  (element.getRootNode() as ShadowRoot).activeElement === element,
              ),
          true,
        );
      } else if (state.name === "confirmation-retry") {
        await preview.getByRole("button", { name: "Save changes", exact: true }).click();
        const dialog = preview.locator("acme-alert-dialog");
        await until(() => dialog.evaluate((element: any) => element.open), true);
        await dialog.getByRole("button", { name: "Save", exact: true }).click();
        assert.equal(
          await dialog.locator("p[role=alert]").textContent(),
          "The save failed. Try again.",
        );
        assert.equal(await dialog.evaluate((element: any) => element.open), true);
        await dialog.getByRole("button", { name: "Save", exact: true }).click();
        await until(() => dialog.evaluate((element: any) => element.open), false);
      } else if (state.name === "page-size-changed") {
        await preview.getByRole("combobox").click();
        const option = preview.locator("acme-option").filter({ hasText: /^25$/ });
        await until(
          () =>
            option.evaluate((element: HTMLElement) => {
              const internals = (window as any).__recipeInternals.get(element);
              return [internals.role, internals.ariaLabel];
            }),
          ["option", "25"],
        );
        if (cdp) {
          const { nodes } = await cdp.send("Accessibility.getFullAXTree");
          assert.deepEqual(
            nodes
              .filter((node: any) => node.role?.value === "option")
              .map((node: any) => node.name?.value)
              .sort(),
            ["10", "25", "50"],
          );
        }
        await option.click();
        await until(
          () =>
            preview
              .locator("acme-pagination")
              .evaluate((element: any) => [element.pageSize, element.page]),
          [25, 1],
        );
        await until(
          () => preview.locator('acme-pagination-position [part="position"]').textContent(),
          "Page 1 of 6",
        );
      } else if (state.name === "time-details") {
        assert.equal(await preview.locator("[data-utc]").textContent(), "2026-09-23T12:00:00.000Z");
        assert.equal(
          await preview.locator("[data-visible-local]").textContent(),
          "Local time: " + (await preview.locator("[data-local]").textContent()),
        );
        await preview.locator("acme-hover-card > a").focus();
        await until(
          () => preview.locator("acme-hover-card").evaluate((element: any) => element.open),
          true,
        );
        await page.keyboard.press("Escape");
        await until(
          () => preview.locator("acme-hover-card").evaluate((element: any) => element.open),
          false,
        );
      } else if (state.name === "responsive-list-detail" || state.name === "responsive-support") {
        const layout = preview.locator("acme-grid");
        const dimensions = () =>
          layout.evaluate((element: Element) =>
            [...element.children].map((child) => {
              const rect = child.getBoundingClientRect();
              return { x: rect.x, y: rect.y, width: rect.width };
            }),
          );
        let wide = await dimensions();
        assert.ok(wide[1].x > wide[0].x + wide[0].width - 1);
        await page.setViewportSize({ width: 390, height: 844 });
        await until(
          () =>
            layout.evaluate((element: Element) => {
              const a = element.children[0].getBoundingClientRect(),
                b = element.children[1].getBoundingClientRect();
              return b.y > a.y && Math.abs(a.x - b.x) < 2;
            }),
          true,
        );
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        );
        if (state.name === "responsive-list-detail") {
          await preview.getByRole("link", { name: "Project overview", exact: true }).click();
          assert.ok(page.url().endsWith("#pane-project"));
          assert.equal(await preview.locator("#pane-project").isVisible(), true);
        }
        await page.screenshot({
          path: path.join(root, `.artifacts/m23-docs/${engine}-${state.name}.png`),
        });
      } else if (state.name === "task-recorded") {
        await preview.getByRole("button", { name: "Record completion", exact: true }).click();
        assert.equal(await preview.locator("output").textContent(), "Completion recorded locally.");
      } else if (state.name === "virtual-cells" || state.name === "react-virtual-cells") {
        const table = preview.locator("acme-table");
        await preview.locator("[data-cell]").first().waitFor();
        assert.ok(
          Number(await preview.locator('table[role="grid"]').getAttribute("aria-rowcount")) > 20,
        );
        const initial = await preview
          .locator("tbody [data-row]")
          .evaluateAll((elements: Element[]) =>
            elements.map((element) => element.getAttribute("data-row")),
          );
        await table.evaluate((element: any) =>
          element.getScrollElement().scrollTo({ top: 1200, left: 600 }),
        );
        await until(
          () =>
            preview
              .locator("tbody [data-row]")
              .evaluateAll(
                (elements: Element[], original: string[]) =>
                  JSON.stringify(elements.map((element) => element.getAttribute("data-row"))) !==
                  JSON.stringify(original),
                initial,
              ),
          true,
        );
        assert.ok((await preview.locator("[data-cell][aria-colindex]").count()) > 0);
        assert.ok((await preview.locator("[data-row][aria-rowindex]").count()) > 0);
        const first = preview.locator("[data-cell]").first();
        await first.focus();
        const originalId = await first.getAttribute("data-cell");
        await page.keyboard.press("ArrowDown");
        await until(
          () =>
            page.evaluate((old: string) => {
              let active: Element | null = document.activeElement;
              while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
              return Boolean(
                active?.hasAttribute("data-cell") && active.getAttribute("data-cell") !== old,
              );
            }, originalId),
          true,
        );
        await table.evaluate((element: any) => {
          (window as any).__recipeOldScroll = element.getScrollElement();
        });
        await until(
          () =>
            page.evaluate(() =>
              (window as any).__recipeResizeTargets.some((targets: Set<Element>) =>
                targets.has((window as any).__recipeOldScroll),
              ),
            ),
          true,
        );
        if (state.name === "react-virtual-cells")
          await preview.locator("docs-table-virtual-react").evaluate((element: Element) => {
            (window as any).__recipeOldHost = element;
          });
        await page.locator('a[href="/components/button"]').first().click();
        await page.locator("article#button").waitFor();
        await until(
          () =>
            page.evaluate(() =>
              (window as any).__recipeResizeTargets.some((targets: Set<Element>) =>
                targets.has((window as any).__recipeOldScroll),
              ),
            ),
          false,
        );
        if (state.name === "react-virtual-cells")
          assert.equal(
            await page.evaluate(() => (window as any).__recipeOldHost.querySelector("acme-table")),
            null,
          );
      } else throw new Error("No oracle for " + state.name);
      assert.deepEqual(errors, []);
      checks.push({ name: state.name, exampleId: state.exampleId, pass: true });
      console.log(engine, "PASS", state.name);
    } catch (error) {
      checks.push({
        name: state.name,
        exampleId: state.exampleId,
        pass: false,
        error: String(error),
        pageErrors: [...errors],
      });
      console.error(engine, "FAIL", state.name, String(error));
    }
  }
  report.push({ engine, version: browser.version(), checks });
  await browser.close();
  await Bun.write(
    path.join(root, ".artifacts/m23-docs/recipes-results.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        base,
        fontMode: "offline fallback; no font-appearance claim",
        results: report,
      },
      null,
      2,
    ) + "\n",
  );
}
if (report.some((entry: any) => entry.checks.some((check: any) => !check.pass)))
  process.exitCode = 1;
