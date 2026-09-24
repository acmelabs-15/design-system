export type FlowPoint = Readonly<{ x: number; y: number }>;
export type FlowBounds = FlowPoint & Readonly<{ width: number; height: number }>;
export type FlowViewport = FlowPoint & Readonly<{ zoom: number }>;
const finite = (point: FlowPoint) => Number.isFinite(point.x) && Number.isFinite(point.y);
const overlaps = (a: FlowBounds, b: FlowBounds) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
/** Rounds only bends whose entire corner box is clear of unrelated obstacles. */
export function roundedFlowPath(input: readonly FlowPoint[], radius: number, obstacles: readonly FlowBounds[]): string {
  if (!Number.isFinite(radius) || radius < 0 || input.some((point) => !finite(point))) throw new RangeError("Flow paths require finite points and a nonnegative radius");
  const points = input.filter((point, index) => index === 0 || point.x !== input[index - 1].x || point.y !== input[index - 1].y);
  if (!points.length) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const current = points[i],
      previous = points[i - 1],
      next = points[i + 1];
    if (!next) {
      path += ` L ${current.x} ${current.y}`;
      continue;
    }
    const a = Math.hypot(current.x - previous.x, current.y - previous.y),
      b = Math.hypot(next.x - current.x, next.y - current.y),
      cross = (current.x - previous.x) * (next.y - current.y) - (current.y - previous.y) * (next.x - current.x);
    let r = Math.min(radius, a / 2, b / 2);
    if (Math.abs(cross) / (a * b) < 1e-8) r = 0;
    const start = { x: current.x - ((current.x - previous.x) / a) * r, y: current.y - ((current.y - previous.y) / a) * r },
      end = { x: current.x + ((next.x - current.x) / b) * r, y: current.y + ((next.y - current.y) / b) * r };
    const box = {
      x: Math.min(start.x, current.x, end.x),
      y: Math.min(start.y, current.y, end.y),
      width: Math.max(start.x, current.x, end.x) - Math.min(start.x, current.x, end.x),
      height: Math.max(start.y, current.y, end.y) - Math.min(start.y, current.y, end.y),
    };
    if (obstacles.some((obstacle) => overlaps(box, obstacle))) r = 0;
    if (!r) path += ` L ${current.x} ${current.y}`;
    else path += ` L ${start.x} ${start.y} Q ${current.x} ${current.y} ${end.x} ${end.y}`;
  }
  return path;
}
export function zoomFlowViewport(view: FlowViewport, zoom: number, anchor: FlowPoint): FlowViewport {
  if (!finite(view) || !finite(anchor) || !Number.isFinite(zoom) || zoom <= 0 || !Number.isFinite(view.zoom) || view.zoom <= 0)
    throw new RangeError("Flow viewport requires finite coordinates and positive zoom");
  const ratio = zoom / view.zoom;
  return Object.freeze({ x: anchor.x - (anchor.x - view.x) * ratio, y: anchor.y - (anchor.y - view.y) * ratio, zoom });
}
export function fitFlowViewport(viewport: { width: number; height: number }, graph: { width: number; height: number }, min: number, max: number, padding: number): FlowViewport {
  if (
    ![viewport.width, viewport.height, graph.width, graph.height, min, max, padding].every(Number.isFinite) ||
    viewport.width < 0 ||
    viewport.height < 0 ||
    graph.width < 0 ||
    graph.height < 0 ||
    min <= 0 ||
    max < min ||
    padding < 0
  )
    throw new RangeError("Flow fit requires finite dimensions and ordered positive zoom limits");
  const zoom = Math.max(min, Math.min(max, (viewport.width - padding * 2) / Math.max(1, graph.width), (viewport.height - padding * 2) / Math.max(1, graph.height)));
  return Object.freeze({ x: (viewport.width - graph.width * zoom) / 2, y: (viewport.height - graph.height * zoom) / 2, zoom });
}
/** A bounded arrowhead that terminates exactly at the routed endpoint. */
export function flowArrow(points: readonly FlowPoint[], size: number): string {
  if (!Number.isFinite(size) || size < 0 || points.some((point) => !finite(point))) throw new RangeError("Flow arrow requires finite points and a nonnegative size");
  const end = points.at(-1),
    before = points
      .slice(0, -1)
      .reverse()
      .find((point) => point.x !== end?.x || point.y !== end?.y);
  if (!end || !before) return "";
  const length = Math.hypot(end.x - before.x, end.y - before.y),
    reach = Math.min(size, length / 2),
    dx = (end.x - before.x) / length,
    dy = (end.y - before.y) / length;
  return `M ${end.x} ${end.y} L ${end.x - dx * reach - (dy * reach) / 2} ${end.y - dy * reach + (dx * reach) / 2} L ${end.x - dx * reach + (dy * reach) / 2} ${end.y - dy * reach - (dx * reach) / 2} Z`;
}
