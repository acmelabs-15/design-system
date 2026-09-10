import { describe, expect, test } from "bun:test";
import { html, LitElement } from "lit";
import { createAtom, shallow } from "@tanstack/lit-store";
import { atomState } from "../atom-state";

const who = createAtom("Ada");

class SharedProbe extends LitElement {
  @atomState(who) who!: string;
  createRenderRoot() {
    return this;
  }
  render() {
    return html`${this.who}`;
  }
}
customElements.define("shared-probe", SharedProbe);

class CompareProbe extends LitElement {
  renders = 0;
  @atomState<{ x: number; y: number }>(undefined, { compare: shallow }) point = { x: 1, y: 2 };
  createRenderRoot() {
    return this;
  }
  render() {
    this.renders++;
    return html`${this.point.x},${this.point.y}`;
  }
}
customElements.define("compare-probe", CompareProbe);

class Probe extends LitElement {
  renders = 0;
  @atomState() open = false;
  @atomState() count = 0;
  createRenderRoot() {
    return this;
  }
  render() {
    this.renders++;
    return html`<span>${String(this.open)}:${this.count}</span>`;
  }
}
customElements.define("atom-state-probe", Probe);

const mount = async () => {
  const el = document.createElement("atom-state-probe") as Probe;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

describe("atomState", () => {
  test("reads its initial value and re-renders on write", async () => {
    document.body.innerHTML = "";
    const el = await mount();
    expect(el.open).toBe(false);
    expect(el.textContent).toBe("false:0");
    el.open = true;
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.textContent).toBe("true:0");
  });

  test("two fields on one element are independent", async () => {
    document.body.innerHTML = "";
    const el = await mount();
    el.count = 7;
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.count).toBe(7);
    expect(el.textContent).toBe("false:7");
  });

  test("two instances do not share state", async () => {
    document.body.innerHTML = "";
    const a = await mount();
    const b = await mount();
    a.count = 1;
    b.count = 2;
    await a.updateComplete;
    await b.updateComplete;
    expect(a.count).toBe(1);
    expect(b.count).toBe(2);
  });

  test("writing the same value again does not re-render", async () => {
    document.body.innerHTML = "";
    const el = await mount();
    el.open = true;
    await el.updateComplete;
    const renders = el.renders;
    el.open = true;
    await el.updateComplete;
    expect(el.renders).toBe(renders);
  });

  test("a field with no initializer still re-renders once written", async () => {
    // The atom is created eagerly in an initializer. Created lazily instead, a field first touched
    // by a read from render() would register its controller after `hostUpdate` had already run, so
    // it would never subscribe and the element would stop following that field for good.
    class Bare extends LitElement {
      @atomState() declare v: number | undefined;
      createRenderRoot() {
        return this;
      }
      render() {
        return html`${String(this.v)}`;
      }
    }
    customElements.define("atom-state-bare", Bare);

    document.body.innerHTML = "";
    const el = document.createElement("atom-state-bare") as Bare;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.textContent).toBe("undefined");

    el.v = 5;
    await el.updateComplete;
    expect(el.textContent).toBe("5");
  });

  test("survives the host being moved in the DOM", async () => {
    // The adapter's hostConnected patch is what makes this hold; see store-reconnect.test.ts.
    document.body.innerHTML = "<div id='from'></div><div id='to'></div>";
    const el = document.createElement("atom-state-probe") as Probe;
    document.getElementById("from")!.appendChild(el);
    await el.updateComplete;
    el.count = 3;
    await el.updateComplete;
    expect(el.textContent).toBe("false:3");

    document.getElementById("to")!.appendChild(el);
    await el.updateComplete;
    el.count = 4;
    await el.updateComplete;
    expect(el.textContent).toBe("false:4");
  });
});

describe("atomState with a shared atom", () => {
  test("every instance reads and writes the same value", async () => {
    // Peter's case: one atom at module scope, several elements following it.
    document.body.innerHTML = "<shared-probe></shared-probe><shared-probe></shared-probe>";
    const [a, b] = [...document.querySelectorAll("shared-probe")] as SharedProbe[];
    await a.updateComplete;
    await b.updateComplete;
    expect(a.textContent).toBe("Ada");
    expect(b.textContent).toBe("Ada");

    a.who = "Grace";
    await a.updateComplete;
    await b.updateComplete;
    expect(b.who).toBe("Grace");
    expect(b.textContent).toBe("Grace");
  });
});

describe("atomState with a compare", () => {
  test("a rebuilt object with the same shape does not re-render", async () => {
    document.body.innerHTML = "<compare-probe></compare-probe>";
    const el = document.querySelector("compare-probe") as CompareProbe;
    await el.updateComplete;
    const renders = el.renders;
    // A new object with identical fields: identity says changed, shallow says not.
    el.point = { x: 1, y: 2 };
    await el.updateComplete;
    expect(el.renders).toBe(renders);
    el.point = { x: 9, y: 2 };
    await el.updateComplete;
    expect(el.renders).toBeGreaterThan(renders);
  });
});
