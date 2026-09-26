import { expect, test } from "bun:test";
import "../../../all";

const settle = async (tabs: HTMLElement & { updateComplete: Promise<unknown> }) => {
  await tabs.updateComplete;
  await Promise.all([...tabs.querySelectorAll("acme-tab,acme-tab-panel")].map((part) => (part as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete));
  await tabs.updateComplete;
};
test("one initial enabled value owns panel state and later writes stay silent", async () => {
  const tabs = document.createElement("acme-tabs");
  tabs.innerHTML =
    '<acme-tab disabled value="off">Off</acme-tab><acme-tab value="one">One</acme-tab><acme-tab value="two">Two</acme-tab><acme-tab-panel slot="panels" value="one"><input value="keep"></acme-tab-panel><acme-tab-panel slot="panels" value="two">Second</acme-tab-panel>';
  document.body.append(tabs);
  await settle(tabs);
  const [one, two] = [...tabs.querySelectorAll("acme-tab-panel")];
  const input = one.querySelector("input");
  expect(tabs.value).toBe("one");
  expect(one.hidden).toBe(false);
  expect(two.hidden).toBe(true);
  let events = 0;
  tabs.addEventListener("acme-change", () => events++);
  tabs.value = "two";
  await settle(tabs);
  expect(one.hidden).toBe(true);
  expect(two.hidden).toBe(false);
  expect(one.querySelector("input")).toBe(input);
  expect(events).toBe(0);
  tabs.value = undefined;
  await settle(tabs);
  expect(one.hidden && two.hidden).toBe(true);
  expect(tabs.value).toBeUndefined();
  tabs.remove();
});
test("Tabs expose primary/inset and automatic/manual without child selected state", async () => {
  const tabs = document.createElement("acme-tabs");
  tabs.innerHTML = '<acme-tab value="one">One</acme-tab>';
  document.body.append(tabs);
  await settle(tabs);
  const tab = tabs.querySelector("acme-tab")!;
  expect(tabs.variant).toBe("primary");
  expect(tabs.activation).toBe("automatic");
  expect(tabs.orientation).toBe("horizontal");
  expect("selected" in tab).toBe(false);
  expect("tooltip" in tab).toBe(false);
  expect(() => (tabs.variant = "secondary" as never)).toThrow();
  tabs.setAttribute("variant", "inset");
  tabs.setAttribute("activation", "manual");
  tabs.removeAttribute("variant");
  tabs.removeAttribute("activation");
  expect(tabs.variant).toBe("primary");
  expect(tabs.activation).toBe("automatic");
  tabs.remove();
});
