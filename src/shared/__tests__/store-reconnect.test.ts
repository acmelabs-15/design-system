// Store subscriptions follow the host across disconnects and DOM moves.
import { describe, expect, spyOn, test } from "bun:test";
import { createAtom } from "@tanstack/lit-store";
import { html, LitElement } from "lit";
import { atomState } from "../atom-state";
import { createStore, StoreSelector } from "../state";

const store = createStore(0);

class ReconnectProbe extends LitElement {
  renders = 0;
  selector = new StoreSelector(this, () => store);
  createRenderRoot() {
    return this;
  }
  render() {
    this.renders++;
    return html`<span>${store.get()}</span>`;
  }
}
customElements.define("store-reconnect-probe", ReconnectProbe);

const shared = createAtom(0);
class MultipleBindingsProbe extends LitElement {
  @atomState(shared) value!: number;
  first = new StoreSelector(this, () => shared);
  second = new StoreSelector(this, () => shared);
  createRenderRoot() {
    return this;
  }
  render() {
    return html`${this.value}`;
  }
}
customElements.define("store-multiple-bindings-probe", MultipleBindingsProbe);

class SelectionProbe extends LitElement {
  source = createStore({ label: "first", other: 0 });
  renders = 0;
  selection = new StoreSelector(
    this,
    () => this.source,
    (value) => ({ label: value.label }),
    { compare: (a, b) => a.label === b.label },
  );
  createRenderRoot() {
    return this;
  }
  render() {
    this.renders++;
    return html`${this.source.get().label}`;
  }
}
customElements.define("store-selection-reconnect-probe", SelectionProbe);

describe("a store selector across a move", () => {
  test("keeps following the store after its host is re-parented", async () => {
    document.body.innerHTML = "<div id='from'></div><div id='to'></div>";
    const el = document.createElement("store-reconnect-probe") as ReconnectProbe;
    document.getElementById("from")!.appendChild(el);
    await el.updateComplete;

    store.setState(() => 1);
    await el.updateComplete;
    expect(el.textContent!.trim()).toBe("1");

    // The move: appending elsewhere disconnects and reconnects in one step.
    document.getElementById("to")!.appendChild(el);
    await el.updateComplete;

    store.setState(() => 2);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
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
      store.setState(() => n);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      await el.updateComplete;
    }
    expect(el.textContent!.trim()).toBe("12");
    expect(el.renders).toBeGreaterThan(before + 2);
  });

  test("schedules one connection update for a host with selectors and atom fields", async () => {
    document.body.innerHTML = "<div id='destination'></div>";
    const el = document.createElement("store-multiple-bindings-probe") as MultipleBindingsProbe;
    document.body.append(el);
    await el.updateComplete;
    const updates = spyOn(el, "requestUpdate");
    try {
      for (let move = 0; move < 3; move++) {
        updates.mockClear();
        document.getElementById("destination")!.append(el);
        await el.updateComplete;
        expect(updates).toHaveBeenCalledTimes(1);
      }
      shared.set(5);
      await el.updateComplete;
      expect(el.textContent).toBe("5");
    } finally {
      el.remove();
      updates.mockRestore();
    }
  });

  test("preserves selector and comparison options after reconnect", async () => {
    document.body.innerHTML = "<div id='destination'></div>";
    const el = document.createElement("store-selection-reconnect-probe") as SelectionProbe;
    document.body.append(el);
    await el.updateComplete;
    document.getElementById("destination")!.append(el);
    await el.updateComplete;
    const renders = el.renders;
    el.source.setState((value) => ({ ...value, other: 1 }));
    await el.updateComplete;
    expect(el.renders).toBe(renders);
    el.source.setState((value) => ({ ...value, label: "second" }));
    await el.updateComplete;
    expect(el.textContent).toBe("second");
    expect(el.renders).toBe(renders + 1);
    el.remove();
  });
});
