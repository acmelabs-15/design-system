import { expect, test } from "bun:test";
import "../../../define/disabled-wall";

test("Disabled Wall preserves content and its independent disabled states", async () => {
  document.body.innerHTML = '<acme-disabled-wall reason="Editing is unavailable"><input value="Saved"><button disabled>Unavailable action</button></acme-disabled-wall>';
  const wall = document.querySelector("acme-disabled-wall")!;
  const input = wall.querySelector("input")!;
  wall.disabled = true;
  await wall.updateComplete;
  expect(wall.shadowRoot!.querySelector("[part=content]")!.hasAttribute("inert")).toBe(true);
  expect(wall.shadowRoot!.querySelector("[part=explanation]")!.textContent).toContain("Editing is unavailable");
  expect(input.disabled).toBe(false);
  wall.disabled = false;
  await wall.updateComplete;
  expect(wall.shadowRoot!.querySelector("[part=content]")!.hasAttribute("inert")).toBe(false);
  expect(wall.querySelector("input")).toBe(input);
  expect(input.value).toBe("Saved");
  expect(wall.querySelector("button")!.disabled).toBe(true);
});

test("Removing the disabled attribute restores interaction without replacing children", async () => {
  document.body.innerHTML = '<acme-disabled-wall disabled><span slot="explanation">Upgrade to edit</span><button>Run</button></acme-disabled-wall>';
  const wall = document.querySelector("acme-disabled-wall")!;
  await wall.updateComplete;
  const button = wall.querySelector("button");
  wall.removeAttribute("disabled");
  await wall.updateComplete;
  expect(wall.disabled).toBe(false);
  expect(wall.querySelector("button")).toBe(button);
  expect(wall.shadowRoot!.querySelector("[part=explanation]")!.hasAttribute("hidden")).toBe(true);
});
