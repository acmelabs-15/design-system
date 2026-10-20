import { detectPlatform, formatForDisplay } from "@tanstack/lit-hotkeys";
import { message } from "./messages";

/** Formats presentation only; it does not create a hotkey registration. */
export function keyLabel(key: string, locale: string | undefined, accessible = false, platform = detectPlatform()): string {
  const fallback = key === "+" ? "+" : formatForDisplay(key, { platform, useSymbols: !accessible });
  return message(locale, `kbd.${platform}.${key}${accessible ? ".label" : ""}`, message(locale, `kbd.${key}${accessible ? ".label" : ""}`, fallback));
}
