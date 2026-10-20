import { expect, test } from "bun:test";
import { AcmeList } from "../list";
import "../../../define/list";

test("List retains native numbering, nested content and node identity", async () => {
  document.body.innerHTML = '<acme-list><ol start="5" reversed><li>Five<ul><li>Nested</li></ul></li><li value="2"><button>Two</button></li></ol></acme-list>';
  const root = document.querySelector("acme-list") as AcmeList;
  const list = root.querySelector("ol")!,
    child = list.children[1];
  await root.updateComplete;
  root.marker = "none";
  await root.updateComplete;
  expect(root.firstElementChild).toBe(list);
  expect(list.start).toBe(5);
  expect(list.reversed).toBe(true);
  expect(list.getAttribute("role")).toBe("list");
  expect(list.children[1]).toBe(child);
  expect(child.getAttribute("value")).toBe("2");
  root.marker = "native";
  await root.updateComplete;
  expect(list.hasAttribute("role")).toBe(false);
});
test("List snapshots responsive spacing and respects an authored list role", async () => {
  const root = new AcmeList();
  root.innerHTML = '<ul role="list"><li>One</li></ul>';
  document.body.append(root);
  const input: { compact: 2; medium: 4 | 6 } = { compact: 2, medium: 4 };
  root.spacing = input;
  input.medium = 6;
  await root.updateComplete;
  expect(root.spacing).toEqual({ compact: 2, medium: 4 });
  root.marker = "none";
  await root.updateComplete;
  root.marker = "native";
  await root.updateComplete;
  expect(root.querySelector("ul")!.getAttribute("role")).toBe("list");
  expect(() => {
    Reflect.set(root, "spacing", -1);
  }).toThrow();
});
