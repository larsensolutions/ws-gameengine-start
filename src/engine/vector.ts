export class Vector {
  x: number;
  y: number;
  private constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static of = (x: number, y: number): Vector => new Vector(x, y);

  add(vector: Vector, scale: number = 1): void {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
  }

  subtract(vector: Vector, scale: number = 1): void {
    this.x -= vector.x * scale;
    this.y -= vector.y * scale;
  }

  distanceTo(vector: Vector): number {
    return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
  }

  distanceToXY(x: number, y: number): number {
    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
  }

  distanceToIsometric(vector: Vector): number {
    return Math.sqrt((this.x - vector.x) ** 2 + 2 * (this.y - vector.y) ** 2);
  }

  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  fromAngle(angle: number, magnitude: number): void {
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  }

  angleTo(vector: Vector): number {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  copy(): Vector {
    return Vector.of(this.x, this.y);
  }

  public static getAngleBetween(target: Vector, current: Vector): number {
    return Math.atan2(target.y - current.y, target.x - current.x);
  }
}
