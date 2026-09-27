import { expect, test } from "bun:test";
import { reactModule } from "../react";

test("wrapper metadata limits props to writable instance inputs and maps typed events", () => {
  const output = reactModule({
    name: "AcmeExample",
    tagName: "acme-example",
    members: [
      { kind: "field", name: "value" },
      { kind: "field", name: "padding" },
      { kind: "field", name: "validity", readonly: true },
      { kind: "field", name: "styles", static: true },
      { kind: "method", name: "focus" },
    ],
    events: [{ name: "acme-change", type: { text: "CustomEvent<{value:string}>" } }],
  });
  expect(output).toContain('"value" | "padding"');
  expect(output).not.toContain('"validity"');
  expect(output).not.toContain('"styles"');
  expect(output).toContain("onAcmeChange");
  expect(output).toContain("CustomEvent<{value:string}>");
});
test("native root metadata reaches the renderer", () => {
  const output = reactModule({ name: "AcmeFieldset", tagName: "acme-fieldset", "x-acme-native-root": "fieldset", members: [{ kind: "field", name: "padding" }] });
  expect(output).toContain('nativeRoot: "fieldset"');
});
test("numeric icon names remain valid TypeScript identifiers", () => {
  expect(reactModule({ name: "Acme10kIcon", tagName: "acme-10k-icon" })).toContain("export const Icon10k =");
});
