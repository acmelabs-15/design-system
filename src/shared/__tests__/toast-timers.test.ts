import { expect, test } from "bun:test";
import { ToastTimers } from "../toast-timers";

function clock() {
  let time = 0,
    id = 0;
  const jobs = new Map<number, { at: number; run: () => void }>();
  return {
    now: () => time,
    set: (run: () => void, delay: number) => {
      jobs.set(++id, { at: time + delay, run });
      return id;
    },
    clear: (id: unknown) => {
      jobs.delete(id as number);
    },
    advance(ms: number) {
      const end = time + ms;
      while (true) {
        const next = [...jobs].sort((a, b) => a[1].at - b[1].at)[0];
        if (!next || next[1].at > end) break;
        time = next[1].at;
        jobs.delete(next[0]);
        next[1].run();
      }
      time = end;
    },
    get pending() {
      return jobs.size;
    },
  };
}
test("Toast timers preserve remaining time across repeated and overlapping pauses", () => {
  const c = clock(),
    expired: string[] = [];
  const timers = new ToastTimers((id) => expired.push(id), c);
  timers.start("a", 100);
  c.advance(30);
  timers.pause("focus");
  c.advance(200);
  timers.pause("hidden");
  timers.resume("focus");
  c.advance(200);
  expect(expired).toEqual([]);
  timers.resume("hidden");
  c.advance(40);
  timers.pause("hover");
  c.advance(10);
  timers.resume("hover");
  c.advance(29);
  expect(expired).toEqual([]);
  c.advance(1);
  expect(expired).toEqual(["a"]);
  expect(c.pending).toBe(0);
});
test("new paused timers get their full duration and persistent records never schedule", () => {
  const c = clock(),
    expired: string[] = [];
  const timers = new ToastTimers((id) => expired.push(id), c);
  timers.pause("hidden");
  timers.start("a", 100);
  timers.start("persistent", 0);
  c.advance(500);
  expect(c.pending).toBe(0);
  timers.resume("hidden");
  c.advance(99);
  expect(expired).toEqual([]);
  c.advance(1);
  expect(expired).toEqual(["a"]);
});
test("replacement and cancellation invalidate old callbacks and large delays remain safe", () => {
  const c = clock(),
    expired: string[] = [];
  const timers = new ToastTimers((id) => expired.push(id), c);
  timers.start("a", 50);
  c.advance(10);
  timers.start("a", 100);
  c.advance(50);
  expect(expired).toEqual([]);
  timers.cancel("a");
  timers.start("long", 2_147_483_700);
  c.advance(2_147_483_647);
  expect(expired).toEqual([]);
  c.advance(53);
  expect(expired).toEqual(["long"]);
  timers.start("cleared", 100);
  timers.clear();
  expect(c.pending).toBe(0);
});
