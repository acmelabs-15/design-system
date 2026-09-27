import { describe, expect, spyOn, test } from "bun:test";
import { batch, createAtom, shallow } from "@tanstack/lit-store";
import { html, LitElement } from "lit";
import { atomState } from "../atom-state";
import { PublicAtomProbe, publicShared } from "./fixtures/atom-state-public";

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

  test("follows detached changes and reconnects without accumulating subscriptions", async () => {
    document.body.innerHTML = "<div id='destination'></div>";
    who.set("initial");
    let active = 0;
    const subscribe = who.subscribe.bind(who);
    const subscriptionSpy = spyOn(who, "subscribe").mockImplementation((listener) => {
      active++;
      const subscription = subscribe(typeof listener === "function" ? { next: listener } : listener);
      return {
        unsubscribe() {
          active--;
          subscription.unsubscribe();
        },
      };
    });
    const a = document.createElement("shared-probe") as SharedProbe;
    const b = document.createElement("shared-probe") as SharedProbe;
    try {
      document.body.append(a, b);
      await Promise.all([a.updateComplete, b.updateComplete]);
      // Each binding owns TanStack's render subscription and its named Lit notification.
      expect(active).toBe(4);

      a.remove();
      expect(active).toBe(2);
      who.set("detached");
      await b.updateComplete;
      expect(a.textContent).toBe("initial");
      expect(b.textContent).toBe("detached");

      document.body.append(a);
      await a.updateComplete;
      expect(a.textContent).toBe("detached");
      expect(active).toBe(4);

      for (const value of ["first", "second", "third"]) {
        document.getElementById("destination")!.append(a);
        await a.updateComplete;
        expect(active).toBe(4);
        who.set(value);
        await Promise.all([a.updateComplete, b.updateComplete]);
        expect(a.textContent).toBe(value);
        expect(b.textContent).toBe(value);
      }
    } finally {
      a.remove();
      b.remove();
      subscriptionSpy.mockRestore();
    }
    expect(active).toBe(0);
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

describe("atomState and changedProperties", () => {
  test("a write is recorded, so an element can ask which of its fields moved", async () => {
    // Eleven elements read `changedProperties.has(name)` in `updated` to do work only when one
    // particular field moved. An atom-backed field is invisible to Lit unless the write records it,
    // and without this those checks silently read false — six tests failed on exactly that.
    document.body.innerHTML = "";
    const el = await mount();
    const seen: string[] = [];
    (el as unknown as { updated(ch: Map<string, unknown>): void }).updated = (ch) => {
      for (const k of ch.keys()) {
        seen.push(String(k));
      }
    };
    el.count = 5;
    await el.updateComplete;
    expect(seen).toContain("count");
  });
});

customElements.define("public-atom-probe", PublicAtomProbe);
const mountPublic = async () => {
  document.body.innerHTML = "";
  publicShared.set(1);
  const element = document.createElement("public-atom-probe") as PublicAtomProbe;
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("atomState with public Lit metadata", () => {
  test("keeps initial defaults absent and reflects an explicit same-default write", async () => {
    const element = await mountPublic();
    expect(element.hasAttribute("count")).toBe(false);
    expect(element.hasAttribute("value")).toBe(false);
    expect(element.hasAttribute("shared")).toBe(false);
    element.count = 0;
    await element.updateComplete;
    expect(element.getAttribute("count")).toBe("0");
  });

  test("updates canonical and derived values synchronously, independent of rendering", async () => {
    const element = await mountPublic();
    element.count = 7;
    expect(JSON.parse(element.derived.get()).count).toBe(7);
    await element.updateComplete;
    expect(element.changed).toContain("count");
    expect(element.previous.get("count")).toBe(0);
    expect(element.getAttribute("count")).toBe("7");
    element.allowUpdate = false;
    element.count = 15;
    expect(element.count).toBe(15);
    expect(JSON.parse(element.derived.get()).count).toBe(15);
    await element.updateComplete;
    expect(element.shadowRoot?.textContent).toContain('"count":7');
  });

  test("converts attributes and restores the captured default on removal", async () => {
    const element = await mountPublic();
    element.setAttribute("count", "12");
    element.setAttribute("open", "");
    await element.updateComplete;
    expect(element.count).toBe(12);
    expect(element.open).toBe(true);
    element.removeAttribute("count");
    element.removeAttribute("open");
    await element.updateComplete;
    expect(element.count).toBe(0);
    expect(element.open).toBe(false);
    expect(element.hasAttribute("count")).toBe(false);
  });

  test("reflects shared accessor writes and external writes with the property name", async () => {
    const element = await mountPublic();
    element.shared = 2;
    await element.updateComplete;
    expect(publicShared.get()).toBe(2);
    expect(element.getAttribute("shared")).toBe("2");
    publicShared.set(3);
    expect(element.shared).toBe(3);
    expect(JSON.parse(element.derived.get()).shared).toBe(3);
    await element.updateComplete;
    expect(element.getAttribute("shared")).toBe("3");
    expect(element.changed).toContain("shared");
    expect(element.previous.get("shared")).toBe(2);
  });

  test("reconciles detached local and external writes when connected", async () => {
    const element = await mountPublic();
    element.remove();
    element.value = "detached";
    publicShared.set(4);
    document.body.append(element);
    await element.updateComplete;
    expect(element.getAttribute("value")).toBe("detached");
    expect(element.getAttribute("shared")).toBe("4");
    expect(element.changed).toContain("shared");
    expect(element.shadowRoot?.textContent).toContain('"shared":4');
  });

  test("preserves defaults after writes before first connection", async () => {
    document.body.innerHTML = "";
    publicShared.set(1);
    const element = document.createElement("public-atom-probe") as PublicAtomProbe;
    element.count = 8;
    publicShared.set(5);
    document.body.append(element);
    await element.updateComplete;
    expect(element.getAttribute("count")).toBe("8");
    expect(element.getAttribute("shared")).toBe("5");
    element.removeAttribute("count");
    element.removeAttribute("shared");
    await element.updateComplete;
    expect(element.count).toBe(0);
    expect(element.shared).toBe(1);
  });

  test("replays pre-definition properties over attributes without replacing defaults", async () => {
    document.body.innerHTML = "";
    const element = document.createElement("late-public-atom-probe") as PublicAtomProbe;
    element.count = 31;
    element.setAttribute("count", "12");
    document.body.append(element);
    customElements.define("late-public-atom-probe", class extends PublicAtomProbe {});
    await element.updateComplete;
    expect(element.count).toBe(31);
    expect(element.getAttribute("count")).toBe("31");
    element.removeAttribute("count");
    await element.updateComplete;
    expect(element.count).toBe(0);
  });

  test("retains named equality behavior for NaN and signed zero", async () => {
    const element = await mountPublic();
    element.count = NaN;
    await element.updateComplete;
    element.changed = [];
    element.count = NaN;
    await element.updateComplete;
    expect(element.changed).toEqual([]);
    element.count = 0;
    await element.updateComplete;
    element.count = -0;
    await element.updateComplete;
    expect(Object.is(element.count, -0)).toBe(true);
    expect(element.changed).toContain("count");
  });

  test("reflects the final batched external value with its original old value", async () => {
    const element = await mountPublic();
    batch(() => {
      publicShared.set(6);
      publicShared.set(7);
    });
    await element.updateComplete;
    expect(element.shared).toBe(7);
    expect(element.getAttribute("shared")).toBe("7");
    expect(element.changed).toContain("shared");
    expect(element.previous.get("shared")).toBe(1);
  });

  test("retains the first old value when a batch mixes external and accessor writes", async () => {
    const element = await mountPublic();
    batch(() => {
      publicShared.set(6);
      element.shared = 7;
    });
    await element.updateComplete;
    expect(element.shared).toBe(7);
    expect(element.getAttribute("shared")).toBe("7");
    expect(element.previous.get("shared")).toBe(1);
  });

  test("uses subclass metadata and converters without replacing the atom accessor", async () => {
    document.body.innerHTML = "";
    class Converted extends PublicAtomProbe {
      static properties = {
        count: {
          attribute: "amount",
          noAccessor: true,
          reflect: true,
          useDefault: true,
          converter: { fromAttribute: (value: string | null) => (value === null ? null : Number(value.slice(1))), toAttribute: (value: number) => "#" + value },
        },
      };
    }
    customElements.define("converted-public-atom-probe", Converted);
    const element = document.createElement("converted-public-atom-probe") as Converted;
    document.body.append(element);
    await element.updateComplete;
    element.setAttribute("amount", "#42");
    await element.updateComplete;
    expect(element.count).toBe(42);
    expect(JSON.parse(element.derived.get()).count).toBe(42);
    element.count = 43;
    await element.updateComplete;
    expect(element.getAttribute("amount")).toBe("#43");
    element.removeAttribute("amount");
    await element.updateComplete;
    expect(element.count).toBe(0);
  });
});
