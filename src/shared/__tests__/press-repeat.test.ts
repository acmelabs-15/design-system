import { expect, test } from "bun:test";
import type { ReactiveElement } from "lit";
import { PressRepeat } from "../press-repeat";

test("releasing a press permits the next press and commits each changed action once", () => {
  const host = document.createElement("div") as unknown as ReactiveElement;
  host.addController = () => {};
  const button = document.createElement("button");
  host.append(button);
  document.body.append(host);
  let steps = 0,
    commits = 0;
  const repeat = new PressRepeat(host, {
    disabled: () => false,
    repeat: () => false,
    step: () => {
      steps++;
      return true;
    },
    commit: () => commits++,
    focus: () => {},
  });
  button.addEventListener("pointerdown", (event) => repeat.start(event, 1));
  for (let n = 0; n < 2; n++) {
    button.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, button: 0, cancelable: true }));
    window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
  }
  expect(steps).toBe(2);
  expect(commits).toBe(2);
  repeat.hostDisconnected();
  expect(commits).toBe(2);
  host.remove();
});
test("a synchronous disconnect in the edit callback leaves no active press", () => {
  const host = document.createElement("div") as unknown as ReactiveElement;
  host.addController = () => {};
  const button = document.createElement("button");
  host.append(button);
  document.body.append(host);
  let commits = 0;
  const repeat = new PressRepeat(host, {
    disabled: () => false,
    repeat: () => true,
    step: () => {
      host.remove();
      repeat.hostDisconnected();
      return true;
    },
    commit: () => commits++,
    focus: () => {},
  });
  button.addEventListener("pointerdown", (event) => repeat.start(event, 1));
  button.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, button: 0, cancelable: true }));
  window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
  expect(commits).toBe(0);
  repeat.hostDisconnected();
});
