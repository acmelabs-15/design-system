// A store selector must keep following its store after its host is moved in the DOM.
//
// @tanstack/lit-store 0.13.2 ships TanStackStoreSelector with hostUpdate and hostDisconnected and no
// hostConnected. Disconnecting tears the subscription down and clears the remembered store;
// reconnecting does nothing, and hostUpdate returns early because the store has not changed. The
// element then never hears from the store again, silently and permanently.
//
// We patch it (patches/@tanstack%2Flit-store@0.13.2.patch) with the fix Peter proposed:
//
//   hostConnected() { this.#host.requestUpdate() }
//
// which routes the resubscription through Lit's own update cycle rather than around it.
//
// This test is the reason the patch exists. If a version bump drops it, this fails rather than the
// failure reaching an element.
import { describe, expect, test } from "bun:test";
import { createStore, TanStackStoreSelector } from "@tanstack/lit-store";
import { html, LitElement } from "lit";

const store = createStore(0);

class ReconnectProbe extends LitElement {
  renders = 0;
  selector = new TanStackStoreSelector(this, () => store);
  createRenderRoot() {
    return this;
  }
  render() {
    this.renders++;
    return html`<span>${store.get()}</span>`;
  }
}
customElements.define("store-reconnect-probe", ReconnectProbe);

describe("a store selector across a move", () => {
  test("keeps following the store after its host is re-parented", async () => {
    document.body.innerHTML = "<div id='from'></div><div id='to'></div>";
    const el = document.createElement("store-reconnect-probe") as ReconnectProbe;
    document.getElementById("from")!.appendChild(el);
    await el.updateComplete;

    store.setState(1);
    await el.updateComplete;
    expect(el.textContent!.trim()).toBe("1");

    // The move: appending elsewhere disconnects and reconnects in one step.
    document.getElementById("to")!.appendChild(el);
    await el.updateComplete;

    store.setState(2);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.textContent!.trim()).toBe("2");
  });

  test("still re-renders on every later change, not just the first", async () => {
    document.body.innerHTML = "<div id='from'></div><div id='to'></div>";
    const el = document.createElement("store-reconnect-probe") as ReconnectProbe;
    document.getElementById("from")!.appendChild(el);
    await el.updateComplete;
    document.getElementById("to")!.appendChild(el);
    await el.updateComplete;
    const before = el.renders;

    for (const n of [10, 11, 12]) {
      store.setState(n);
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
    }
    expect(el.textContent!.trim()).toBe("12");
    expect(el.renders).toBeGreaterThan(before + 2);
  });
});
