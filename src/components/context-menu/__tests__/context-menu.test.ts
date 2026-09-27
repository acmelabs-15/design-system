import { expect, test } from "bun:test";
import "../../../all";

test("disabled context menu preserves the browser context event", async () => {
  const menu = document.createElement("acme-context-menu");
  menu.disabled = true;
  menu.textContent = "Target";
  document.body.append(menu);
  await menu.updateComplete;
  const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
  menu.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  expect(menu.open).toBe(false);
  expect(menu.shadowRoot!.querySelector("[part=trigger]")!.getAttribute("tabindex")).toBe("0");
  menu.remove();
});
