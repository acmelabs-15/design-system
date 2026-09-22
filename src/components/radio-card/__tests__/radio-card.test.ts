import { afterEach, expect, test } from "bun:test";
import "../../../all";
afterEach(() => document.body.replaceChildren());
test("radio cards retain one radio owner and separate independent actions", async () => {
  const group = document.createElement("acme-radio-group"),
    card = document.createElement("acme-radio-card");
  card.value = "pro";
  card.innerHTML = '<span slot="heading">Pro</span><button slot="actions">Help</button>';
  group.append(card);
  document.body.append(group);
  await group.updateComplete;
  await card.updateComplete;
  card.querySelector("button")!.click();
  expect(group.value).toBeUndefined();
  card.click();
  expect(group.value).toBe("pro");
  expect("indeterminate" in card).toBe(false);
  expect("invalid" in card).toBe(false);
  expect(card.shadowRoot!.querySelector("label slot[name=actions]")).toBeNull();
});
