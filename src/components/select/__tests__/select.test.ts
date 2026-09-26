import { expect, test } from "bun:test";
import "../../../all";

const mount = async () => {
  document.body.innerHTML = '<acme-select value="a"><acme-option value="a">Alpha</acme-option><acme-option value="b">Beta</acme-option></acme-select>';
  const select = document.querySelector("acme-select")!;
  for (let i = 0; i < 3; i++) {
    await select.updateComplete;
    for (const option of select.querySelectorAll("acme-option")) {
      await option.updateComplete;
    }
  }
  return select;
};
test("Select separates current and reset values", async () => {
  const select = await mount();
  expect(select.value).toBe("a");
  expect(select.defaultValue).toBe("a");
  select.value = "b";
  select.setAttribute("value", "a");
  expect(select.value).toBe("b");
  select.formResetCallback();
  expect(select.value).toBe("a");
  select.value = undefined;
  expect(select.value).toBeUndefined();
});
test("Select exposes the new scalar interface without the native-select aliases", async () => {
  const select = await mount();
  expect(select.size).toBe("medium");
  expect(select.side).toBe("bottom");
  expect(select.align).toBe("start");
  expect(select.sideOffset).toBe(4);
  expect(select.clearable).toBe(false);
  expect("options" in select).toBe(false);
  expect("select" in select).toBe(false);
  expect("withLabel" in select).toBe(false);
  expect("error" in select).toBe(false);
  expect(() => (select.value = "")).toThrow();
  expect(() => (select.size = "tiny" as never)).toThrow();
});
test("programmatic selection remains silent", async () => {
  const select = await mount();
  let count = 0;
  select.addEventListener("acme-change", () => count++);
  select.value = "b";
  select.formResetCallback();
  expect(count).toBe(0);
});
test("Option selection is derived from the owning value", async () => {
  const select = await mount();
  const option = select.querySelector("acme-option")!;
  expect("selected" in option).toBe(false);
  expect("chosen" in option).toBe(false);
  expect("active" in option).toBe(false);
  expect(option.value).toBe("a");
  expect(option.label).toBe("Alpha");
  select.value = "b";
  await select.updateComplete;
  expect(select.value).toBe("b");
});
test("Option labels ignore renderer marker comments", async () => {
  const select = await mount();
  const option = select.querySelector("acme-option")!;
  option.prepend(document.createComment("renderer marker"));
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(option.label).toBe("Alpha");
});
