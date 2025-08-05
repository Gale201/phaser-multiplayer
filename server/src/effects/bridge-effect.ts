import { Entity } from "../entities/entity";
import { Player } from "../entities/player";
import { Collidable } from "../physics/collidable";
import { Vector2 } from "../physics/vectors";
import { Effect } from "./effect";

export class BridgeEffect implements Effect {
  public static readonly HORIZONTAL = "horizontal";
  public static readonly VERTICAL = "vertical";

  private k: number;
  private direction: string;

  constructor(k: number, direction: string = BridgeEffect.HORIZONTAL) {
    this.k = k;
    this.direction = direction;
  }

  onTriggerEnter(self: Collidable, other: Entity): void {}

  onTriggerStay(self: Collidable, other: Entity): void {
    if (other instanceof Player) {
      let yVelocity = this.k * other.getVelocity().y;
      if (this.direction === BridgeEffect.HORIZONTAL) {
        yVelocity = this.k * other.getVelocity().x;
      }

      other.setVelocity(other.getVelocity().add(new Vector2(0, yVelocity)));
    }
  }

  onTriggerExit(self: Collidable, other: Entity): void {}
}
