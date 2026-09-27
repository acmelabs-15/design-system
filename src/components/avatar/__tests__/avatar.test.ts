import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeAvatar } from "../avatar";

afterEach(() => document.body.replaceChildren());
async function mount(markup: string) {
  document.body.innerHTML = markup;
  const element = document.body.firstElementChild as AcmeAvatar;
  await element.updateComplete;
  return element;
}
const root = (avatar: AcmeAvatar) => avatar.shadowRoot!.querySelector("[part=root]")!;
test("Avatar has no invented image and derives grapheme-aware initials from its label", async () => {
  const avatar = await mount('<acme-avatar label="Élodie Brontë"></acme-avatar>');
  expect(root(avatar).getAttribute("role")).toBe("img");
  expect(root(avatar).getAttribute("aria-label")).toBe("Élodie Brontë");
  expect(root(avatar).querySelector("img")).toBeNull();
  expect(root(avatar).querySelector("[part=fallback]")!.textContent).toBe("ÉB");
  expect("username" in avatar).toBe(false);
  avatar.initials = "E";
  await avatar.updateComplete;
  expect(root(avatar).querySelector("[part=fallback]")!.textContent).toBe("E");
});
test("Avatar image success and error have separate state and secret-free events", async () => {
  const avatar = await mount('<acme-avatar src="/image.png?secret=private" label="Person"></acme-avatar>');
  const events: unknown[] = [];
  avatar.addEventListener("acme-error", (e) => events.push((e as CustomEvent).detail));
  const image = root(avatar).querySelector("img")!;
  image.dispatchEvent(new Event("error"));
  await avatar.updateComplete;
  expect(root(avatar).getAttribute("data-state")).toBe("error");
  expect(root(avatar).querySelector("[part=fallback]")!.hasAttribute("hidden")).toBe(false);
  expect(JSON.stringify(events)).not.toContain("private");
  avatar.src = "/second.png";
  await avatar.updateComplete;
  let loaded = 0;
  avatar.addEventListener("acme-load", () => loaded++);
  const next = root(avatar).querySelector("img")!;
  next.dispatchEvent(new Event("load"));
  await avatar.updateComplete;
  expect(root(avatar).getAttribute("data-state")).toBe("loaded");
  expect(loaded).toBe(1);
  next.dispatchEvent(new Event("load"));
  expect(loaded).toBe(1);
});
test("replaced and disconnected image completions cannot publish", async () => {
  const avatar = await mount('<acme-avatar src="/old.png"></acme-avatar>');
  const old = root(avatar).querySelector("img")!;
  let loaded = 0;
  avatar.addEventListener("acme-load", () => loaded++);
  avatar.src = "/new.png";
  old.dispatchEvent(new Event("load"));
  await avatar.updateComplete;
  expect(loaded).toBe(0);
  const current = root(avatar).querySelector("img")!;
  avatar.remove();
  current.dispatchEvent(new Event("load"));
  expect(loaded).toBe(0);
});
test("decorative avatar preserves fallback and badge author content without a second image name", async () => {
  const avatar = await mount('<acme-avatar shape="square" loading><span slot="fallback">?</span><span slot="badge">Online</span></acme-avatar>');
  expect(root(avatar).getAttribute("aria-hidden")).toBe("true");
  expect(root(avatar).getAttribute("data-shape")).toBe("square");
  expect(root(avatar).getAttribute("aria-busy")).toBe("true");
  expect(avatar.shadowRoot!.querySelector("[part=badge] slot")).not.toBeNull();
});

test("removing scalar attributes restores authored defaults", async () => {
  const avatar = await mount('<acme-avatar label="Person" initials="P" size="large" shape="square"></acme-avatar>');
  for (const attr of ["label", "initials", "size", "shape"]) {
    avatar.removeAttribute(attr);
  }
  await avatar.updateComplete;
  expect(avatar.label).toBe("");
  expect(avatar.initials).toBe("");
  expect(avatar.size).toBe("medium");
  expect(avatar.shape).toBe("circle");
});
