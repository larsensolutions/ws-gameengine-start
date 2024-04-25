import { Entity, Vector, isNumberBetween, getAngleInDegreesAdjusted } from "../../engine";
import { SquidState, SquidStates } from "./state";

// Create class Sprite that extends Entity and iterates through the spritesheet to draw the correct sprite, similar to the Tile class in the squid game

export class Sprite extends Entity<SquidState> {
  image: HTMLImageElement;
  blocked: boolean;

  spriteSize: Vector;
  spriteSheetSize: Vector;
  spriteSheetPosition: Vector;
  elapsedTime: number;
  elapsedY: number;
  angle: number;
  angleInDegrees: number;
  proximity: number;
  dead: boolean;

  private constructor(position: Vector, image: HTMLImageElement, blocked?: boolean) {
    super(position);
    this.image = image;
    this.blocked = blocked || false;

    this.spriteSheetPosition = Vector.of(1, 1);
    this.spriteSheetSize = Vector.of(8, 4);
    this.spriteSize = Vector.of(image.width / 8, image.height / 4);

    this.elapsedTime = 0;
    this.elapsedY = 0;
    this.angle = 0;
    this.angleInDegrees = 0;
    this.proximity = 0;
    this.dead = false;
  }

  public static of(position: Vector, image: HTMLImageElement, blocked?: boolean): Sprite {
    return new Sprite(position, image, blocked);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.dead) {
      return;
    }
    ctx.drawImage(
      this.image,
      this.spriteSheetPosition.x * this.spriteSize.x,
      this.spriteSheetPosition.y * this.spriteSize.y,
      this.spriteSize.x,
      this.spriteSize.y,
      this.position.x,
      this.position.y - this.spriteSize.y / 2,
      this.spriteSize.x,
      this.spriteSize.y
    );

    this.drawStats(ctx);
  }
  update(deltaTime: number, state: SquidState): void {
    if (state.gamestate === SquidStates.ELIMINATE_LOOSERS) {
      //NOT super accurate, but good enough for now
      if (this.position.distanceToXY(state.emitter.position.x, state.emitter.position.y - this.spriteSize.y / 2) < state.emitter.getMaxDistance()) {
        this.dead = true;
      }
    }
    if (this.dead) {
      return;
    }
    if (state.gamestate !== SquidStates.RUN_FOR_YOUR_LIFE) {
      return;
    }

    this.elapsedTime += deltaTime;
    this.elapsedY += deltaTime;

    this.angle = Vector.getAngleBetween(state.center.position, this.position);
    this.angleInDegrees = getAngleInDegreesAdjusted(this.angle);

    this.velocity.fromAngle(this.angle, 0.1);
    this.proximity = state.center.position.distanceTo(this.position);

    // WALKING SOUTH 270
    if (isNumberBetween(this.angleInDegrees, 210, 330)) {
      this.spriteSheetPosition.y = 3;
    }
    //WALKING NORTH 90
    else if (isNumberBetween(this.angleInDegrees, 45, 135)) {
      this.spriteSheetPosition.y = 2;
    }
    //WALKING WEST 180
    else if (isNumberBetween(this.angleInDegrees, 135, 225)) {
      this.spriteSheetPosition.y = 1;
      this.velocity.x -= 0.1;
    }
    //WALKING EAST
    else {
      this.spriteSheetPosition.y = 0;
      this.velocity.x += 0.1;
    }

    //Make sprite mote towards state.center
    this.position.add(this.velocity);

    // Show sprite in the directon of the angle
    if (this.elapsedTime > 100) {
      this.elapsedTime = 0;
      this.spriteSheetPosition.x++;
      if (this.spriteSheetPosition.x >= this.spriteSheetSize.x) {
        this.spriteSheetPosition.x = 0;
      }
    }
  }

  depth(): number {
    return this.position.y + this.spriteSize.y;
  }

  private drawStats(ctx: CanvasRenderingContext2D): void {
    // draw angle as text over sprite
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.strokeText("Angle:" + this.angleInDegrees.toFixed(2), this.position.x, this.position.y + this.spriteSize.y / 2);
    ctx.strokeText("Prox: " + this.proximity.toFixed(2), this.position.x, this.position.y + this.spriteSize.y / 2 + 10);
    ctx.stroke();
    ctx.closePath();
  }
}
