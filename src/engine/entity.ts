import { GameState } from "./types";
import { Vector } from "./vector";

export abstract class Entity<State extends GameState> {
  position: Vector;
  velocity: Vector;
  constructor(position?: Vector, velocity?: Vector) {
    this.position = position || Vector.of(0, 0);
    this.velocity = velocity || Vector.of(0, 0);
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract update(deltaTime: number, state: State): void;

  // In case we want to sort entities based on their depth for drawing
  abstract depth(): number;
}
