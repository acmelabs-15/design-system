import { expect, test } from "bun:test";
import { exampleSources } from "../example-source";
import manifest from "../../dist/custom-elements.json";
import { intro } from "../pages/foundations";
import { icons } from "../pages/icon-catalog";
import { VERSION } from "../site";

test("copied lazy content imports every nested template element", async () => {
  const [source] = await exampleSources(
    { h: "Lazy", html: "<acme-show when><template><acme-badge>Ready</acme-badge><template><acme-status>Nested</acme-status></template></template></acme-show>" },
    "lazy",
  );
  const browser = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@${manifest["x-acme-version"]}`;
  expect(source.code).toContain(`${browser}/dist/define/show.js`);
  expect(source.code).toContain(`${browser}/dist/define/badge.js`);
  expect(source.code).toContain(`${browser}/dist/define/status.js`);
  expect(source.code).toContain(`${browser}/styles/tokens.css`);
});

test("copied setup helpers use the same browser graph as their definitions", async () => {
  const [source] = await exampleSources({ h: "Setup", html: "<acme-theme><acme-toast></acme-toast></acme-theme>", script: "const store = createToastStore(); registerTheme('brand', {});" }, "setup");
  const browser = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@${manifest["x-acme-version"]}/dist`;
  expect(source.code).toContain(`${browser}/define/theme.js`);
  expect(source.code).toContain(`${browser}/components/toast/toast.js`);
  expect(source.code).toContain(`${browser}/configure.js`);
  expect(source.code).not.toContain("/dist/cdn/");
});

test("foundation and icon instructions point to the versioned browser distribution", () => {
  const browser = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@${VERSION}`;
  const introduction = intro.md!.join("\n");
  expect(introduction).toContain(`${browser}/styles/tokens.css`);
  expect(introduction).toContain(`${browser}/dist/define/button.js`);
  expect(introduction).toContain(`${browser}/bundle/design-system.standalone.min.js`);
  expect(icons.body).toContain(`${browser}/dist/define/home-icon.js`);
  expect(icons.body).toContain(`${browser}/dist/generated/icons/artwork/sharp/filled/home.js`);
  expect(icons.body).toContain("@acmelabs/design-system/icons/home");
  expect(introduction + icons.body).not.toContain("/dist/cdn/");
});
