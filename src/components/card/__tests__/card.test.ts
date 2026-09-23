import { expect, test } from "bun:test";
import "../../../define/card";
import "../../../define/card-header";
import "../../../define/card-body";
import "../../../define/card-footer";
import "../../../define/inset";
import "../../../define/item";
import "../../../define/item-content";
import "../../../define/item-actions";
test("Card switches its native meaning without replacing author content", async () => {
  document.body.innerHTML = "<acme-card><acme-card-header>Title</acme-card-header><acme-card-body><button>Action</button></acme-card-body></acme-card>";
  const card = document.querySelector("acme-card")!,
    child = card.querySelector("button");
  await card.updateComplete;
  card.as = "article";
  card.variant = "outline";
  card.size = "large";
  await card.updateComplete;
  expect(card.shadowRoot!.querySelector("article[part=root]")).not.toBeNull();
  expect(card.querySelector("button")).toBe(child);
  expect(card.querySelector("h1,h2,h3")).toBeNull();
});
test("Inset defaults restore after attribute removal", async () => {
  document.body.innerHTML = '<acme-inset side="block-start" clip="false"><button>Action</button></acme-inset>';
  const inset = document.querySelector("acme-inset")!;
  await inset.updateComplete;
  expect(inset.clip).toBe(false);
  inset.removeAttribute("clip");
  inset.removeAttribute("side");
  await inset.updateComplete;
  expect(inset.clip).toBe(true);
  expect(inset.side).toBe("all");
});
test("Item leaves independent actions and selection ownership to content", async () => {
  document.body.innerHTML =
    '<acme-item variant="outline"><acme-item-content><a href="#record">Record</a></acme-item-content><acme-item-actions><button>Manage</button></acme-item-actions></acme-item>';
  const item = document.querySelector("acme-item")!,
    button = item.querySelector("button");
  await item.updateComplete;
  item.orientation = "vertical";
  await item.updateComplete;
  expect(item.querySelector("button")).toBe(button);
  expect(item.shadowRoot!.querySelector("button,a,[role=listitem],[role=option]")).toBeNull();
});
