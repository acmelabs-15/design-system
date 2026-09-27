import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeStack } from "../stack";
import type { AcmeHStack } from "../../h-stack/h-stack";
import type { AcmeVStack } from "../../v-stack/v-stack";

afterEach(() => document.body.replaceChildren());
test("Stack supports direction while named variants do not expose it", () => {
  const stack = document.createElement("acme-stack") as AcmeStack,
    h = document.createElement("acme-h-stack") as AcmeHStack,
    v = document.createElement("acme-v-stack") as AcmeVStack;
  expect("flexDirection" in stack).toBe(true);
  expect("flexDirection" in h).toBe(false);
  expect("flexDirection" in v).toBe(false);
  expect(stack.flexDirection).toBeUndefined();
  expect(h.gap).toBeUndefined();
  expect(v.alignItems).toBeUndefined();
  expect(stack.separator).toBe(false);
  stack.flexDirection = { compact: "column", expanded: "row" };
  expect(stack.flexDirection).toEqual({ compact: "column", expanded: "row" });
});
test("named forms retain author nodes and have no decoration while disabled", async () => {
  document.body.innerHTML = '<acme-h-stack as="nav"><button>First</button><button>Second</button></acme-h-stack>';
  const stack = document.querySelector("acme-h-stack") as AcmeHStack,
    first = stack.firstChild;
  await stack.updateComplete;
  expect(stack.shadowRoot!.querySelector('[part="root"]')?.localName).toBe("nav");
  expect(stack.shadowRoot!.querySelector("[data-stack-overlay]")).toBeNull();
  stack.as = "section";
  await stack.updateComplete;
  expect(stack.firstChild).toBe(first);
});
