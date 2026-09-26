import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeAvatarGroup } from "../avatar-group";

afterEach(() => document.body.replaceChildren());
const members = Array.from({ length: 5 }, (_, i) => ({ id: String(i), label: `Person ${i}`, initials: String(i) }));
async function mount() {
  const group = document.createElement("acme-avatar-group");
  document.body.append(group);
  await group.updateComplete;
  return group;
}
const avatars = (group: AcmeAvatarGroup) => group.shadowRoot!.querySelectorAll("acme-avatar");
const count = (group: AcmeAvatarGroup) => group.shadowRoot!.querySelector(".count")?.textContent;
test("empty groups invent no member; limit includes the count and zero means all", async () => {
  const group = await mount();
  expect(avatars(group).length).toBe(0);
  expect(count(group)).toBeUndefined();
  group.members = members;
  await group.updateComplete;
  expect(avatars(group).length).toBe(2);
  expect(count(group)).toBe("+3");
  group.limit = 0;
  await group.updateComplete;
  expect(avatars(group).length).toBe(5);
  expect(count(group)).toBeUndefined();
  group.limit = 1;
  await group.updateComplete;
  expect(avatars(group).length).toBe(0);
  expect(count(group)).toBe("+5");
});
test("one remaining real member displays normally while extra-only counts stay exact", async () => {
  const group = await mount();
  group.members = members.slice(0, 3);
  await group.updateComplete;
  expect(avatars(group).length).toBe(3);
  expect(count(group)).toBeUndefined();
  group.members = [];
  group.extra = 1;
  await group.updateComplete;
  expect(avatars(group).length).toBe(0);
  expect(count(group)).toBe("+1");
  group.extra = 12;
  await group.updateComplete;
  expect(count(group)).toBe("9+");
  expect(group.shadowRoot!.querySelector(".sr")!.textContent).toBe("12 more people");
});
test("member snapshots are immutable and reordering preserves keyed avatar identity", async () => {
  const group = await mount();
  group.limit = 0;
  const input = members.map((m) => ({ ...m }));
  group.members = input;
  await group.updateComplete;
  const first = avatars(group)[0];
  input[0].label = "Changed";
  expect(group.members[0].label).toBe("Person 0");
  expect(Object.isFrozen(group.members)).toBe(true);
  group.members = [...group.members].reverse();
  await group.updateComplete;
  expect(avatars(group)[4]).toBe(first);
  expect(() => {
    group.members = [members[0], members[0]];
  }).toThrow("unique");
  expect(group.members.length).toBe(5);
});
test("Group owns arrangement and custom overflow preserves the full count text", async () => {
  const group = await mount();
  group.extra = 2;
  group.innerHTML = '<button slot="overflow">Show people</button>';
  await group.updateComplete;
  expect(group.shadowRoot!.querySelector("acme-group[part=root]")).not.toBeNull();
  expect(group.shadowRoot!.querySelector("slot[name=overflow]")).not.toBeNull();
  expect(group.shadowRoot!.querySelector(".sr")!.textContent).toBe("2 more people");
  expect(() => {
    group.limit = -1;
  }).toThrow();
  expect(() => {
    group.extra = Infinity;
  }).toThrow();
});

test("attribute removal restores counting defaults and unsafe totals preserve prior state", async () => {
  const group = await mount();
  group.setAttribute("limit", "1");
  group.setAttribute("extra", "2");
  expect(group.limit).toBe(1);
  expect(group.extra).toBe(2);
  group.removeAttribute("limit");
  group.removeAttribute("extra");
  expect(group.limit).toBe(3);
  expect(group.extra).toBe(0);
  group.members = members;
  expect(() => {
    group.extra = Number.MAX_SAFE_INTEGER;
  }).toThrow("safe");
  expect(group.extra).toBe(0);
});
