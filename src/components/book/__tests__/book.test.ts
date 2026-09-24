import { expect, test } from "bun:test";
import "../../../all";
async function mount() {
  const element = document.createElement("acme-book");
  element.heading = "Design systems";
  document.body.replaceChildren(element);
  await element.updateComplete;
  return element;
}
test("Book exposes heading and start content while keeping its cover structure", async () => {
  const element = await mount();
  expect(element.shadowRoot!.querySelector(".heading")!.textContent).toBe("Design systems");
  expect(element.shadowRoot!.querySelector("[part=cover]")).not.toBeNull();
  expect(element.shadowRoot!.querySelector("[part=spine]")).not.toBeNull();
  const icon = document.createElement("span");
  icon.slot = "start";
  icon.textContent = "Mark";
  element.append(icon);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await element.updateComplete;
  expect(element.shadowRoot!.querySelector("acme-layers-icon")).toBeNull();
});
test("Book width uses the canonical responsive size contract and owns its input", async () => {
  const element = await mount();
  expect(element.width).toBe("196px");
  const width = { compact: "150px", medium: "196px" };
  element.width = width;
  width.medium = "300px";
  expect(element.width).toEqual({ compact: "150px", medium: "196px" });
  expect(() => {
    element.width = -1;
  }).toThrow();
});
test("Book gesture keeps the capture-before-hover and cancel-on-reversal behavior", async () => {
  const element = await mount(),
    root = element.shadowRoot!.querySelector<HTMLElement>(".book")!,
    probe = element as any;
  const initial = probe.gesture.get(),
    canceled: string[] = [];
  probe.motion.cancel = () => canceled.push("cancel");
  root.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
  expect(probe.gesture.get()).toBe(initial);
  root.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
  await element.updateComplete;
  expect(probe.gesture.get().hovered).toBe(true);
  expect(probe.frames.get()[1].transform).toContain("var(--hover-rotate)");
  root.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
  await element.updateComplete;
  expect(probe.gesture.get().hovered).toBe(false);
  expect(canceled.length).toBe(2);
});
test("touch does not start hover motion and texture orientation is generated state", async () => {
  const element = await mount(),
    root = element.shadowRoot!.querySelector<HTMLElement>(".book")!;
  root.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
  await element.updateComplete;
  expect((element as any).gesture.get().hovered).toBe(false);
  element.textured = true;
  await element.updateComplete;
  const texture = element.shadowRoot!.querySelector<HTMLElement>(".texture")!;
  expect(texture.style.transform).toBe("");
  expect(texture.style.getPropertyValue("--_book-texture")).toContain("book-texture.avif");
});
