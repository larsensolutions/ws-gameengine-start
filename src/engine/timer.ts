export class Timer {
  private time: number;
  private duration: number;
  private done: boolean;
  private callback?: () => void;

  private constructor(duration: number, callback?: () => void) {
    this.time = 0;
    this.duration = duration;
    this.callback = callback;
    this.done = false;
  }

  public static of(duration: number, callback?: () => void): Timer {
    return new Timer(duration, callback);
  }

  public static empty(): Timer {
    return new Timer(1000);
  }

  public update(deltaTime: number): void {
    if (this.done) return;
    this.time += deltaTime;
    if (this.time >= this.duration) {
      if (this.callback) this.callback();
      this.done = true;
    }
  }

  setCallback(callback: () => void): void {
    this.callback = callback;
  }

  setDuration(duration: number): void {
    this.duration = duration;
  }

  // Assume future timestamp
  setDurationFromTimestamp(timestamp: number): void {
    this.duration = timestamp - Date.now();
  }

  isDone(): boolean {
    return this.done;
  }

  reset(): void {
    this.time = 0;
    this.done = false;
  }
}
