import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { isPlainRecord } from "../plain-record";

test("accepts data records from this or another realm", () => {
  for (const value of [{}, { medium: 2 }, Object.create(null), runInNewContext("({ medium: 2 })"), runInNewContext("Object.create(null)")]) {
    expect(isPlainRecord(value)).toBe(true);
  }
});

test("rejects primitives, collections, class instances and custom prototype chains", () => {
  class Settings {
    medium = 2;
  }
  for (const value of [null, undefined, 2, "medium", false, [], new Date(), new Map(), new Settings(), Object.create({ medium: 2 }), runInNewContext("new (class Settings {})()")]) {
    expect(isPlainRecord(value)).toBe(false);
  }
});

test("does not run an object's or prototype's constructor getter", () => {
  let reads = 0;
  const own = Object.defineProperty({}, "constructor", {
    get: () => {
      reads++;
      return Object;
    },
  });
  const inherited = Object.create(
    Object.defineProperty(Object.create(null), "constructor", {
      get: () => {
        reads++;
        return Object;
      },
    }),
  );
  expect(isPlainRecord(own)).toBe(true);
  expect(isPlainRecord(inherited)).toBe(false);
  expect(reads).toBe(0);
});
