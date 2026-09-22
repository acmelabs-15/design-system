import { afterEach, expect, test } from "bun:test";
import "../../../all";
afterEach(() => document.body.replaceChildren());
test("card structure keeps independent actions outside its native label", async () => {
  const card = document.createElement("acme-checkbox-card");
  card.innerHTML = '<span slot="heading">Plan</span><span slot="description">Details</span><button slot="actions">Help</button>';
  document.body.append(card);
  await card.updateComplete;
  const label = card.shadowRoot!.querySelector("label")!;
  expect(label.querySelector("input[type=checkbox]")).not.toBeNull();
  expect(label.querySelector("slot[name=actions]")).toBeNull();
  expect(card.shadowRoot!.querySelector(".actions slot[name=actions]")).not.toBeNull();
  card.querySelector("button")!.click();
  expect(card.checked).toBe(false);
  card.click();
  expect(card.checked).toBe(true);
});

test("independent action controls keep their own change notification", async () => {
  const card = document.createElement("acme-checkbox-card"),
    toggle = document.createElement("acme-toggle-button");
  toggle.slot = "actions";
  toggle.textContent = "Pin";
  card.append(toggle);
  document.body.append(card);
  await card.updateComplete;
  await toggle.updateComplete;
  let own = 0,
    foreign = 0;
  toggle.addEventListener("acme-change", () => own++);
  card.addEventListener("acme-change", () => foreign++);
  toggle.click();
  expect(own).toBe(1);
  expect(foreign).toBe(0);
  expect(card.checked).toBe(false);
});
