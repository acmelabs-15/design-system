import * as library from "./index.js";
const before = typeof library.Example;
await import("./define/example.js");
window.__result = {
  before,
  after: typeof library.Example,
  same: customElements.get("acme-probe") === library.Example,
};
