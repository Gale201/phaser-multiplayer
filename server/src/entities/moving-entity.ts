import { Collidable } from "../physics/collidable";
import { Box } from "../physics/box";
import { Vector2 } from "../physics/vectors";
import { Entity } from "./entity";
import { Effect } from "../effects/effect";

export abstract class MovingEntity extends Entity implements Collidable {
  protected velocity: Vector2;
  protected intendedPosition: Vector2 | null = null;

  isStatic: boolean = false;
  isTrigger: boolean = false;
  effects: Effect[] = [];

  constructor(hitbox: Box) {
    super(hitbox);

    this.velocity = new Vector2();
  }

  moveTo(x: number | null = null, y: number | null = null): void {
    if (x !== null) this.hitbox.x = x;
    if (y !== null) this.hitbox.y = y;
  }

  moveBy(x: number | null = null, y: number | null = null): void {
    if (x !== null) this.hitbox.x += x;
    if (y !== null) this.hitbox.y += y;
  }

  abstract handleCollisionForXAxis(collidable: Collidable): void;

  abstract handleCollisionForYAxis(collidable: Collidable): void;

  getVelocity() {
    return this.velocity;
  }

  getIntendedPosition(): Vector2 | null {
    return this.intendedPosition;
  }

  setVelocity(velocity: Vector2) {
    this.velocity = velocity;
  }
}
