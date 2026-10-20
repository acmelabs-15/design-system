import { afterEach, expect, test } from "bun:test";
import { AcmeIconElement } from "../icon-element";
import { IconArtwork, configureIcons } from "../icon-artwork";

const geometry = { viewBox: "0 -960 960 960", paths: [{ d: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Z" }] };
const artwork = new IconArtwork("home", geometry);
class TestIcon extends AcmeIconElement {
  protected get artwork() {
    return artwork;
  }
}
customElements.define("test-house-icon", TestIcon);
afterEach(() => {
  document.body.replaceChildren();
  configureIcons({ family: "rounded", filled: false });
});
const mount = async () => {
  const icon = new TestIcon();
  document.body.append(icon);
  await icon.updateComplete;
  return icon;
};
test("icons are decorative until named and use real SVG paths", async () => {
  const icon = await mount();
  let root = icon.shadowRoot!.querySelector("svg")!;
  expect(root.getAttribute("aria-hidden")).toBe("true");
  expect(root.querySelector("path")!.namespaceURI).toBe("http://www.w3.org/2000/svg");
  icon.label = "Home";
  await icon.updateComplete;
  root = icon.shadowRoot!.querySelector("svg")!;
  expect(root.getAttribute("role")).toBe("img");
  expect(root.getAttribute("aria-label")).toBe("Home");
  expect(root.hasAttribute("aria-hidden")).toBe(false);
});
test("explicit style overrides defaults and late artwork imports resolve missing markers", async () => {
  const icon = await mount();
  icon.family = "sharp";
  icon.filled = true;
  await icon.updateComplete;
  expect(icon.shadowRoot!.querySelector("[role=img]")?.getAttribute("aria-label")).toContain("Artwork unavailable");
  artwork.add("sharp", true, geometry);
  await icon.updateComplete;
  expect(icon.shadowRoot!.querySelector("svg")).not.toBeNull();
  configureIcons({ family: "outlined", filled: false });
  await icon.updateComplete;
  expect(icon.shadowRoot!.querySelector("svg")).not.toBeNull();
  icon.family = undefined;
  icon.filled = undefined;
  await icon.updateComplete;
  expect(icon.shadowRoot!.querySelector(".missing")).not.toBeNull();
});
test("an explicit false fill attribute overrides the library default", async () => {
  const icon = await mount();
  configureIcons({ filled: true });
  icon.setAttribute("filled", "false");
  await icon.updateComplete;
  expect(icon.filled).toBe(false);
  expect(icon.shadowRoot!.querySelector("svg")).not.toBeNull();
  icon.removeAttribute("filled");
  await icon.updateComplete;
  expect(icon.filled).toBeUndefined();
  expect(icon.shadowRoot!.querySelector(".missing")).not.toBeNull();
});
