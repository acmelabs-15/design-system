import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeFile } from "../../file/file";
import type { AcmeFolder } from "../../folder/folder";
import type { AcmeFileTree } from "../file-tree";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeFileTree;
  await el.updateComplete;
  const rows = [...el.querySelectorAll("acme-folder, acme-file")] as (AcmeFolder | AcmeFile)[];
  await Promise.all(rows.map((r) => r.updateComplete));
  return el;
};
const shadow = (el: Element) => el.shadowRoot as ShadowRoot;

describe("acme-file-tree", () => {
  test("renders the tree root; card adds its modifier", async () => {
    const tree = await mount(`<acme-file-tree><acme-file name="a.js"></acme-file></acme-file-tree>`);
    expect(shadow(tree).querySelector(".tree")?.className.trim()).toBe("tree");
    tree.card = true;
    await tree.updateComplete;
    expect(shadow(tree).querySelector(".tree")?.className.trim()).toBe("tree card");
    expect(tree.hasAttribute("card")).toBe(true);
  });

  test("a folder is closed by default and renders no rows; default-open renders the list; a click flips open and fires acme-toggle", async () => {
    const tree = await mount(
      `<acme-file-tree><acme-folder name="app" default-open><acme-file name="main.tsx"></acme-file></acme-folder><acme-folder name="lib"><acme-file name="x.ts"></acme-file></acme-folder></acme-file-tree>`,
    );
    const [open, closed] = [...tree.querySelectorAll("acme-folder")] as AcmeFolder[];
    expect(open.open).toBe(true);
    expect(shadow(open).querySelector("li.folder")?.className.trim()).toBe("folder open");
    expect(shadow(open).querySelector("li.folder")?.getAttribute("title")).toBe("app");
    expect(shadow(open).querySelector("ul.group > slot")).not.toBeNull();
    expect(shadow(open).querySelector(".toggle .name")?.textContent).toBe("app");
    expect(closed.open).toBe(false);
    expect(shadow(closed).querySelector("li.folder")?.className.trim()).toBe("folder");
    expect(shadow(closed).querySelector("ul")).toBeNull();
    const events: boolean[] = [];
    tree.addEventListener("acme-toggle", (e) => events.push((e as CustomEvent).detail.open));
    (shadow(closed).querySelector(".toggle") as HTMLButtonElement).click();
    await closed.updateComplete;
    expect(closed.open).toBe(true);
    expect(closed.hasAttribute("open")).toBe(true);
    expect(shadow(closed).querySelector("ul.group")).not.toBeNull();
    expect(events).toEqual([true]);
  });

  test("each row carries one indent guide per folder level above it", async () => {
    const tree = await mount(
      `<acme-file-tree><acme-folder name="a" default-open><acme-folder name="b" default-open><acme-file name="c.js"></acme-file></acme-folder></acme-folder><acme-file name="top.js"></acme-file></acme-file-tree>`,
    );
    const [a, b] = [...tree.querySelectorAll("acme-folder")] as AcmeFolder[];
    const [c, top] = [...tree.querySelectorAll("acme-file")] as AcmeFile[];
    expect(shadow(a).querySelectorAll(".toggle > .indent").length).toBe(0);
    expect(shadow(b).querySelectorAll(".toggle > .indent").length).toBe(1);
    expect(shadow(c).querySelectorAll("li.file > .indent").length).toBe(2);
    expect(shadow(top).querySelectorAll("li.file > .indent").length).toBe(0);
  });

  test("a file is a link with href, a plain anchor without; active, type and show-icon shape the row", async () => {
    const tree = await mount(
      `<acme-file-tree><acme-file name="a.json" href="/a"></acme-file><acme-file name="b.js" active type="lambda"></acme-file><acme-file name="c.ts" show-icon="false"></acme-file></acme-file-tree>`,
    );
    const [link, active, bare] = [...tree.querySelectorAll("acme-file")] as AcmeFile[];
    expect(shadow(link).querySelector("a.link")?.getAttribute("href")).toBe("/a");
    expect(shadow(link).querySelector("li.file")?.className.trim()).toBe("file");
    expect(shadow(link).querySelector(".link .icon svg")).not.toBeNull();
    expect(shadow(active).querySelector("a.link")?.hasAttribute("href")).toBe(false);
    expect(shadow(active).querySelector("li.file")?.className.trim()).toBe("file active");
    expect(active.hasAttribute("active")).toBe(true);
    expect(shadow(active).querySelector(".link .icon svg path")?.getAttribute("d")).toContain("M6 4h2");
    expect(shadow(bare).querySelector(".icon")).toBeNull();
    expect(shadow(bare).querySelector(".link .name")?.textContent).toBe("c.ts");
  });

  test("label shows in place of name, in the text and the tooltip", async () => {
    const tree = await mount(`<acme-file-tree><acme-folder name="src" label="Source"></acme-folder><acme-file name="i.ts" label="Index"></acme-file></acme-file-tree>`);
    const folder = tree.querySelector("acme-folder") as AcmeFolder;
    const file = tree.querySelector("acme-file") as AcmeFile;
    expect(shadow(folder).querySelector(".name")?.textContent).toBe("Source");
    expect(shadow(folder).querySelector("li")?.getAttribute("title")).toBe("Source");
    expect(shadow(file).querySelector(".name")?.textContent).toBe("Index");
    expect(shadow(file).querySelector("li")?.getAttribute("title")).toBe("Index");
  });

  test("hover lands as data-hover on the toggle and the link", async () => {
    const tree = await mount(`<acme-file-tree><acme-folder name="app"></acme-folder><acme-file name="a.js"></acme-file></acme-file-tree>`);
    const toggle = shadow(tree.querySelector("acme-folder") as Element).querySelector(".toggle") as HTMLElement;
    const link = shadow(tree.querySelector("acme-file") as Element).querySelector(".link") as HTMLElement;
    for (const el of [toggle, link]) {
      el.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
      expect(el.getAttribute("data-hover")).toBe("true");
      el.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
      expect(el.hasAttribute("data-hover")).toBe(false);
    }
  });
});
