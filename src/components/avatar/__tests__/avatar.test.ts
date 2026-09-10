import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeAvatar } from "../avatar";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeAvatar;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeAvatar) => el.shadowRoot!.querySelector(".avatar") as HTMLElement;

describe("acme-avatar", () => {
  test("username renders the image at twice the size, labels the root and starts unresolved", async () => {
    const el = await mount(`<acme-avatar username="rauchg" size="32"></acme-avatar>`);
    const a = root(el);
    expect(a.getAttribute("role")).toBe("img");
    expect(a.getAttribute("aria-label")).toBe("Avatar for rauchg");
    expect(a.getAttribute("style")).toContain("--size:32px");
    expect(a.getAttribute("data-mask")).toBe("true");
    expect(a.getAttribute("data-resolved")).toBe("false");
    const img = a.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("https://vercel.com/api/www/avatar?u=rauchg&s=64");
    expect(img.getAttribute("alt")).toBe("Avatar for rauchg");
    expect(el.shadowRoot!.querySelector(".avatar-wrap")).toBeNull();
  });

  test("the image's load resolves the root; a new source starts over", async () => {
    const el = await mount(`<acme-avatar username="rauchg"></acme-avatar>`);
    root(el).querySelector("img")!.dispatchEvent(new Event("load"));
    await el.updateComplete;
    expect(root(el).getAttribute("data-resolved")).toBe("true");
    el.username = "shuding";
    await el.updateComplete;
    expect(root(el).getAttribute("data-resolved")).toBe("false");
  });

  test("title names the entity and leaves the host without a tooltip; mask=false is an attribute state", async () => {
    const el = await mount(`<acme-avatar src="/me.png" title="Jane Doe" mask="false"></acme-avatar>`);
    expect(root(el).getAttribute("aria-label")).toBe("Jane Doe");
    expect(el.hasAttribute("title")).toBe(false);
    expect(root(el).getAttribute("data-mask")).toBe("false");
  });

  test("letter renders uppercase initials with the screen-reader prefix; placeholder drops the image and renders the empty shell", async () => {
    const initials = await mount(`<acme-avatar letter="sl" size="32"></acme-avatar>`);
    expect(root(initials).querySelector(".letter")!.textContent).toBe("SL");
    expect(root(initials).getAttribute("aria-label")).toBe("Avatar with initials: SL");
    const el = await mount(`<acme-avatar letter="sl" placeholder size="32"></acme-avatar>`);
    expect(root(el).querySelector(".letter")!.textContent).toBe("SL");
    expect(root(el).getAttribute("aria-label")).toBe("Placeholder Avatar");
    expect(root(el).querySelector("img")).toBeNull();
    const shell = await mount(`<acme-avatar placeholder size="90"></acme-avatar>`);
    expect(root(shell).children.length).toBe(0);
    expect(root(shell).getAttribute("aria-label")).toBe("Placeholder Avatar");
  });

  test("git wraps the avatar with the service dot and the provider's mark; GitHub images come from GitHub", async () => {
    const el = await mount(`<acme-avatar git="github" username="rauchg" size="32"></acme-avatar>`);
    const wrap = el.shadowRoot!.querySelector(".avatar-wrap")!;
    expect(wrap.classList.contains("github")).toBe(true);
    expect(wrap.getAttribute("style")).toContain("--size:32px");
    const dot = wrap.querySelector(".service")!;
    expect(dot.getAttribute("data-git-type")).toBe("github");
    expect(dot.getAttribute("data-icon-background")).toBe("true");
    expect(dot.querySelector("slot[name=icon] > svg path")).not.toBeNull();
    expect(root(el).querySelector("img")!.getAttribute("src")).toBe("https://avatars.githubusercontent.com/rauchg?s=64");
  });

  test("a slotted icon gets the dot; icon-background marks its disc", async () => {
    const el = await mount(`<acme-avatar icon-background size="32"><svg slot="icon" width="14" height="14"></svg></acme-avatar>`);
    const dot = el.shadowRoot!.querySelector(".avatar-wrap .service")!;
    expect(dot.hasAttribute("data-git-type")).toBe(false);
    expect(dot.getAttribute("data-icon-background")).toBe("true");
    expect((dot.querySelector("slot[name=icon]") as HTMLSlotElement).assignedElements().length).toBe(1);
  });
});
