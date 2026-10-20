import { expect, test } from "bun:test";
import { css } from "lit";
import { registerStyleProperties, withStyleProperties } from "../style-properties";

const property = { name: "--acme-test-size", syntax: "<length>", inherits: false, initialValue: "2px" };

test("style metadata causes no registration until a component uses its styles", () => {
  const calls: unknown[] = [];
  const registry = {
    registerProperty(value: unknown) {
      calls.push(value);
    },
  };
  const original = css`
    :host {
      width: var(--acme-test-size);
    }
  `;
  const style = withStyleProperties(original, [property]);
  expect(style).toBe(original);
  expect(calls).toEqual([]);
  registerStyleProperties(
    [
      css`
        :host {
          display: block;
        }
      `,
      [style, style],
    ],
    registry,
  );
  expect(calls).toEqual([property]);
  registerStyleProperties(style, registry);
  expect(calls).toEqual([property]);
});

test("the same stylesheet registers independently in each document registry", () => {
  const calls: string[] = [];
  const style = withStyleProperties(css``, [property]);
  registerStyleProperties(style, {
    registerProperty() {
      calls.push("first");
    },
  });
  registerStyleProperties(style, {
    registerProperty() {
      calls.push("second");
    },
  });
  expect(calls).toEqual(["first", "second"]);
  expect(() => registerStyleProperties(style, undefined)).not.toThrow();
});

test("conflicting definitions fail before registering any property in that style group", () => {
  const calls: unknown[] = [];
  const registry = {
    registerProperty(value: unknown) {
      calls.push(value);
    },
  };
  const first = withStyleProperties(css``, [property]);
  const second = withStyleProperties(css``, [{ ...property, initialValue: "3px" }]);
  expect(() => registerStyleProperties([first, second], registry)).toThrow("Conflicting CSS registration");
  expect(calls).toEqual([]);
});

test("only duplicate-name platform errors are accepted; invalid registrations remain errors", () => {
  const style = withStyleProperties(css``, [property]);
  expect(() =>
    registerStyleProperties(style, {
      registerProperty() {
        throw new DOMException("registered", "InvalidModificationError");
      },
    }),
  ).not.toThrow();
  expect(() =>
    registerStyleProperties(style, {
      registerProperty() {
        throw new SyntaxError("invalid");
      },
    }),
  ).toThrow("invalid");
});
