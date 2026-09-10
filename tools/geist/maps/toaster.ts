// Maps the viewport of acme-toaster (src/components/toaster) to Geist's toast area: the fixed
// box a gap from the bottom right corner (an `--offset-bottom` the element writes for the
// on-screen keyboard), in the toast layer, that rises 10px once it holds more than one toast
// (`.stacked`) and moves to calc(50% - 210px) from the right for `center`. Every state is a sketch
// under tools/geist/sketch/toast.*.json: the page's own showcases render a button only. The
// toasts inside are the roots of maps/toast.ts.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "toast",
  component: "Toasts",
  root: has("group/toastArea"),
  ours: ".area",
  defaults: { center: "false", stacked: "false" },
  derive: { stacked: (n) => String(n.children.length > 1) },
  props: {
    center: { true: ".center" },
    stacked: { true: ".stacked" },
  },
  ignore: ["toast-area", "group/toastArea"],
  children: [{ ours: "", pick: (c) => "data-geist-toast" in c.attrs, all: true, leaf: true }],
};
