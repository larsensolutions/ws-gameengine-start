import { Entity, Vector, getRandomWithinRange } from "../../engine";
import { Particle } from "./particle";
import { SquidState } from "./state";

export class Emitter extends Entity<SquidState> {
  private particles: Particle[];
  private maxParticles: number;
  private duration: number;
  private time: number;
  private callback?: () => void;
  private done: boolean;
  private spread: number;
  private emissionRate: number;
  private maxDistance: number;
  private emitted: number;

  private constructor(position: Vector, maxParticles: number, duration: number, callback?: () => void) {
    super(position);
    this.particles = [];
    this.maxParticles = maxParticles;
    this.duration = duration;
    this.time = 0;
    this.callback = callback;
    this.done = true;
    this.spread = 360;
    this.emissionRate = this.maxParticles * 0.9;
    this.maxDistance = 0;
    this.emitted = 0;

    for (let i = 0; i < this.maxParticles; i++) {
      const angle = this.spread - Math.random() * this.spread * 2;
      const x = this.position.x + Math.random() * 10 + 0.5;
      const y = this.position.y;
      const velocity = Vector.of(x, y);
      velocity.fromAngle(angle, Math.random() * 0.8 + 0.9);
      this.particles.push(Particle.of(Vector.of(this.position.x, this.position.y), Vector.of(velocity.x - velocity.y, (velocity.x + velocity.y) / 2)));
    }
  }

  public static of(position: Vector, maxParticles: number, duration: number, callback?: () => void): Emitter {
    return new Emitter(position, maxParticles, duration, callback);
  }

  public update(deltaTime: number, state: SquidState): void {
    if (this.done) return;
    this.time += deltaTime;
    if (this.time >= this.duration) {
      if (this.callback) this.callback();
      this.done = true;
    }
    for (let i = 0; i < this.emissionRate; i++) {
      this.emitParticle();
    }
    this.particles.forEach((particle) => particle.update(deltaTime, state));
    if (this.particles.length >= this.maxParticles && this.particles.every((particle) => particle.isDone())) {
      this.done = true;
    }
  }

  private emitParticle(): void {
    if (this.emitted < this.maxParticles) {
      this.particles[this.emitted].reset().setMaxDistance(this.maxDistance);
      this.emitted++;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.done) return;
    this.particles.forEach((particle) => particle.draw(ctx));
  }

  public isDone(): boolean {
    return this.done;
  }

  public getMaxDistance(): number {
    return this.maxDistance;
  }

  public reset(): void {
    this.time = 0;
    this.emitted = 0;
    this.done = false;
    this.maxDistance = getRandomWithinRange(60, 160);
  }

  depth(): number {
    throw new Error("Method not implemented.");
  }
}
