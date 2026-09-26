import { expect, test } from "bun:test";
import { docToMarkdown } from "../markdown";

test("Markdown example fences contain nested code fences", async () => {
  const lines = await docToMarkdown(
    { id: "nested", title: "Nested", lede: "Nested source", examples: [{ h: "Code", html: '<acme-markdown content="```js\nconst value = 1;\n```"></acme-markdown>' }] },
    new Map(),
  );
  const opening = lines.find((line) => /^`+html$/.test(line));
  expect(opening).toBe("````html");
  expect(lines.filter((line) => line === "````")).toHaveLength(1);
});
