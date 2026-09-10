import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeEntityList } from "../entity-list";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeEntityList;
  await el.updateComplete;
  return el;
};

describe("acme-entity-list", () => {
  test("wraps the rows in a list", async () => {
    const list = await mount(
      `<acme-entity-list><acme-entity><acme-entity-content title="A"></acme-entity-content></acme-entity><acme-entity><acme-entity-content title="B"></acme-entity-content></acme-entity></acme-entity-list>`,
    );
    const sr = list.shadowRoot!;
    expect(sr.querySelector("ul.list > slot:not([name])")).not.toBeNull();
    expect(sr.querySelector(".wrap")).toBeNull();
    expect(sr.querySelector(".list")?.classList.contains("headed")).toBe(false);
  });

  test("a header stacks over the list in a column and marks the list", async () => {
    const headed = await mount(`<acme-entity-list><p slot="header">Devices</p><acme-entity><acme-entity-content title="A"></acme-entity-content></acme-entity></acme-entity-list>`);
    expect(headed.shadowRoot!.querySelector(".wrap > slot[name=header] + ul.list.headed")).not.toBeNull();
  });
});
