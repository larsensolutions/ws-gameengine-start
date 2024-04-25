import { EnginePart } from "./types";
import { Vector } from "./vector";

export class GameGraphics implements EnginePart {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  center: Vector;
  currentTranslation: Vector; // Panning
  currentZoom: number;

  private static readonly MIN_ZOOM = 0.1;

  private constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!; // Disable alpha for performance, will always be black as background

    this.center = Vector.of(0, 0);
    this.currentTranslation = Vector.of(0, 0);
    this.currentZoom = 1;

    this.transform();
    this.scaleToDevicePixelRatio();
  }

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
    this.canvas.style.transform = "";
  }

  static of = (canvas: HTMLCanvasElement): GameGraphics => new GameGraphics(canvas);

  private scaleToDevicePixelRatio() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // 1. Multiply the canvas's width and height by the devicePixelRatio
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // 2. Force it to display at the original (logical) size with CSS or style attributes
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // 3. Scale the context so you can draw on it without considering the ratio.
    this.ctx.scale(dpr, dpr);

    // Track the center of the visible canvas
    this.center = Vector.of(rect.width / 2, rect.height / 2);
  }

  public clear(): GameGraphics {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  public translate(offset: Vector): GameGraphics {
    this.currentTranslation.add(offset);
    return this;
  }

  public zoom(zoom: number): GameGraphics {
    this.currentZoom = Math.max(zoom, GameGraphics.MIN_ZOOM);
    return this;
  }

  public translateToCenter(): GameGraphics {
    this.currentTranslation.add(this.center);
    return this;
  }

  public transform(): GameGraphics {
    // Not recommended to scale canvas, use css transform instead, this usees gpu!
    this.canvas.style.transform = `scale(${this.currentZoom}) translate(${this.currentTranslation.x}px,${this.currentTranslation.y}px)`;
    return this;
  }
}
