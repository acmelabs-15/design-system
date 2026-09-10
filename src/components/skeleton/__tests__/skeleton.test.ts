import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSkeleton } from "../skeleton";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSkeleton;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeSkeleton) => el.shadowRoot!.querySelector(".skeleton") as HTMLElement;

describe("acme-skeleton", () => {
  test("a set width renders a bare block with width and the default min-height", async () => {
    const r = root(await mount(`<acme-skeleton width="160"></acme-skeleton>`));
    expect(r.className.trim()).toBe("skeleton");
    expect(r.getAttribute("style")).toBe("width:160px;min-height:24px");
  });

  test("box-height becomes bottom margin; a CSS length passes through", async () => {
    expect(root(await mount(`<acme-skeleton box-height="42" width="160"></acme-skeleton>`)).getAttribute("style")).toBe("width:160px;min-height:24px;margin-bottom:18px");
    expect(root(await mount(`<acme-skeleton height="100" width="100%"></acme-skeleton>`)).getAttribute("style")).toBe("width:100%;min-height:100px");
  });

  test("children without a size wrap; show=false turns the skeleton off", async () => {
    const wrap = root(await mount(`<acme-skeleton><button>x</button></acme-skeleton>`));
    expect(wrap.className.trim()).toBe("skeleton wrap");
    expect(wrap.hasAttribute("style")).toBe(false);
    const off = root(await mount(`<acme-skeleton show="false"><button>x</button></acme-skeleton>`));
    expect(off.className.trim()).toBe("skeleton off");
  });

  test("a fixed size with children hides automatically and keeps the size", async () => {
    const r = root(await mount(`<acme-skeleton height="32" width="120"><button>x</button></acme-skeleton>`));
    expect(r.className.trim()).toBe("skeleton auto");
    expect(r.getAttribute("style")).toBe("width:120px;min-height:32px");
  });

  test("shape, animation and button flags map to classes", async () => {
    expect(root(await mount(`<acme-skeleton pill width="48"></acme-skeleton>`)).className.trim()).toBe("skeleton pill");
    expect(root(await mount(`<acme-skeleton rounded width="48"></acme-skeleton>`)).className.trim()).toBe("skeleton rounded");
    expect(root(await mount(`<acme-skeleton squared width="48"></acme-skeleton>`)).className.trim()).toBe("skeleton squared");
    expect(root(await mount(`<acme-skeleton animated="false" width="48"></acme-skeleton>`)).className.trim()).toBe("skeleton still");
    expect(root(await mount(`<acme-skeleton button><button>x</button></acme-skeleton>`)).className.trim()).toBe("skeleton button wrap");
  });
});
