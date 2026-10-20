import { expect, test } from "bun:test";
import "../../all";

test("removing scalar input attributes restores their declared component defaults", async () => {
  const cases: [string, string, string, string | number][] = [
    ...["select", "combobox", "multi-select"].flatMap((name): [string, string, string, string | number][] => [
      [name, "placeholder", "placeholder", ""],
      [name, "side", "side", "bottom"],
      [name, "align", "align", "start"],
      [name, "sideOffset", "side-offset", 4],
    ]),
    ...["menu", "context-menu"].flatMap((name): [string, string, string, string | number][] => [
      [name, "placement", "placement", "bottom-start"],
      [name, "sideOffset", "side-offset", 4],
    ]),
    ...["menu-item", "split-button-item"].flatMap((name): [string, string, string, string | number][] => [
      [name, "value", "value", ""],
      [name, "type", "type", "action"],
      [name, "name", "name", ""],
      [name, "href", "href", ""],
      [name, "target", "target", ""],
      [name, "rel", "rel", ""],
      [name, "textValue", "text-value", ""],
    ]),
    ["menu-section", "heading", "heading", ""],
    ["option", "section", "section", ""],
    ["tree-item", "value", "value", ""],
    ["split-button", "size", "size", "medium"],
    ["split-button", "variant", "variant", "default"],
    ["split-button", "menuLabel", "menu-label", ""],
  ];
  for (const [name, property, attribute, expected] of cases) {
    const element = document.createElement("acme-" + name) as HTMLElement & { updateComplete: Promise<unknown>; [key: string]: unknown };
    document.body.append(element);
    try {
      await element.updateComplete;
      element.setAttribute(attribute, String(expected));
      await element.updateComplete;
      element.removeAttribute(attribute);
      await element.updateComplete;
      expect(element[property], name + "." + property).toBe(expected);
    } finally {
      element.remove();
    }
  }
});
