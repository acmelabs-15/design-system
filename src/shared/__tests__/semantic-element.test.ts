import { afterEach, expect, test } from "bun:test";
import { html, render } from "lit";
import { AcmeSemanticElement } from "../semantic-element";

class SemanticProbe extends AcmeSemanticElement {
  render() {
    return html`<section part="root"><slot></slot></section>`;
  }
}
customElements.define("semantic-probe", SemanticProbe);
afterEach(() => document.body.replaceChildren());
test("cloned static templates preserve names and popup semantics on every instance", async () => {
  const view = () => html`<semantic-probe aria-label="Actions" aria-haspopup="menu" aria-expanded="false"></semantic-probe>`;
  for (let index = 0; index < 2; index++) {
    const container = document.createElement("div");
    document.body.append(container);
    render(view(), container);
    const host = container.firstElementChild as SemanticProbe;
    await host.updateComplete;
    expect(host.ariaLabel).toBe("Actions");
    expect(root(host).getAttribute("aria-label")).toBe("Actions");
    expect(root(host).getAttribute("aria-haspopup")).toBe("menu");
    expect(root(host).getAttribute("aria-expanded")).toBe("false");
    expect(Element.prototype.hasAttribute.call(host, "aria-label")).toBe(false);
  }
});
const root = (host: SemanticProbe) => host.shadowRoot!.querySelector("section")!;
async function mount(attributes = "") {
  document.body.innerHTML = `<semantic-probe ${attributes}>Content</semantic-probe>`;
  const host = document.querySelector("semantic-probe") as SemanticProbe;
  await host.updateComplete;
  return host;
}

test("role and label name only the native root while canonical inputs remain readable", async () => {
  const host = await mount('role="region" aria-label="Details"');
  expect(host.role).toBe("region");
  expect(host.ariaLabel).toBe("Details");
  expect(host.getAttribute("role")).toBe("region");
  expect(host.hasAttribute("role")).toBe(true);
  expect(Element.prototype.hasAttribute.call(host, "role")).toBe(false);
  expect(Element.prototype.hasAttribute.call(host, "aria-label")).toBe(false);
  expect(root(host).getAttribute("role")).toBe("region");
  expect(root(host).getAttribute("aria-label")).toBe("Details");
});
test("property writes and ordinary DOM updates share the same accessible inputs", async () => {
  const host = await mount();
  host.ariaLabel = "First";
  expect(root(host).getAttribute("aria-label")).toBe("First");
  host.setAttribute("ARIA-LABEL", "Second");
  expect(host.ariaLabel).toBe("Second");
  host.removeAttribute("aria-label");
  expect(host.ariaLabel).toBeNull();
  expect(root(host).hasAttribute("aria-label")).toBe(false);
  host.role = "region";
  host.toggleAttribute("role", false);
  expect(host.role).toBeNull();
});
test("ID references resolve in the author's scope and late IDs update without another render", async () => {
  const host = await mount('aria-labelledby="name" aria-describedby="help"');
  const label = document.createElement("span");
  label.id = "name";
  label.textContent = "Name";
  const help = document.createElement("span");
  help.id = "help";
  help.textContent = "Help";
  document.body.append(label, help);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(host.ariaLabelledByElements).toEqual([label]);
  expect(root(host).ariaLabelledByElements).toEqual([label]);
  expect(root(host).ariaDescribedByElements).toEqual([help]);
  label.id = "changed";
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(root(host).ariaLabelledByElements).toEqual([]);
});
test("explicit references replace strings and string writes replace explicit references", async () => {
  const host = await mount();
  const label = document.createElement("span");
  label.textContent = "Explicit";
  document.body.append(label);
  host.ariaLabelledByElements = [label];
  expect(host.getAttribute("aria-labelledby")).toBe("");
  expect(root(host).ariaLabelledByElements).toEqual([label]);
  expect(Object.isFrozen(host.ariaLabelledByElements)).toBe(true);
  expect(() => {
    host.ariaLabelledByElements = [{} as Element];
  }).toThrow();
  expect(host.ariaLabelledByElements).toEqual([label]);
  host.setAttribute("aria-labelledby", "missing");
  expect(host.ariaLabelledByElements).toEqual([]);
  expect(root(host).ariaLabelledByElements).toEqual([]);
  host.removeAttribute("aria-labelledby");
  expect(host.ariaLabelledByElements).toBeNull();
});
test("reconnection resolves references in the new author scope", async () => {
  const host = await mount('aria-labelledby="name"');
  host.remove();
  const container = document.createElement("div"),
    shadow = container.attachShadow({ mode: "open" });
  const label = document.createElement("span");
  label.id = "name";
  label.textContent = "Scoped";
  shadow.append(label, host);
  document.body.append(container);
  await host.updateComplete;
  expect(root(host).ariaLabelledByElements).toEqual([label]);
});
