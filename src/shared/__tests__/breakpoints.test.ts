import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { createBreakpointConfiguration } from "../breakpoints";
import { defaultBreakpoints } from "../responsive";

test("inspection leaves startup configuration available and returns immutable defaults", () => {
  const configuration = createBreakpointConfiguration();
  const inspected = configuration.read();
  expect(inspected).toEqual(defaultBreakpoints);
  expect(Object.isFrozen(inspected)).toBe(true);
  expect(configuration.read()).toBe(inspected);
  expect(configuration.configure({ medium: 40 })).toEqual({ medium: 40, expanded: 52.5, large: 75, extraLarge: 100 });
  expect(inspected.medium).toBe(37.5);
});

test("configuration copies inputs and identical complete tables are harmless repeats", () => {
  const configuration = createBreakpointConfiguration();
  const input = { medium: 40 };
  const configured = configuration.configure(input);
  input.medium = 45;
  expect(configuration.read().medium).toBe(40);
  expect(Object.isFrozen(configured)).toBe(true);
  expect(configuration.configure({ medium: 40 })).toBe(configured);
  expect(configuration.configure({ medium: 40, expanded: 52.5, large: 75, extraLarge: 100 })).toBe(configured);
});

test("a successful first configuration prevents conflicting later startup calls", () => {
  const configuration = createBreakpointConfiguration();
  const initial = configuration.configure({ medium: 40 });
  expect(() => configuration.configure({ medium: 45 })).toThrow(/already configured/);
  expect(() => configuration.configure({ expanded: 60 })).toThrow(/already configured/);
  expect(() => configuration.configure({})).toThrow(/already configured/);
  expect(configuration.read()).toBe(initial);
});

test("first actual use locks defaults even before any configuration call", () => {
  const configuration = createBreakpointConfiguration();
  const used = configuration.use();
  expect(used).toEqual(defaultBreakpoints);
  expect(configuration.use()).toBe(used);
  expect(() => configuration.configure({ medium: 40 })).toThrow(/after responsive use/);
  expect(configuration.configure({})).toBe(used);
  expect(configuration.configure({ medium: 37.5 })).toBe(used);
  expect(configuration.read()).toBe(used);
});

test("use preserves configured widths and only equivalent later calls are accepted", () => {
  const configuration = createBreakpointConfiguration();
  const configured = configuration.configure({ medium: 40, expanded: 60 });
  expect(configuration.use()).toBe(configured);
  expect(configuration.configure({ medium: 40, expanded: 60 })).toBe(configured);
  expect(() => configuration.configure({ medium: 41, expanded: 60 })).toThrow(/after responsive use/);
  expect(configuration.read()).toBe(configured);
});

test("invalid calls leave the startup opportunity and selected widths unchanged", () => {
  const invalid: unknown[] = [
    { medium: 0 }, { medium: -1 }, { medium: Infinity }, { medium: NaN },
    { medium: 60 }, { large: 100 }, { extraLarge: 75 }, { compact: 0 },
    { medium: "40rem" }, { small: 20 }, null, [], new Date(),
  ];
  for (const input of invalid) {
    const configuration = createBreakpointConfiguration();
    expect(() => configuration.configure(input as Partial<typeof defaultBreakpoints>)).toThrow();
    expect(configuration.read()).toEqual(defaultBreakpoints);
    expect(configuration.configure({ medium: 40 }).medium).toBe(40);
  }
});

test("cross-realm plain records configure normally while accessors are not invoked", () => {
  const configuration = createBreakpointConfiguration();
  let invoked = false;
  expect(() => configuration.configure({ get medium() { invoked = true; return 40; } })).toThrow();
  expect(invoked).toBe(false);
  const input = runInNewContext("({ medium: 40 })");
  expect(configuration.configure(input).medium).toBe(40);
});

test("test owners do not share mutable configuration", () => {
  const first = createBreakpointConfiguration();
  const second = createBreakpointConfiguration();
  first.configure({ medium: 40 });
  first.use();
  expect(second.configure({ medium: 45 }).medium).toBe(45);
  expect(first.read().medium).toBe(40);
});

test("the singleton imports without locking and the standalone normalizer stays pure", () => {
  const configurationUrl = new URL("../breakpoints.ts", import.meta.url).href;
  const normalizationUrl = new URL("../responsive.ts", import.meta.url).href;
  const code = `
    const {configureBreakpoints,readBreakpoints,useBreakpoints}=await import(${JSON.stringify(configurationUrl)});
    const {normalizeResponsive}=await import(${JSON.stringify(normalizationUrl)});
    const before=readBreakpoints().medium;
    configureBreakpoints({medium:40});
    const selected=useBreakpoints();
    const validator=(value)=>typeof value==='number';
    console.log(JSON.stringify({before,selected:selected.medium,pure:normalizeResponsive({medium:1},validator)[0].min,configured:normalizeResponsive({medium:1},validator,selected)[0].min}));
  `;
  const result = Bun.spawnSync([process.execPath, "-e", code]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr.toString()).toBe("");
  expect(JSON.parse(result.stdout.toString())).toEqual({ before: 37.5, selected: 40, pure: 37.5, configured: 40 });
});
