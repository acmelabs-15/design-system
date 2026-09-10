import { describe, expect, test } from "bun:test";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Places } from "../places";

@customElement("places-probe")
class PlacesProbe extends LitElement {
  places = new Places(this);
  render() {
    return html`${this.places.has("start") ? html`<span class="start"><slot name="start" @slotchange=${this.places.read}></slot></span>` : html`<slot name="start" @slotchange=${this.places.read}></slot>`}<slot></slot>${
      this.places.has("end") ? html`<span class="end"><slot name="end" @slotchange=${this.places.read}></slot></span>` : html`<slot name="end" @slotchange=${this.places.read}></slot>`
    }`;
  }
}

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as PlacesProbe;
  await el.updateComplete;
  return el;
};

describe("Places", () => {
  test("an empty element fills no place and renders no place span", async () => {
    const el = await mount(`<places-probe>Text</places-probe>`);
    expect(el.places.has("start")).toBe(false);
    expect(el.places.has("end")).toBe(false);
    expect(el.shadowRoot!.querySelector(".start")).toBeNull();
    expect(el.shadowRoot!.querySelector(".end")).toBeNull();
  });

  test("content in a slot fills that place and only that place", async () => {
    const el = await mount(`<places-probe><svg slot="start"></svg>Text</places-probe>`);
    expect(el.places.has("start")).toBe(true);
    expect(el.places.has("end")).toBe(false);
    expect(el.shadowRoot!.querySelector(".start")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".end")).toBeNull();
  });

  test("both places fill independently", async () => {
    const el = await mount(`<places-probe><svg slot="start"></svg>Text<svg slot="end"></svg></places-probe>`);
    expect(el.places.has("start")).toBe(true);
    expect(el.places.has("end")).toBe(true);
  });

  test("content added later fills the place, and removing it empties it", async () => {
    const el = await mount(`<places-probe>Text</places-probe>`);
    expect(el.places.has("end")).toBe(false);
    const svg = document.createElement("svg");
    svg.setAttribute("slot", "end");
    el.appendChild(svg);
    // The observer is asynchronous; a direct read stands in for it where none runs.
    el.places.read();
    await el.updateComplete;
    expect(el.places.has("end")).toBe(true);
    expect(el.shadowRoot!.querySelector(".end")).not.toBeNull();
    svg.remove();
    el.places.read();
    await el.updateComplete;
    expect(el.places.has("end")).toBe(false);
    expect(el.shadowRoot!.querySelector(".end")).toBeNull();
  });

  test("a read that changes nothing requests no update", async () => {
    const el = await mount(`<places-probe><svg slot="start"></svg>Text</places-probe>`);
    let updates = 0;
    const original = el.requestUpdate.bind(el);
    el.requestUpdate = ((...args: unknown[]) => {
      updates++;
      return (original as (...a: unknown[]) => unknown)(...args);
    }) as typeof el.requestUpdate;
    el.places.read();
    expect(updates).toBe(0);
  });
});
