import lit from "postcss-lit";
import ts from "typescript";

/** Parse authored TS directly; source-map text inside a JS string is not its file's source map. */
export const lintLitSyntax = {
  ...lit,
  parse(source: Parameters<typeof lit.parse>[0], options?: Parameters<typeof lit.parse>[1]) {
    const sourceText = source.toString();
    const file = ts.createSourceFile(options?.from ?? "embedded.ts", sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let expected = 0;
    const visit = (node: ts.Node) => {
      if (ts.isTaggedTemplateExpression(node) && ts.isIdentifier(node.tag) && node.tag.text === "css") {
        expected++;
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    const result = lit.parse(source, { ...options, map: false });
    if (result.nodes.length !== expected) {
      throw new SyntaxError(
        `CSS template coverage failure in ${options?.from ?? "input"}: parsed ${result.nodes.length} of ${expected} css templates. Fix invalid or unsupported interpolation; no template may be skipped.`,
      );
    }
    return result;
  },
};
