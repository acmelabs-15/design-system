export type ScrollGeometry = Readonly<{ maximum: number; thumb: number; travel: number; offset: number; position: number; overflow: boolean }>;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
/** Uses physical track coordinates; native scrolling remains the source of position. */
export function scrollGeometry(viewport: number, content: number, track: number, position: number, minimumThumb = 24): ScrollGeometry {
  if (![viewport, content, track, position, minimumThumb].every(Number.isFinite)) throw new TypeError("Scroll measurements must be finite");
  viewport = Math.max(0, viewport);
  content = Math.max(0, content);
  track = Math.max(0, track);
  const maximum = Math.max(0, content - viewport),
    overflow = maximum > 1;
  const thumb = overflow ? Math.min(track, Math.max(0, minimumThumb, content === 0 ? 0 : (track * viewport) / content)) : track;
  const travel = Math.max(0, track - thumb),
    current = clamp(position, 0, maximum);
  return Object.freeze({ maximum, thumb, travel, offset: maximum ? (current / maximum) * travel : 0, position: current, overflow });
}
export function physicalScrollLeft(native: number, maximum: number, rtl: boolean): number {
  return clamp(rtl ? maximum + native : native, 0, maximum);
}
export function nativeScrollLeft(physical: number, maximum: number, rtl: boolean): number {
  const position = clamp(physical, 0, maximum);
  return rtl ? position - maximum : position;
}
export function scrollFromPointer(point: number, trackStart: number, grabOffset: number, geometry: ScrollGeometry): number {
  return geometry.travel > 0 ? clamp((point - trackStart - grabOffset) / geometry.travel, 0, 1) * geometry.maximum : geometry.position;
}
