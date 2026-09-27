import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeGroup } from "../group";

afterEach(() => document.body.replaceChildren());
async function mount(markup = "<acme-group></acme-group>") {
  document.body.innerHTML = markup;
  const group = document.querySelector("acme-group") as AcmeGroup;
  await group.updateComplete;
  return group;
}
test("Group has semantic defaults without owning selection form or disabled state", async () => {
  const group = await mount();
  expect(group.orientation).toBe("horizontal");
  expect(group.attached).toBe(false);
  expect(group.outline).toBe(false);
  expect(group.grow).toBe(false);
  expect(group.gap).toBeUndefined();
  expect(group.size).toBeUndefined();
  expect(group.variant).toBeUndefined();
  for (const key of ["value", "checked", "selected", "disabled", "name", "flexDirection"]) {
    expect(key in group).toBe(false);
  }
});
test("orientation uses owned responsive data and clears to horizontal", async () => {
  const group = await mount();
  const source = { compact: "horizontal", expanded: "vertical" } as const;
  group.orientation = source;
  expect(group.orientation).toEqual(source);
  expect(group.orientation).not.toBe(source);
  expect(Object.isFrozen(group.orientation)).toBe(true);
  group.orientation = undefined;
  expect(group.orientation).toBe("horizontal");
  expect(() => {
    group.orientation = "reverse" as never;
  }).toThrow();
});
test("optional appearance and container attributes clear to absence", async () => {
  const group = await mount('<acme-group size="small" variant="secondary" responsive-container="local"></acme-group>');
  group.removeAttribute("size");
  group.removeAttribute("variant");
  group.removeAttribute("responsive-container");
  expect(group.size).toBeUndefined();
  expect(group.variant).toBeUndefined();
  expect(group.responsiveContainer).toBeUndefined();
});
