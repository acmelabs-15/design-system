import ts from "typescript";

/** Compare syntax meaning before mechanical fixes; ignore only statement-body braces and spelling of equal literals. */
export function lintSourceShape(source: string, filename: string): string {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const bodyParent = (parent: ts.Node | undefined) =>
    parent &&
    (ts.isIfStatement(parent) ||
      ts.isForStatement(parent) ||
      ts.isForOfStatement(parent) ||
      ts.isForInStatement(parent) ||
      ts.isWhileStatement(parent) ||
      ts.isDoStatement(parent) ||
      ts.isWithStatement(parent));
  const shape = (node: ts.Node): unknown => {
    if (ts.isParenthesizedExpression(node)) {
      return shape(node.expression);
    }
    if (ts.isBinaryExpression(node) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken].includes(node.operatorToken.kind)) {
      const operands: unknown[] = [];
      const collect = (expression: ts.Expression): void => {
        if (ts.isParenthesizedExpression(expression)) {
          collect(expression.expression);
        } else if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === node.operatorToken.kind) {
          collect(expression.left);
          collect(expression.right);
        } else {
          operands.push(shape(expression));
        }
      };
      collect(node);
      return ["logical", node.operatorToken.kind, operands];
    }
    if (ts.isBlock(node) && bodyParent(node.parent) && node.statements.length === 1) {
      const statement = node.statements[0]!;
      const lexical = ts.isVariableStatement(statement) && Boolean(statement.declarationList.flags & ts.NodeFlags.BlockScoped);
      if (!lexical && !ts.isFunctionDeclaration(statement) && !ts.isClassDeclaration(statement)) {
        return shape(statement);
      }
    }
    const children: unknown[] = [];
    ts.forEachChild(node, (child) => {
      children.push(shape(child));
    });
    const text =
      ts.isIdentifier(node) || ts.isPrivateIdentifier(node) || ts.isLiteralExpression(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node)
        ? node.text
        : undefined;
    const docs = ts
      .getJSDocCommentsAndTags(node)
      .filter((doc) => doc.parent === node)
      .map((doc) => doc.getText(file).replace(/\s+/g, " "));
    const semanticFlags = node.flags & (ts.NodeFlags.BlockScoped | ts.NodeFlags.OptionalChain);
    const rawText = ts.isTemplateLiteralToken(node) ? node.rawText : undefined;
    return [node.kind, semanticFlags, text, rawText, children, docs];
  };
  return JSON.stringify(shape(file));
}

export function assertLintSourcePreserved(before: string, after: string, filename: string): void {
  if (lintSourceShape(before, filename) !== lintSourceShape(after, filename)) {
    throw new Error(`Mechanical lint changed the syntax contract: ${filename}`);
  }
}
