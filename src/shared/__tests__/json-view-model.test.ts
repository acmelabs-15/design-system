import { expect, test } from "bun:test";
import { inspectJson, visibleJsonNodes, jsonHighlight } from "../json-view-model";
test("inspection labels accessors, cycles and unsupported values without invoking them", () => {
  let called = 0;
  const value: any = { number: 1, fn: () => called++ };
  Object.defineProperty(value, "secret", {
    enumerable: true,
    get() {
      called++;
      return "secret";
    },
  });
  value.self = value;
  const model = inspectJson(value);
  expect(called).toBe(0);
  expect(model.byPath.get("/secret")?.text).toBe("[Accessor]");
  expect(model.byPath.get("/self")?.text).toBe("[Circular]");
  expect(model.byPath.get("/fn")?.text).toBe("[Function]");
});
test("encoded paths distinguish special keys and visible depth does not erase data", () => {
  const value = JSON.parse('{"__proto__":{"x":1},"a/b":{"~":2},"":null}');
  const model = inspectJson(value);
  expect(model.byPath.has("/a~1b/~0")).toBe(true);
  expect(model.byPath.has("/__proto__/x")).toBe(true);
  expect(visibleJsonNodes(model, new Map(), 1).map((node) => node.path)).toEqual(["", "/__proto__", "/a~1b", "/"]);
  expect(model.byPath.get("/")?.text).toBe("null");
});
test("deep and shared graphs use iterative inspection and preserve copied display values", () => {
  let value: any = { leaf: 1 };
  for (let i = 0; i < 2500; i++) value = { child: value };
  expect(inspectJson(value).nodes.length).toBe(2502);
  const shared = { a: 1 };
  const model = inspectJson({ one: shared, two: shared });
  shared.a = 9;
  expect(model.byPath.get("/one/a")?.text).toBe("1");
  expect(model.byPath.get("/two/a")?.text).toBe("1");
});
test("literal highlights are escaped and regex state remains caller-owned", () => {
  const literal = jsonHighlight("a.b");
  expect(literal?.test("axb")).toBe(false);
  expect(literal?.test("a.b")).toBe(true);
  const regex = /value/g;
  regex.lastIndex = 3;
  const copied = jsonHighlight(regex);
  expect(copied).not.toBe(regex);
  expect(copied?.lastIndex).toBe(0);
  expect(regex.lastIndex).toBe(3);
});
