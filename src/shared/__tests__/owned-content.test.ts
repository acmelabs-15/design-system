import { expect, test } from "bun:test";
import { LitElement, html, nothing } from "lit";
import { AsyncDirective } from "lit/async-directive.js";
import { directive } from "lit/directive.js";
import { OwnedContent } from "../owned-content";
class ContentHost extends LitElement {
  mounted = true;
  renderer?: () => ReturnType<typeof html> | typeof nothing;
  readonly content = new OwnedContent(this);
  render() {
    return html`<slot></slot>`;
  }
  updated() {
    this.content.render(this.mounted, this.renderer, true);
  }
}
customElements.define("test-owned-content", ContentHost);
test("controlled templates mount and unmount actual nodes without moving the template", async () => {
  const host = new ContentHost();
  const template = document.createElement("template");
  template.innerHTML = '<input value="Initial">';
  host.append(template);
  document.body.append(host);
  await host.updateComplete;
  const input = host.querySelector("input")!;
  input.value = "Edited";
  host.requestUpdate();
  await host.updateComplete;
  expect(host.querySelector("input")).toBe(input);
  host.mounted = false;
  host.requestUpdate();
  await host.updateComplete;
  expect(host.querySelector("input")).toBeNull();
  expect(template.parentElement).toBe(host);
  host.mounted = true;
  host.requestUpdate();
  await host.updateComplete;
  expect(host.querySelector("input")!.value).toBe("Initial");
  host.remove();
});
test("owned Lit parts receive disconnect and reconnect notifications", async () => {
  let disconnected = 0,
    reconnected = 0;
  const probe = directive(
    class extends AsyncDirective {
      render() {
        return "Content";
      }
      disconnected() {
        disconnected++;
      }
      reconnected() {
        reconnected++;
      }
    },
  );
  const host = new ContentHost();
  host.renderer = () => html`${probe()}`;
  document.body.append(host);
  await host.updateComplete;
  host.remove();
  expect(disconnected).toBe(1);
  document.body.append(host);
  await host.updateComplete;
  expect(reconnected).toBe(1);
  host.remove();
});
