import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeText } from "../text";
import type { AcmeHeading } from "../../heading/heading";
import { discoverHeadingTargets } from "../../../shared/heading-targets";
afterEach(() => document.body.replaceChildren());
test("Text keeps native semantics and author nodes", async () => {
  document.body.innerHTML = "<acme-text><strong>Important</strong> text</acme-text>";
  const text = document.querySelector("acme-text") as AcmeText,
    child = text.firstChild;
  await text.updateComplete;
  expect(text.as).toBe("p");
  expect(text.shadowRoot!.querySelector('[part="root"]')?.localName).toBe("p");
  text.as = "span";
  await text.updateComplete;
  expect(text.firstChild).toBe(child);
  expect(text.shadowRoot!.querySelector('[part="root"]')?.localName).toBe("span");
});
test("typography inputs preserve absence and owned responsive values", async () => {
  const text = document.createElement("acme-text") as AcmeText;
  document.body.append(text);
  await text.updateComplete;
  expect(text.size).toBeUndefined();
  expect(text.weight).toBeUndefined();
  const size = { compact: "14px", expanded: "20px" };
  text.size = size;
  size.compact = "99px";
  expect(text.size).toEqual({ compact: "14px", expanded: "20px" });
  expect(Object.isFrozen(text.size)).toBe(true);
  text.size = undefined;
  expect(text.size).toBeUndefined();
});
test("line clamp is a positive count and outranks the single-line flag", async () => {
  const text = document.createElement("acme-text") as AcmeText;
  text.truncate = true;
  text.lineClamp = 2;
  document.body.append(text);
  await text.updateComplete;
  expect(text.hasAttribute("data-acme-text-clamp")).toBe(true);
  expect(() => {
    text.lineClamp = 0;
  }).toThrow();
  text.lineClamp = undefined;
  await text.updateComplete;
  expect(text.hasAttribute("data-acme-text-clamp")).toBe(false);
  expect(text.truncate).toBe(true);
});
test("Heading registers its real native level and authored fragment target", async () => {
  document.body.innerHTML = '<h2 id="native">Native</h2><acme-heading id="house" as="h3">House <em>heading</em></acme-heading>';
  const heading = document.querySelector("acme-heading") as AcmeHeading;
  await heading.updateComplete;
  const targets = discoverHeadingTargets(document.body);
  expect(targets.map((target) => [target.id, target.level, target.label])).toEqual([
    ["native", 2, "Native"],
    ["house", 3, "House heading"],
  ]);
  expect(targets[1].target).toBe(heading);
  expect(targets[1].heading).toBe(heading.getHeadingElement());
  heading.as = "h1";
  heading.textContent = "Updated";
  await heading.updateComplete;
  expect(discoverHeadingTargets(document.body)[1].level).toBe(1);
  expect(discoverHeadingTargets(document.body)[1].label).toBe("Updated");
  heading.remove();
  expect(discoverHeadingTargets(document.body)).toHaveLength(1);
});
test("Heading discovery refreshes after detached content changes", async () => {
  const heading = document.createElement("acme-heading") as AcmeHeading;
  heading.id = "detached";
  heading.textContent = "before";
  document.body.append(heading);
  await heading.updateComplete;
  heading.remove();
  heading.textContent = "after";
  document.body.append(heading);
  await heading.updateComplete;
  expect(discoverHeadingTargets(document.body)[0].label).toBe("after");
});
