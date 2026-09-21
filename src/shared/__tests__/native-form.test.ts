import { expect, test } from "bun:test";
import { batch, createAtom } from "@tanstack/lit-store";
import type { ReactiveControllerHost } from "lit";
import { NativeFormController, type NativeFormOptions, type NativeFormValue } from "../native-form";

function fixture(overrides: Partial<NativeFormOptions<string, string>> = {}) {
  let submitted: NativeFormValue = null;
  let restored: NativeFormValue = null;
  let flags: ValidityStateFlags = {};
  const host = document.createElement("div") as HTMLElement & ReactiveControllerHost;
  host.addController = () => {};
  host.requestUpdate = () => {};
  host.attachInternals = () =>
    ({
      setFormValue(value: NativeFormValue, state: NativeFormValue) {
        submitted = value;
        restored = state;
      },
      setValidity(value: ValidityStateFlags) {
        flags = value;
      },
      checkValidity() {
        return !Object.values(flags).some(Boolean);
      },
    }) as ElementInternals;
  const form = new NativeFormController(host, {
    initialValue: "initial",
    normalize: String,
    valueAttribute: "value",
    fromAttribute: (value) => value ?? "",
    toAttribute: String,
    serialize: (state) => state.value,
    validate: (state) => ({ flags: { valueMissing: state.required && !state.value }, message: state.required && !state.value ? "Required" : "" }),
    ...overrides,
  });
  form.hostConnected();
  return {
    form,
    get submitted() {
      return submitted;
    },
    get restored() {
      return restored;
    },
    get flags() {
      return flags;
    },
  };
}

test("native submission is current before canonical observers and inside an outer batch", () => {
  const f = fixture();
  const observed: unknown[] = [];
  const subscription = f.form.state.subscribe(() => observed.push(f.submitted));
  batch(() => {
    f.form.setValue("changed");
    expect(f.submitted).toBe("changed");
  });
  expect(observed).toEqual(["changed"]);
  subscription.unsubscribe();
  f.form.hostDisconnected();
});

test("same-value writes become dirty; defaults and reset follow native ownership", () => {
  const f = fixture();
  f.form.setValue("initial");
  f.form.attributeChanged("value", null, "new default");
  expect(f.form.value).toBe("initial");
  expect(f.form.defaultValue).toBe("new default");
  f.form.formResetCallback();
  expect(f.submitted).toBe("new default");
  expect(f.form.state.get().dirty).toBe(false);
  f.form.attributeChanged("value", "new default", null);
  expect(f.submitted).toBe("");
  f.form.hostDisconnected();
});

test("custom validation overrides family validation and clearing restores it", () => {
  const f = fixture();
  f.form.setValue("");
  f.form.attributeChanged("required", null, "");
  expect(f.flags.valueMissing).toBe(true);
  f.form.setCustomValidity("Not accepted");
  expect(f.flags).toEqual({ customError: true });
  f.form.setCustomValidity("");
  expect(f.flags.valueMissing).toBe(true);
  f.form.setValue("accepted");
  expect(f.form.checkValidity()).toBe(true);
  f.form.hostDisconnected();
});

test("fieldset state remains separate from authored disabled state", () => {
  const f = fixture();
  f.form.formDisabledCallback(true);
  expect(f.form.effectiveDisabled).toBe(true);
  expect(f.form.state.get().disabled).toBe(false);
  f.form.formDisabledCallback(false);
  expect(f.form.effectiveDisabled).toBe(false);
  f.form.hostDisconnected();
});

test("extra canonical state synchronizes while connected and catches up after reconnect", () => {
  const suffix = createAtom("a");
  const f = fixture({ extra: () => suffix.get(), serialize: (state, extra) => state.value + extra });
  suffix.set("b");
  expect(f.submitted).toBe("initialb");
  f.form.hostDisconnected();
  suffix.set("c");
  expect(f.submitted).toBe("initialb");
  f.form.hostConnected();
  expect(f.submitted).toBe("initialc");
  f.form.hostDisconnected();
});

test("restoration uses the family decoder and preserves an explicit null restoration state", () => {
  const f = fixture({ restoration: () => null, restore: (value) => String(value).toUpperCase() });
  expect(f.restored).toBeNull();
  f.form.formStateRestoreCallback("saved", "restore");
  expect(f.form.value).toBe("SAVED");
  expect(f.submitted).toBe("SAVED");
  expect(f.form.state.get().dirty).toBe(true);
  f.form.hostDisconnected();
});

test("a constraint callback cannot leave native submission behind the canonical value", () => {
  let controller: NativeFormController<string, string> | undefined;
  const f = fixture({
    synchronize: (state) => {
      if (state.value === "normalize") controller?.setValue("normalized");
    },
  });
  controller = f.form;
  f.form.setValue("normalize");
  expect(f.form.value).toBe("normalized");
  expect(f.submitted).toBe("normalized");
  f.form.hostDisconnected();
});
