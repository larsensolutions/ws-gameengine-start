import { Entity } from "../../engine/entity";
import { Vector } from "../../engine/vector";
import { PizzaState } from "./state";

import { PizzaSliceOptions } from "./types";

export class PizzaSlice extends Entity<PizzaState> {
  depth(): number {
    return this.position.y;
  }

  options: PizzaSliceOptions;
  pizzaOrigo: Vector;
  positionMiddle: Vector;
  positionEnd: Vector;
  angleStart: number;
  angleEnd: number;
  angleMiddle: number;
  distance: number; // distance from the sliceselectorpin, used to determine which slice is selected
  roast: { insult: string; voice: string } | undefined;

  private constructor(options: PizzaSliceOptions) {
    super(Vector.of(0, 0));
    this.options = options;
    this.positionMiddle = Vector.of(0, 0);
    this.positionEnd = Vector.of(0, 0);
    this.pizzaOrigo = Vector.of(0, 0);
    this.angleStart = 0;
    this.angleEnd = 0;
    this.angleMiddle = 0;
    this.distance = 0;
  }

  static of(options: PizzaSliceOptions): PizzaSlice {
    return new PizzaSlice(options);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.options.color;
    ctx.beginPath();
    ctx.moveTo(this.pizzaOrigo.x, this.pizzaOrigo.y);
    ctx.arc(this.pizzaOrigo.x, this.pizzaOrigo.y, 200, this.angleStart, this.angleEnd);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.fillText(this.options.name, this.positionMiddle.x - ctx.measureText(this.options.name).width / 2, this.positionMiddle.y);
    ctx.fillText(`${this.options.tickets} tickets`, this.positionMiddle.x - ctx.measureText(this.options.name).width / 2, this.positionMiddle.y + 20);
    ctx.stroke();

    /*
    if (this.roast) {
      ctx.fillText(this.roast.insult, this.pizzaOrigo.x - ctx.measureText(this.roast.insult).width / 2, this.positionMiddle.y - 100);
    } 
    */
    ctx.closePath();
  }

  public update(_deltaTime: number, state: PizzaState): void {
    // Calculate slice angle start and end based on the slice width and index
    this.angleStart = state.sliceWidth * state.currentSliceIndex + state.currentRotationAngle;
    this.angleEnd = state.sliceWidth * (state.currentSliceIndex + 1) + state.currentRotationAngle;
    this.angleMiddle = this.angleEnd - (this.angleEnd - this.angleStart) / 2;

    this.position.x = state.pizzaorigo.x + Math.cos(this.angleStart) * state.pizzaRadius;
    this.position.y = state.pizzaorigo.y + Math.sin(this.angleStart) * state.pizzaRadius;

    this.positionEnd.x = state.pizzaorigo.x + Math.cos(this.angleEnd) * state.pizzaRadius;
    this.positionEnd.y = state.pizzaorigo.y + Math.sin(this.angleEnd) * state.pizzaRadius;

    // Update the mid position for text
    this.positionMiddle.x = state.pizzaorigo.x + Math.cos(this.angleMiddle) * (state.pizzaRadius + 50);
    this.positionMiddle.y = state.pizzaorigo.y + Math.sin(this.angleMiddle) * (state.pizzaRadius + 50);

    this.distance = this.positionMiddle.distanceTo(state.sliceSelectorPin);
    this.pizzaOrigo = state.pizzaorigo;
  }

  public setRoasting(roast: { insult: string; voice: string } | undefined): void {
    this.roast = roast;
  }
}
