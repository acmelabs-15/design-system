import type { AcmeCombobox } from "../combobox";

/** Shared native-browser oracle for author-owned Lit and React keyed children. */
export async function rankedOptionIdentity(root: AcmeCombobox, renderOptions: (values: string[]) => void): Promise<void> {
  const settle = async () => {
    await root.updateComplete;
    for (let index = 0; index < 3; index++) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }
  };
  const equal = (actual: unknown, expected: unknown) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  };
  const visualOrder = () =>
    Array.from(root.querySelectorAll("acme-option"))
      .filter((option) => option.getBoundingClientRect().height > 0)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .map((option) => option.value);
  root.inputValue = "app";
  root.show();
  await settle();
  const original = Array.from(root.querySelectorAll("acme-option")).find((option) => option.value === "a")!;
  renderOptions(["c", "a"]);
  await settle();
  equal(
    Array.from(root.children).map((option) => (option as HTMLElement & { value: string }).value),
    ["c", "a"],
  );
  if (Array.from(root.querySelectorAll("acme-option")).find((option) => option.value === "a") !== original) {
    throw new Error("The renderer replaced the retained option node");
  }
  equal(visualOrder(), ["a", "c"]);
  renderOptions(["c"]);
  await settle();
  if (original.isConnected) {
    throw new Error("A deleted option remains connected");
  }
  equal(visualOrder(), ["c"]);
}
