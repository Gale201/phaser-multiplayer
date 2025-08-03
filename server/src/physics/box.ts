import { Effect } from "../effects/effect";
import { Collidable } from "./collidable";
import { CollisionLayer } from "./collision-layers";
import { Vector2 } from "./vectors";

export class Box implements Collidable {
  x: number;
  y: number;
  w: number;
  h: number;

  isStatic: boolean = false;
  isTrigger: boolean = false;
  effects: Effect[] = [];

  private collisionLayer: CollisionLayer = CollisionLayer.NONE;
  private collisionMask: number = 0;

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

  static zero(): Box {
    return new Box(0, 0, 0, 0);
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

  getPosition(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  getHitbox(): Box {
    return this.copy();
  }

  getCollisionLayer(): number {
    return this.collisionLayer;
  }

  getCollisionMask(): number {
    return this.collisionMask;
  }

  setCollisionLayer(layer: CollisionLayer): void {
    this.collisionLayer = layer;
  }

  setCollisionMask(mask: number): void {
    this.collisionMask = mask;
  }
}
