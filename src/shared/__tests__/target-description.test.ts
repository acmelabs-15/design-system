import { expect, test } from "bun:test";
import { TargetDescription } from "../target-description";
test("owned descriptions preserve existing description text and restore the original attribute", () => {
  const target = document.createElement("button"),
    existing = document.createElement("span");
  existing.id = "original-help";
  existing.textContent = "Existing";
  target.setAttribute("aria-describedby", existing.id);
  document.body.append(existing, target);
  const controller = new TargetDescription({ addController() {} } as never);
  controller.update(target, "Additional");
  const references = target.ariaDescribedByElements ?? [];
  expect(references.map((element) => element.textContent)).toEqual(["Existing", "Additional"]);
  controller.update(target, "Updated");
  expect(target.ariaDescribedByElements?.at(-1)?.textContent).toBe("Updated");
  controller.detach();
  expect(target.getAttribute("aria-describedby")).toBe("original-help");
  target.remove();
  existing.remove();
});
