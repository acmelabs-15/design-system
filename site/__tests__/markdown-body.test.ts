import { expect, test } from "bun:test";
import { bodyToMarkdown } from "../markdown-body";

test("foundation Markdown preserves links, code, nested sections, tables and decoded text", () => {
  const output = bodyToMarkdown(
    '<section><h2>Size &amp; space</h2><p>Use <code>gap&lt;2</code> with <a href="/tokens">tokens</a>.</p><pre><code>a &lt; b\nsecond</code></pre><table><tr><th>Name</th><th>Value</th></tr><tr><td>A</td><td>one | two</td></tr></table><ul><li>First</li><li>Second</li></ul></section>',
  ).join("\n");
  expect(output).toContain("## Size & space");
  expect(output).toContain("`gap<2`");
  expect(output).toContain("[tokens](/tokens)");
  expect(output).toContain("a < b\nsecond");
  expect(output).toContain("| A | one \\| two |");
  expect(output).toContain("- Second");
});
