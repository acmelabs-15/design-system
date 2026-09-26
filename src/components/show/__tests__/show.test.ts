import { expect, test } from "bun:test";
import { html } from "lit";
import "../../../define/show";

async function settle(host: HTMLElement & { updateComplete: Promise<boolean> }) {
  await host.updateComplete;
  await host.updateComplete;
}
test("Show mounts only its selected template and resets state on a later mount", async () => {
  document.body.innerHTML = '<acme-show><template><input value="Initial"></template><template slot="fallback"><p>Empty</p></template></acme-show>';
  const show = document.querySelector("acme-show")!;
  await settle(show);
  expect(show.querySelector("input")).toBeNull();
  expect(show.querySelector("p")?.textContent).toBe("Empty");
  show.when = true;
  await settle(show);
  show.querySelector("input")!.value = "Edited";
  expect(show.querySelector("p")).toBeNull();
  show.when = false;
  await settle(show);
  show.when = true;
  await settle(show);
  expect(show.querySelector("input")!.value).toBe("Initial");
});
test("Show preserves both branches only when requested", async () => {
  document.body.innerHTML = "<acme-show preserve-state></acme-show>";
  const show = document.querySelector("acme-show")!;
  show.renderContent = () => html`<input value="Initial">`;
  show.renderFallback = () => html`<button>Fallback</button>`;
  await settle(show);
  const input = show.querySelector("input")!;
  input.value = "Edited";
  show.when = true;
  await settle(show);
  expect(show.querySelector("input")).toBe(input);
  expect(input.value).toBe("Edited");
  expect(show.shadowRoot!.querySelector<HTMLElement>("[part=fallback]")!.inert).toBe(true);
  show.preserveState = false;
  await settle(show);
  expect(show.querySelector("button")).toBeNull();
});
