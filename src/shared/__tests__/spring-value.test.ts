import { expect, test } from "bun:test";
import { LitElement } from "lit";
import { SpringValue } from "../spring-value";

class SpringTarget extends LitElement {}
customElements.define("test-spring-value-target", SpringTarget);
test("direct manipulation settles at the canonical endpoint without a release jump", () => {
  const host = new SpringTarget();
  let target = 10;
  const visual = new SpringValue(
    host,
    () => target,
    () => ({ stiffness: 200, damping: 20 }),
  );
  document.body.append(host);
  visual.update();
  target = 40;
  visual.update();
  target = 70;
  visual.jump();
  expect(visual.value).toBe(70);
  expect(visual.settled).toBe(true);
  visual.update();
  expect(visual.value).toBe(70);
  host.remove();
});
