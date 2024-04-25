import { EnginePart } from "./types";
import { Vector } from "./vector";
import { EventBus } from "./events";

export class GameInput implements EnginePart {
  private eventBus: EventBus;
  private canvas: HTMLCanvasElement;
  private isMouseDown: boolean;
  private panStart: Vector;
  public panOffset: Vector;
  public zoom: number = 1;

  private boundEventHandlers: { [eventName: string]: EventListener } = {};

  private constructor(eventBus: EventBus, canvas: HTMLCanvasElement) {
    this.eventBus = eventBus;
    this.canvas = canvas;
    this.isMouseDown = false;
    this.panStart = Vector.of(0, 0);
    this.panOffset = Vector.of(0, 0);

    this.boundEventHandlers.click = this.handleMouseClick.bind(this) as EventListener;
    this.boundEventHandlers.mousedown = this.handleMouseDown.bind(this) as EventListener;
    this.boundEventHandlers.mousemove = this.handleMouseMove.bind(this) as EventListener;
    this.boundEventHandlers.mouseup = this.handleMouseUp.bind(this) as EventListener;
    this.boundEventHandlers.wheel = this.handleMouseWheel.bind(this) as EventListener;

    for (const [eventName, handler] of Object.entries(this.boundEventHandlers)) {
      this.canvas.addEventListener(eventName, handler);
    }
  }

  static of = (eventBus: EventBus, canvas: HTMLCanvasElement): GameInput => new GameInput(eventBus, canvas);

  start(): void {
    throw new Error("Method not implemented.");
  }
  pause(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    for (const [eventName, handler] of Object.entries(this.boundEventHandlers)) {
      this.canvas.removeEventListener(eventName, handler);
    }
  }

  private handleMouseClick(event: MouseEvent) {
    this.eventBus.emit("click", event as never);
  }

  private handleMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.panStart.x = event.clientX;
    this.panStart.y = event.clientY;
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) return;
    this.panOffset.x = this.panStart.x - event.clientX;
    this.panOffset.y = this.panStart.y - event.clientY;

    // make changes less sensitive
    this.panOffset.x /= 13 * -1;
    this.panOffset.y /= 13 * -1;
  }

  private handleMouseUp() {
    this.isMouseDown = false;
  }

  private handleMouseWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      this.zoom -= 0.1;
    } else {
      this.zoom += 0.1;
    }
  }

  resetPanOffset() {
    this.panOffset.x = 0;
    this.panOffset.y = 0;
  }
}
