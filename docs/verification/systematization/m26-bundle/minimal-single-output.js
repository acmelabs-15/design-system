var __esm = (fn, res, err) => () => {
  if (fn)
    try {
      res = fn(fn = 0);
    } catch (e) {
      err = [e];
    }
  if (err)
    throw err[0];
  return res;
};

// notes/alignment/evidence/m26-bundle/minimal/example.js
var Example;
var init_example = __esm(() => {
  Example = class Example extends HTMLElement {
  };
});

// notes/alignment/evidence/m26-bundle/minimal/define/example.js
var init_example2 = __esm(() => {
  init_example();
  customElements.define("acme-probe", Example);
});

// notes/alignment/evidence/m26-bundle/minimal/probe.js
var before = typeof Example;
await Promise.resolve().then(() => (init_example2(), {}));
window.__result = {
  before,
  after: typeof Example,
  same: customElements.get("acme-probe") === Example
};
