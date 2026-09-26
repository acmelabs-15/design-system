import { createAtom } from "@tanstack/lit-store";
import { defaultBreakpoints, resolveBreakpoints, type ResponsiveBreakpoints } from "./responsive";

type ConfigurationState = Readonly<{ widths: ResponsiveBreakpoints; configured: boolean; used: boolean }>;
type BreakpointConfiguration = Readonly<{
  configure(overrides: Partial<ResponsiveBreakpoints>): ResponsiveBreakpoints;
  read(): ResponsiveBreakpoints;
  use(): ResponsiveBreakpoints;
}>;

function sameWidths(a: ResponsiveBreakpoints, b: ResponsiveBreakpoints): boolean {
  return (Object.keys(defaultBreakpoints) as (keyof ResponsiveBreakpoints)[]).every((name) => a[name] === b[name]);
}

/** @internal A separate owner makes startup transitions testable without resetting application state. */
export function createBreakpointConfiguration(): BreakpointConfiguration {
  const state = createAtom<ConfigurationState>(Object.freeze({ widths: defaultBreakpoints, configured: false, used: false }));
  return Object.freeze({
    configure(overrides: Partial<ResponsiveBreakpoints>): ResponsiveBreakpoints {
      const widths = resolveBreakpoints(overrides);
      const current = state.get();
      if (current.configured || current.used) {
        if (!sameWidths(widths, current.widths)) {
          throw new Error(current.used ? "Breakpoints cannot change after responsive use" : "Breakpoints are already configured");
        }
        return current.widths;
      }
      state.set(Object.freeze({ widths, configured: true, used: false }));
      return widths;
    },
    read(): ResponsiveBreakpoints {
      return state.get().widths;
    },
    use(): ResponsiveBreakpoints {
      const current = state.get();
      if (!current.used) {
        state.set(Object.freeze({ ...current, used: true }));
      }
      return current.widths;
    },
  });
}

const configuration = createBreakpointConfiguration();

/** Select the application's rem thresholds once, before any responsive rendering uses them. */
export const configureBreakpoints = configuration.configure;
/** Inspect the current thresholds without ending startup configuration. */
export const readBreakpoints = configuration.read;
/** Consume the thresholds for responsive rendering and prevent subsequent changes. */
export const useBreakpoints = configuration.use;
