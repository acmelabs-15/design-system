import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeError } from "../error";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeError;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeError) => el.shadowRoot!.querySelector(".error") as HTMLElement;

describe("acme-error", () => {
  test("renders an atomic alert with the icon and text parts, and no label by default", async () => {
    const el = await mount(`<acme-error>This email address is already in use.</acme-error>`);
    const r = root(el);
    expect(r.getAttribute("role")).toBe("alert");
    expect(r.getAttribute("aria-atomic")).toBe("true");
    expect(r.className.trim()).toBe("error");
    expect(r.querySelector(".icon[aria-hidden] > svg")).not.toBeNull();
    expect(r.querySelector(".text > slot")).not.toBeNull();
    expect(r.querySelector(".label")).toBeNull();
  });

  test("label renders a bold prefix inside the text; label=false renders none", async () => {
    let el = await mount(`<acme-error label="Email Error">x</acme-error>`);
    expect(root(el).querySelector(".text > b.label")!.textContent).toBe("Email Error:");
    el = await mount(`<acme-error label="false">x</acme-error>`);
    expect(root(el).querySelector(".label")).toBeNull();
  });

  test("size maps to modifier classes", async () => {
    expect(root(await mount(`<acme-error size="small">x</acme-error>`)).classList.contains("sm")).toBe(true);
    expect(root(await mount(`<acme-error size="large">x</acme-error>`)).classList.contains("lg")).toBe(true);
  });

  test("the error object renders the message and the action link in a new tab", async () => {
    const el = await mount(`<acme-error error='{"message":"The request failed.","action":"Contact Us","link":"https://example.com/contact"}'></acme-error>`);
    const r = root(el);
    expect(r.textContent).toContain("The request failed.");
    const a = r.querySelector(".text > .action > a.link") as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("https://example.com/contact");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener");
    expect(a.textContent).toContain("Contact Us");
    expect(a.querySelector("svg")).not.toBeNull();
  });
});
