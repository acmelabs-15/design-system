export type Size = "small" | "medium" | "large";

export const sizeCls = (s: Size) => ({ sm: s === "small", lg: s === "large" });
