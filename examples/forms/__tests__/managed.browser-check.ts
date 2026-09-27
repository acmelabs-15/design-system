import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { managedFormConsumer } from "./consumer";

const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) {
  throw new Error("Set ACME_BROWSER_RUNTIME");
}
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const browsers = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const results: { engine: string; framework: string; checks: string[]; errors: string[]; error?: string }[] = [];
const consumer = await managedFormConsumer();
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    const browser = await browsers[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    try {
      for (const [framework, tag] of [
        ["lit", "docs-form-demo"],
        ["react", "docs-form-react"],
      ]) {
        const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
        page.setDefaultTimeout(12000);
        const report = { engine, framework, checks: [] as string[], errors: [] as string[], error: undefined as string | undefined };
        page.on("pageerror", (error: Error) => report.errors.push(String(error)));
        await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, (route: any) => route.abort());
        try {
          await page.goto(consumer.url, { waitUntil: "domcontentloaded" });
          const demo = page.locator(tag),
            name = demo.locator('acme-input[name="profile.name"] input');
          await name.waitFor();
          await demo.locator('acme-input[name="contacts[0].email"] input').waitFor();
          const removeFits = await demo.getByRole("button", { name: "Remove contact 1", exact: true }).evaluate((target: HTMLButtonElement) => {
            const control = (target.getRootNode() as ShadowRoot).host;
            const range = document.createRange();
            range.selectNodeContents(control);
            const text = range.getBoundingClientRect();
            const button = target.getBoundingClientRect();
            return text.width > 0 && text.left >= button.left - 0.5 && text.right <= button.right + 0.5;
          });
          assert.ok(removeFits, "The Remove label fits its button at 320px");
          report.checks.push("the narrow array row preserves the complete action label");
          assert.equal(await demo.getByRole("form", { name: "Profile", exact: true }).evaluate((form: HTMLFormElement) => form.reportValidity()), false);
          await page.waitForFunction((selector: string) => {
            const control = document.querySelector(selector)!.querySelector('acme-input[name="profile.name"]')!;
            return control.shadowRoot?.activeElement?.localName === "input";
          }, tag);
          report.checks.push("native required reporting focuses the first invalid control");
          await name.fill("A");
          await name.press("Tab");
          await page.waitForFunction((selector: string) => (document.querySelector(selector)!.querySelector("acme-field") as any).invalid, tag);
          assert.match(await demo.locator('[slot="error"]').first().textContent(), /two letters/);
          assert.equal(await demo.locator('acme-input[name="profile.name"]').evaluate((control: any) => control.validity.valid), true);
          report.checks.push("managed errors remain distinct from native validity");
          await name.fill("Ada");
          await demo.locator('acme-input[name="contacts[0].email"] input').fill("ada@example.com");
          await demo.getByRole("button", { name: "Add contact", exact: true }).click();
          await demo.locator('acme-input[name="contacts[1].email"] input').fill("grace@example.com");
          await demo.getByRole("button", { name: "Remove contact 1", exact: true }).click();
          await page.waitForFunction((selector: string) => (document.querySelector(selector)!.querySelector('acme-input[name="contacts[0].email"]') as any)?.value === "grace@example.com", tag);
          assert.equal(await demo.locator("acme-input").evaluateAll((controls: any[]) => controls.filter((control) => control.type === "email").length), 1);
          report.checks.push("nested fields and array insertion/removal retain the correct value");
          const values = await demo.getByRole("form", { name: "Profile", exact: true }).evaluate((form: HTMLFormElement) => Object.fromEntries(new FormData(form).entries()));
          assert.equal(values["profile.name"], "Ada");
          assert.equal(values["contacts[0].email"], "grace@example.com");
          assert.ok(Object.hasOwn(values, "updates"));
          report.checks.push("native FormData contains the named nested fields and boolean control");
          await name.evaluate((input: HTMLInputElement) => {
            input.value = "Grace";
            input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, inputType: "insertText" }));
            (input.getRootNode() as ShadowRoot).host.closest("form")!.requestSubmit();
          });
          await page.waitForFunction((selector: string) => {
            const value = document.querySelector(selector)!.querySelector("output")?.textContent;
            return value?.includes('"name":"Grace"') && value.includes("grace@example.com");
          }, tag);
          report.checks.push("submission before the next render reads the current TanStack value");
          await demo.getByRole("button", { name: "Disable fields", exact: true }).click();
          await page.waitForFunction((selector: string) => (document.querySelector(selector)!.querySelector('acme-input[name="profile.name"]') as any).disabled, tag);
          assert.deepEqual(await demo.getByRole("form", { name: "Profile", exact: true }).evaluate((form: HTMLFormElement) => [...new FormData(form).keys()]), []);
          await demo.getByRole("button", { name: "Enable fields", exact: true }).click();
          await demo.getByRole("button", { name: "Reset form", exact: true }).click();
          await page.waitForFunction((selector: string) => {
            const owner = document.querySelector(selector)!;
            return (owner.querySelector('acme-input[name="profile.name"]') as any).value === "" && owner.querySelector("output")?.textContent === "";
          }, tag);
          assert.equal(await demo.locator("acme-input").evaluateAll((controls: any[]) => controls.filter((control) => control.type === "email").length), 1);
          assert.equal(await demo.locator("acme-field").evaluateAll((fields: any[]) => fields.filter((field) => field.invalid).length), 0);
          report.checks.push("disabled values are excluded and managed reset restores data and errors");
          await demo.evaluate((owner: HTMLElement) => {
            const parent = owner.parentElement!,
              next = owner.nextSibling;
            const previous = owner.querySelector("acme-input")!;
            owner.remove();
            previous.dispatchEvent(new CustomEvent("acme-input", { detail: { value: "Detached edit" }, bubbles: true, composed: true }));
            if (next) {
              next.before(owner);
            } else {
              parent.append(owner);
            }
          });
          await page.waitForFunction((selector: string) => (document.querySelector(selector)!.querySelector('acme-input[name="profile.name"]') as any)?.value === "", tag);
          await name.fill("Remounted");
          await demo.locator('acme-input[name="contacts[0].email"] input').fill("again@example.com");
          await demo.getByRole("button", { name: "Submit profile", exact: true }).click();
          await page.waitForFunction((selector: string) => document.querySelector(selector)!.querySelector("output")?.textContent?.includes('"name":"Remounted"'), tag);
          report.checks.push("detached edits do not leak through disposal and remount remains usable");
          assert.deepEqual(report.errors, []);
        } catch (error) {
          report.error =
            String(error) +
            " " +
            JSON.stringify(
              await page.evaluate(
                (selector: string) => ({
                  active: document.activeElement?.localName,
                  fields: [...(document.querySelector(selector)?.querySelectorAll("acme-input") ?? [])].map((e: any) => ({
                    name: e.name,
                    value: e.value,
                    invalid: e.invalid,
                    valid: e.validity.valid,
                    active: e.shadowRoot?.activeElement?.localName,
                  })),
                }),
                tag,
              ),
            );
        }
        results.push(report);
        await page.close();
        console.log(engine, framework, report.checks.length, report.error ?? "PASS");
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  consumer.dispose();
}
const output = process.env.ACME_FORMS_RESULTS ?? ".artifacts/checks/managed-forms.json";
fs.mkdirSync(path.dirname(output), { recursive: true });
await Bun.write(output, JSON.stringify(results, null, 2) + "\n");
assert.ok(
  results.every((result) => result.checks.length === 8 && !result.error && !result.errors.length),
  "Managed form acceptance failed",
);
