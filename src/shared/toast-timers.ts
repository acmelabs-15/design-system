type Clock = { now(): number; set(run: () => void, delay: number): unknown; clear(handle: unknown): void };
type Timer = { remaining: number; started: number; handle?: unknown };
const nativeClock: Clock = { now: () => performance.now(), set: (run, delay) => setTimeout(run, delay), clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>) };
/** Owns deadline resources and independent pause reasons for one notification store. */
export class ToastTimers {
  private readonly timers = new Map<string, Timer>();
  private readonly pauses = new Set<unknown>();
  constructor(
    private expire: (id: string) => void,
    private clock: Clock = nativeClock,
  ) {}
  start(id: string, duration: number) {
    this.cancel(id);
    if (duration === 0) return;
    const timer = { remaining: duration, started: this.clock.now() };
    this.timers.set(id, timer);
    if (!this.pauses.size) this.schedule(id, timer);
  }
  private schedule(id: string, timer: Timer) {
    timer.started = this.clock.now();
    timer.handle = this.clock.set(
      () => {
        if (this.timers.get(id) !== timer) return;
        timer.handle = undefined;
        timer.remaining = Math.max(0, timer.remaining - (this.clock.now() - timer.started));
        if (timer.remaining > 0) this.schedule(id, timer);
        else {
          this.timers.delete(id);
          this.expire(id);
        }
      },
      Math.min(timer.remaining, 2_147_483_647),
    );
  }
  pause(reason: unknown) {
    if (this.pauses.has(reason)) return;
    this.pauses.add(reason);
    if (this.pauses.size !== 1) return;
    for (const timer of this.timers.values()) {
      if (timer.handle === undefined) continue;
      this.clock.clear(timer.handle);
      timer.handle = undefined;
      timer.remaining = Math.max(0, timer.remaining - (this.clock.now() - timer.started));
    }
  }
  resume(reason: unknown) {
    if (!this.pauses.delete(reason) || this.pauses.size) return;
    for (const [id, timer] of this.timers) this.schedule(id, timer);
  }
  cancel(id: string) {
    const timer = this.timers.get(id);
    if (timer?.handle !== undefined) this.clock.clear(timer.handle);
    this.timers.delete(id);
  }
  clear() {
    for (const id of this.timers.keys()) this.cancel(id);
  }
}
