import { expect, test } from "bun:test";
import { Typeahead } from "../typeahead";
const fixture = () => {
  let current: string | undefined,
    time = 0;
  const items = ["Save", "Save as", "Settings", "Édit"];
  const typeahead = new Typeahead(
    { addController() {}, removeController() {}, requestUpdate() {}, updateComplete: Promise.resolve(true) },
    {
      items: () => items,
      current: () => current,
      text: (item) => item,
      move: (item) => {
        current = item;
      },
      now: () => time,
      locale: () => "en-US",
    },
  );
  return {
    typeahead,
    get current() {
      return current;
    },
    advance(ms: number) {
      time += ms;
    },
    key(key: string) {
      const event = new KeyboardEvent("keydown", { key, cancelable: true });
      return { handled: typeahead.handleKey(event), event };
    },
  };
};
test("repeated characters cycle while a multi-letter prefix retains its match", () => {
  const f = fixture();
  f.key("s");
  expect(f.current).toBe("Save");
  f.key("s");
  expect(f.current).toBe("Save as");
  f.key("s");
  expect(f.current).toBe("Settings");
  f.advance(1001);
  f.key("s");
  f.key("a");
  expect(f.current).toBe("Save");
});
test("a buffered space extends a label instead of activating an item", () => {
  const f = fixture();
  expect(f.key(" ").handled).toBe(false);
  for (const key of "save a") f.key(key);
  expect(f.current).toBe("Save as");
});
test("locale search handles accents and ignores canceled/composing keys", () => {
  const f = fixture();
  f.key("e");
  expect(f.current).toBe("Édit");
  const event = new KeyboardEvent("keydown", { key: "s", isComposing: true, cancelable: true });
  expect(f.typeahead.handleKey(event)).toBe(false);
  expect(f.current).toBe("Édit");
  f.typeahead.hostDisconnected();
  expect(f.typeahead.active).toBe(false);
});

test("unmatched buffered spaces remain typeahead rather than activating an item", () => {
  const f = fixture();
  f.key("z");
  const result = f.key(" ");
  expect(result.handled).toBe(true);
  expect(result.event.defaultPrevented).toBe(true);
  expect(f.current).toBeUndefined();
  f.advance(1001);
  expect(f.key(" ").handled).toBe(false);
});
