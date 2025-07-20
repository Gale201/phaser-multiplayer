import { Vector2 } from "./vectors";

export class Box {
  static readonly zero: Box = new Box(0, 0, 0, 0);

  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  intersects(other: Box): boolean {
    return !(
      this.x >= other.right ||
      this.right <= other.x ||
      this.y >= other.bottom ||
      this.bottom <= other.y
    );
  }

  static from(box: { x: number; y: number; w: number; h: number }) {
    return new Box(box.x, box.y, box.w, box.h);
  }

  copy(): Box {
    return new Box(this.x, this.y, this.w, this.h);
  }

  get centerX() {
    return this.x + this.w / 2;
  }

  get centerY() {
    return this.y + this.h / 2;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.w;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.h;
  }

  getCenter() {
    return new Vector2(this.centerX, this.centerY);
  }

  getPosition() {
    return new Vector2(this.x, this.y);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
