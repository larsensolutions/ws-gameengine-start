import { Entity, Vector, getRandomWithinRange } from "../../engine";
import { SquidState } from "./state";

export class Particle extends Entity<SquidState> {
  private size: number;
  private color: string;
  private life: number;
  private done: boolean;
  private maxDistance: number;

  private positionCopy: Vector;
  private velocityCopy: Vector;

  private constructor(position: Vector, velocity: Vector, size: number, color: string, life: number, maxDistance: number) {
    super(position, velocity);

    this.size = size;
    this.color = color;
    this.life = life;
    this.done = true;
    this.maxDistance = maxDistance - getRandomWithinRange(0, 10);
    this.positionCopy = position.copy();
    this.velocityCopy = velocity.copy();
  }

  public static of(vector: Vector, velocity: Vector): Particle {
    return new Particle(vector, velocity, 2, "#ccc", 10000, 1000);
  }

  public update(deltaTime: number, state: SquidState): void {
    if (this.done) return;
    this.position.add(this.velocity);
    this.life -= deltaTime;
    if (this.life <= 0) {
      this.done = true;
    }
    if (this.position.distanceToIsometric(state.emitter.position) > this.maxDistance * 0.99) {
      this.position.subtract(this.velocity, 0.8);
    }
    if (this.position.distanceToIsometric(state.emitter.position) > this.maxDistance) {
      this.done = true;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.done) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  public isDone(): boolean {
    return this.done;
  }

  public reset(): Particle {
    this.done = false;
    this.life = 10000;
    this.position.x = this.positionCopy.x;
    this.position.y = this.positionCopy.y;
    this.velocity.x = this.velocityCopy.x;
    this.velocity.y = this.velocityCopy.y;
    return this;
  }

  public setMaxDistance(maxDistance: number): Particle {
    this.maxDistance = maxDistance;
    return this;
  }

  depth(): number {
    throw new Error("Method not implemented.");
  }
}
