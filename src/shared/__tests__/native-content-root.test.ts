import { expect, test } from "bun:test";
import { LitElement, html } from "lit";
import { NativeContentRoot, nativeContentMarker } from "../native-content-root";

class Probe extends LitElement {
  readonly content = new NativeContentRoot(
    this,
    () => this.ownerDocument.createElement("fieldset"),
    () => {},
  );
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("native-content-probe", Probe);
const settle = async (element: Probe) => {
  await element.updateComplete;
  await Promise.resolve();
  await element.updateComplete;
};
test("native content keeps every node and marker in original order", async () => {
  const element = new Probe(),
    start = document.createComment("start"),
    input = document.createElement("input"),
    end = document.createComment("end");
  element.append(start, input, end);
  document.body.append(element);
  await settle(element);
  expect([...element.content.root.childNodes]).toEqual([start, input, end]);
  expect(element.content.root.parentNode).toBe(element);
  expect(element.content.root.getAttribute(nativeContentMarker)).toBe("fieldset");
  element.remove();
});
test("author child replacement does not resurrect removed content", async () => {
  const element = new Probe(),
    old = document.createElement("input");
  element.append(old);
  document.body.append(element);
  await settle(element);
  const replacement = document.createElement("textarea");
  element.replaceChildren(replacement);
  await settle(element);
  expect(element.querySelector("input")).toBeNull();
  expect(element.content.root.contains(replacement)).toBe(true);
  element.remove();
});
test("a renderer-provided native container keeps its child ownership", async () => {
  const element = new Probe(),
    root = document.createElement("fieldset"),
    input = document.createElement("input");
  root.setAttribute(nativeContentMarker, "fieldset");
  root.append(input);
  element.append(root);
  document.body.append(element);
  await settle(element);
  expect(element.content.root).toBe(root);
  expect(input.parentNode).toBe(root);
  element.remove();
  document.body.append(element);
  await settle(element);
  expect(element.content.root).toBe(root);
  element.remove();
});
