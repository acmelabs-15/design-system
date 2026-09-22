import { expect, test } from "bun:test";
import "../../../all";
test("Split Button composes Group and Menu with a required trigger name", async () => {
  const split = document.createElement("acme-split-button");
  split.menuLabel = "More save actions";
  split.innerHTML = 'Save<acme-split-button-item slot="items" value="copy">Save copy</acme-split-button-item>';
  document.body.append(split);
  await split.updateComplete;
  const group = split.shadowRoot!.querySelector("acme-group")!;
  expect(group.attached).toBe(true);
  expect(split.shadowRoot!.querySelector("acme-menu")).toBeTruthy();
  expect(split.shadowRoot!.querySelector("acme-menu-trigger")!.getAttribute("aria-label")).toBe("More save actions");
  expect("menuButtonLabel" in split).toBe(false);
  expect("menuWidth" in split).toBe(false);
  split.remove();
});
test("loading closes Split Button menu", async () => {
  const split = document.createElement("acme-split-button");
  split.menuLabel = "More";
  split.open = true;
  split.loading = true;
  document.body.append(split);
  await split.updateComplete;
  expect(split.open).toBe(false);
  split.remove();
});
