import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeLink } from "../link";

afterEach(() => document.body.replaceChildren());
test("Link forwards native navigation fields and keeps optional parts empty until supplied", async () => {
  document.body.innerHTML = '<acme-link href="/details" target="_blank" rel="noopener" download="report.txt">Details</acme-link>';
  const link = document.querySelector("acme-link") as AcmeLink;
  await link.updateComplete;
  const anchor = link.shadowRoot!.querySelector("a")!;
  expect(anchor.getAttribute("href")).toBe("/details");
  expect(anchor.target).toBe("_blank");
  expect(anchor.download).toBe("report.txt");
  expect(link.shadowRoot!.querySelector('[part="start"]')).toBeNull();
});
test("disabled navigation loses href, keeps link semantics and suppresses activation", async () => {
  document.body.innerHTML = '<acme-link href="/details" disabled>Details</acme-link>';
  const link = document.querySelector("acme-link") as AcmeLink;
  await link.updateComplete;
  const anchor = link.shadowRoot!.querySelector("a")!;
  let called = 0;
  link.addEventListener("click", () => called++);
  expect(anchor.hasAttribute("href")).toBe(false);
  expect(anchor.getAttribute("role")).toBe("link");
  expect(anchor.getAttribute("aria-disabled")).toBe("true");
  anchor.click();
  expect(called).toBe(0);
  link.disabled = false;
  await link.updateComplete;
  expect(anchor.getAttribute("href")).toBe("/details");
  expect(anchor.hasAttribute("aria-disabled")).toBe(false);
  expect(anchor.hasAttribute("role")).toBe(false);
});
