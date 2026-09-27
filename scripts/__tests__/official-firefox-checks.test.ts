import { expect, test } from "bun:test";
import { firefoxArchive, firefoxChecksum } from "../official-firefox-checks";

test("official Firefox archives are exact platform/version paths", () => {
  expect(firefoxArchive("linux", "x64")).toBe("linux-x86_64/en-US/firefox-156.0.1.tar.xz");
  expect(firefoxArchive("darwin", "arm64")).toBe("mac/en-US/Firefox 156.0.1.dmg");
  expect(() => firefoxArchive("win32", "x64")).toThrow("Unsupported");
});

test("checksum selection retains space-containing paths and rejects missing entries", () => {
  const digest = "a".repeat(128);
  expect(firefoxChecksum(`${digest}  mac/en-US/Firefox 156.0.1.dmg\n`, "mac/en-US/Firefox 156.0.1.dmg")).toBe(digest);
  expect(() => firefoxChecksum(`${digest}  other\n`, "missing")).toThrow("Missing");
});
