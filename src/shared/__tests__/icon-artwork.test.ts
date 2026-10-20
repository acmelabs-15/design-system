import { expect, test } from "bun:test";
import { IconArtwork, configureIcons, iconDefaults } from "../icon-artwork";

const home = { viewBox: "0 -960 960 960", paths: [{ d: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Z" }] };
test("artwork owns immutable geometry and identifies unavailable styles", () => {
  const source = structuredClone(home),
    artwork = new IconArtwork("home", source);
  source.paths[0].d = "changed";
  expect(artwork.get("rounded", false)?.paths[0].d).toBe(home.paths[0].d);
  expect(artwork.get("sharp", true)).toBeUndefined();
  expect(Object.isFrozen(artwork.get("rounded", false)?.paths)).toBe(true);
  artwork.add("sharp", true, home);
  expect(artwork.get("sharp", true)).toEqual(home);
  expect(() => artwork.add("sharp", true, { ...home, viewBox: "0 0 16 16" })).toThrow();
});
test("library defaults validate before changing the canonical state", () => {
  configureIcons({ family: "sharp", filled: true });
  expect(iconDefaults.get()).toEqual({ family: "sharp", filled: true });
  expect(() => configureIcons({ family: "invalid" as "sharp" })).toThrow();
  expect(iconDefaults.get()).toEqual({ family: "sharp", filled: true });
  configureIcons({ family: "rounded", filled: false });
});
