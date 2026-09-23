import { expect, test } from "bun:test";
import "../../../define/toolbar";
test("Toolbar exposes canonical orientation, looping and disability", async () => {
  const toolbar = document.createElement("acme-toolbar");
  toolbar.ariaLabel = "Editing";
  document.body.append(toolbar);
  await toolbar.updateComplete;
  expect(toolbar.orientation).toBe("horizontal");
  expect(toolbar.loop).toBe(true);
  expect(toolbar.disabled).toBe(false);
  toolbar.orientation = "vertical";
  toolbar.disabled = true;
  await toolbar.updateComplete;
  expect(toolbar.shadowRoot!.querySelector("[role=toolbar]")!.getAttribute("aria-orientation")).toBe("vertical");
  expect(toolbar.shadowRoot!.querySelector<HTMLElement>("[part=content]")!.inert).toBe(true);
  toolbar.remove();
});
