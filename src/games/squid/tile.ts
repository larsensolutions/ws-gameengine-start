import { Entity, Vector } from "../../engine";
import { SquidState } from "./state";

export class Tile extends Entity<SquidState> {
  depth(): number {
    return this.position.y + this.offset.y;
  }
  image: HTMLImageElement;
  blocked: boolean;
  offset: Vector;

  private constructor(position: Vector, image: HTMLImageElement, tileSize: Vector) {
    super(position);
    this.image = image;
    this.blocked = false;
    this.offset = Vector.of(image.width - tileSize.x, image.height - tileSize.y);
  }

  public static Empty: Tile = Tile.of(Vector.of(0, 0), new Image(), Vector.of(0, 0));

  public static of(position: Vector, image: HTMLImageElement, tileSize: Vector): Tile {
    return new Tile(position, image, tileSize);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x - this.offset.x, this.position.y - this.offset.y);
    //this.drawRectangle(ctx);
  }

  update(deltaTime: number, state: SquidState): void {}

  public isBlocked(): boolean {
    return this.blocked;
  }

  public setBlocked(blocked: boolean): void {
    this.blocked = blocked;
  }

  public drawDot(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  private drawRectangle(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 0.5;
    ctx.rect(this.position.x, this.position.y, this.image.width, this.image.height);
    ctx.stroke();
    ctx.closePath();
  }
}
