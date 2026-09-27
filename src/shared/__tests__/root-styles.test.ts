import { expect, test } from "bun:test";
import { LitElement, css, html } from "lit";
import { RootStyles } from "../root-styles";

const sheet = css`
  [data-native-style-probe] {
    color: blue;
  }
`;
class Probe extends LitElement {
  private readonly rootStyles = new RootStyles(this, [sheet]);
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define("root-style-probe", Probe);
test("root styles share one owned sheet and preserve unrelated styles on release", async () => {
  const outer = document.createElement("div"),
    root = outer.attachShadow({ mode: "open" }),
    unrelated = new CSSStyleSheet();
  unrelated.replaceSync("div{display:block}");
  root.adoptedStyleSheets = [unrelated];
  document.body.append(outer);
  const first = new Probe(),
    second = new Probe();
  root.append(first, second);
  await first.updateComplete;
  await second.updateComplete;
  expect(root.adoptedStyleSheets).toHaveLength(2);
  first.remove();
  expect(root.adoptedStyleSheets).toHaveLength(2);
  second.remove();
  expect(root.adoptedStyleSheets).toEqual([unrelated]);
  outer.remove();
});
test("moving a host into a different root releases the old scope", async () => {
  const first = document.createElement("div"),
    second = document.createElement("div"),
    a = first.attachShadow({ mode: "open" }),
    b = second.attachShadow({ mode: "open" }),
    element = new Probe();
  document.body.append(first, second);
  a.append(element);
  await element.updateComplete;
  expect(a.adoptedStyleSheets).toHaveLength(1);
  b.append(element);
  await element.updateComplete;
  expect(a.adoptedStyleSheets).toHaveLength(0);
  expect(b.adoptedStyleSheets).toHaveLength(1);
  element.remove();
  first.remove();
  second.remove();
});

test("a preexisting matching stylesheet keeps its original owner", async () => {
  const { constructedStyleSheet } = await import("../static-styles");
  const outer = document.createElement("div"),
    root = outer.attachShadow({ mode: "open" }),
    existing = constructedStyleSheet(document, sheet)!;
  root.adoptedStyleSheets = [existing];
  document.body.append(outer);
  const element = new Probe();
  root.append(element);
  await element.updateComplete;
  expect(root.adoptedStyleSheets).toEqual([existing]);
  element.remove();
  expect(root.adoptedStyleSheets).toEqual([existing]);
  outer.remove();
});
