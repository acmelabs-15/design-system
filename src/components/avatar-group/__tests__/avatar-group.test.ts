import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeAvatarGroup } from "../avatar-group";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeAvatarGroup;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeAvatarGroup) => el.shadowRoot!.querySelector(".avatar-group") as HTMLElement;
const five = `[{"username":"a"},{"username":"b"},{"username":"c"},{"username":"d"},{"username":"e"}]`;
const three = `[{"username":"a"},{"username":"b"},{"username":"c"}]`;

describe("acme-avatar-group", () => {
  test("three members at the default limit: two plain, the third in the last slot without a count, first on top", async () => {
    const el = await mount(`<acme-avatar-group members='${three}' size="32"></acme-avatar-group>`);
    const g = root(el);
    expect(g.getAttribute("style")).toContain("--avatar-overlap:10px");
    const members = g.querySelectorAll(".member");
    expect(members.length).toBe(2);
    expect(members[0].getAttribute("style")).toContain("z-index:2");
    expect(members[1].getAttribute("style")).toContain("z-index:1");
    expect(members[0].querySelector("acme-avatar")!.getAttribute("username")).toBe("a");
    const more = g.querySelector(".more")!;
    expect(more.getAttribute("style")).toContain("z-index:0");
    expect(more.getAttribute("aria-label")).toBe("1 more avatars in this group");
    expect(more.querySelector("acme-avatar")!.getAttribute("username")).toBe("c");
    expect(more.querySelector(".count")).toBeNull();
  });

  test("past the limit the last slot counts the hidden members; extra adds to it; 0 shows all", async () => {
    const el = await mount(`<acme-avatar-group members='${five}' limit="4" size="32"></acme-avatar-group>`);
    expect(root(el).querySelectorAll(".member").length).toBe(3);
    expect(root(el).querySelector(".more .count")!.textContent).toBe("+2");
    el.extra = 10;
    await el.updateComplete;
    expect(root(el).querySelector(".more .count")!.textContent).toBe("9+");
    el.extra = 0;
    el.limit = 0;
    await el.updateComplete;
    expect(root(el).querySelectorAll(".member").length).toBe(4);
    expect(root(el).querySelector(".more .count")).toBeNull();
  });

  test("reverse leaves the stacking to document order; a number fixes the overlap", async () => {
    const el = await mount(`<acme-avatar-group members='${three}' reverse overlap="6" size="24"></acme-avatar-group>`);
    expect(root(el).getAttribute("style")).toContain("--avatar-overlap:6px");
    expect(root(el).querySelector(".member")!.hasAttribute("style")).toBe(false);
    expect(root(el).querySelector(".more")!.hasAttribute("style")).toBe(false);
  });

  test("members pass their size, source, letters and service to the avatars", async () => {
    const el = await mount(`<acme-avatar-group members='[{"src":"/a.png","title":"Ann"},{"letter":"bo"},{"username":"c","git":"github"}]' show-icon size="48" limit="0"></acme-avatar-group>`);
    const avatars = root(el).querySelectorAll("acme-avatar");
    expect(avatars.length).toBe(3);
    expect(avatars[0].getAttribute("size")).toBe("48");
    expect(avatars[0].getAttribute("src")).toBe("/a.png");
    expect(avatars[1].getAttribute("letter")).toBe("bo");
    expect(avatars[2].getAttribute("git")).toBe("github");
    expect(avatars[2].hasAttribute("icon-background")).toBe(true);
  });
});
