import { format } from "oxfmt";
import { createHighlighter } from "@tanstack/highlight/core";
import { html as htmlLang } from "@tanstack/highlight/languages/html";
import { ts } from "@tanstack/highlight/languages/ts";
import { Window } from "happy-dom";

const highlighter = createHighlighter({ languages: [htmlLang, ts], fallbackLanguage: "html" });
const formatted = new Map<string, Promise<string>>();
const document = new Window().document;
const htmlShape = (source: string): string => {
  const template = document.createElement("template");
  template.innerHTML = source;
  const shape = (node: {
    nodeType: number;
    nodeName: string;
    nodeValue: string | null;
    childNodes: Iterable<unknown>;
    content?: { childNodes: Iterable<unknown> };
    attributes?: Iterable<{ name: string; value: string }>;
  }): unknown => [
    node.nodeType,
    node.nodeName,
    node.nodeValue,
    node.attributes ? [...node.attributes].map((attribute) => [attribute.name, attribute.value]) : null,
    [...(node.content?.childNodes ?? node.childNodes)].map((child) => shape(child as typeof node)),
  ];
  return JSON.stringify(shape(template.content));
};
export function formatSource(source: string, language: "html" | "typescript" = "html"): Promise<string> {
  const key = language + "\0" + source;
  let result = formatted.get(key);
  if (!result) {
    result = format(language === "html" ? "example.html" : "example.ts", source, {
      htmlWhitespaceSensitivity: "strict",
      embeddedLanguageFormatting: "off",
      sortImports: false,
      printWidth: 100,
      insertFinalNewline: false,
    }).then((result) => {
      if (result.errors.length) {
        throw new Error("Example source cannot be formatted: " + result.errors.map((error) => error.message).join("; "));
      }
      // Custom elements can make any text whitespace significant; preserve that author input.
      return language === "html" && htmlShape(source) !== htmlShape(result.code) ? source : result.code;
    });
    formatted.set(key, result);
  }
  return result;
}
export const formatHtml = (source: string) => formatSource(source, "html");
/** Highlight the supplied source without rewriting its syntax or text. */
export function highlightHtml(source: string, language: "html" | "typescript" = "html"): string {
  return highlighter.highlightToHtml(source, { lang: language === "typescript" ? "ts" : language, lineNumbers: true });
}
