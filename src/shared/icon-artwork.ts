import { createAtom } from "@tanstack/lit-store";

export type IconFamily = "rounded" | "outlined" | "sharp";
export type IconDefaults = Readonly<{ family: IconFamily; filled: boolean }>;
export type IconPath = Readonly<{ d: string; fillRule?: "evenodd" | "nonzero" }>;
export type IconGeometry = Readonly<{ viewBox: string; paths: readonly IconPath[] }>;
const defaults = createAtom<IconDefaults>(Object.freeze({ family: "rounded", filled: false }));
export const iconDefaults = createAtom(() => defaults.get());
const family = (value: unknown): value is IconFamily => value === "rounded" || value === "outlined" || value === "sharp";

/** Set the artwork defaults; explicit icon inputs keep their own values. */
export function configureIcons(input: Partial<IconDefaults>): void {
  const current = defaults.get(),
    next = { family: input.family ?? current.family, filled: input.filled ?? current.filled };
  if (!family(next.family) || typeof next.filled !== "boolean") {
    throw new TypeError("Invalid icon defaults");
  }
  defaults.set(Object.freeze(next));
}

/** One symbol's explicitly imported artwork; loading never performs a network request. */
export class IconArtwork {
  private readonly current = createAtom<ReadonlyMap<string, IconGeometry>>(new Map());
  readonly available = createAtom(() => this.current.get());
  constructor(
    readonly name: string,
    rounded: IconGeometry,
  ) {
    if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) {
      throw new TypeError("Invalid symbol name");
    }
    this.add("rounded", false, rounded);
  }
  get(family: IconFamily, filled: boolean): IconGeometry | undefined {
    return this.current.get().get(`${family}:${filled}`);
  }
  add(style: IconFamily, filled: boolean, geometry: IconGeometry): void {
    if (!family(style) || typeof filled !== "boolean") {
      throw new TypeError("Invalid artwork variant");
    }
    if (!/^[-+\d.eE]+(?:\s+[-+\d.eE]+){3}$/.test(geometry.viewBox) || !geometry.paths.length) {
      throw new TypeError("Invalid SVG geometry");
    }
    const paths = geometry.paths.map((path) => {
      if (typeof path.d !== "string" || !path.d.trim() || (path.fillRule !== undefined && !["evenodd", "nonzero"].includes(path.fillRule))) {
        throw new TypeError("Invalid SVG path");
      }
      return Object.freeze({ d: path.d, ...(path.fillRule ? { fillRule: path.fillRule } : {}) });
    });
    const owned = Object.freeze({ viewBox: geometry.viewBox, paths: Object.freeze(paths) }),
      key = `${style}:${filled}`,
      previous = this.current.get().get(key);
    if (previous) {
      if (JSON.stringify(previous) !== JSON.stringify(owned)) {
        throw new Error(`Conflicting artwork for ${this.name}:${key}`);
      }
      return;
    }
    const next = new Map(this.current.get());
    next.set(key, owned);
    this.current.set(next);
  }
}
