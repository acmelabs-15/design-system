import { html, render } from "lit";
import React from "react";
import { createRoot } from "react-dom/client";
import { Input } from "@acmelabs/design-system-react/components/input";
import "@acmelabs/design-system/define/input";
import "@acmelabs/design-system/define/theme";
import { registerTheme } from "@acmelabs/design-system/configure";
import { createDesignSystemInspector } from "@acmelabs/design-system-devtools";

registerTheme("inspector-blue", { colors: { accent: "#0044cc" } });
registerTheme("inspector-red", { colors: { accent: "#cc2200" } });
const outer = document.createElement("acme-theme");
outer.theme = "inspector-blue";
const root = document.createElement("main"),
  surface = document.createElement("aside"),
  outside = document.createElement("acme-input");
outside.id = "outside";
outside.value = "outside-secret";
outer.append(root);
document.body.append(outer, outside, surface);
const litHost = document.createElement("div"),
  reactHost = document.createElement("div"),
  secret = document.createElement("acme-input");
secret.id = "password";
secret.type = "password";
secret.value = "hidden-password";
root.append(litHost, reactHost, secret);
const renderLit = (value: string) =>
  render(html`<acme-input id="lit-input" .value=${value} aria-label="Lit input"></acme-input>`, litHost);
renderLit("Lit initial");
const react = createRoot(reactHost);
let reactValue = "React initial";
const renderReact = (value: string) => {
  reactValue = value;
  react.render(React.createElement(Input, { id: "react-input", value: reactValue, "aria-label": "React input" }));
};
renderReact(reactValue);
const inspector = createDesignSystemInspector({ root, eventLimit: 3 });
inspector.mount(surface);
Object.assign(window, {
  inspection: {
    root,
    surface,
    outside,
    secret,
    outer,
    lit: renderLit,
    react: renderReact,
    unmount: () => inspector.unmount(),
    mount: () => inspector.mount(surface),
    dispose: () => {
      inspector.dispose();
      react.unmount();
    },
    changeTheme: () => {
      outer.theme = "inspector-red";
      outer.appearance = "dark";
    },
    detached: undefined as Element | undefined,
    removeLit() {
      this.detached = root.querySelector("#lit-input")!;
      this.detached.remove();
    },
    restoreLit() {
      if (this.detached) litHost.append(this.detached);
    },
  },
});
