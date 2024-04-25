import { GameState } from "./types";

export abstract class Entity<State extends GameState> {
  posistion: Vector;
  velocity: Vector;

  constructor(postion?: Vector, velocity?: Vector) {
    this.velocity = velocity || Vector.of(0, 0);
    this.posistion = postion || Vector.of(0, 0);
  }

  abstract update(deltatime: number, state: State): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract depth(): number;
}
