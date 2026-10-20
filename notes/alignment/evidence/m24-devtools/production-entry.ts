import "../../../../dist/define/input.js";
if (process.env.NODE_ENV === "development") {
  import("../../../../packages/devtools/src/index");
}
document.body.dataset.ready = "yes";
