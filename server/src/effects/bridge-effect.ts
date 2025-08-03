import { Entity } from "../entities/entity";
import { Player } from "../entities/player";
import { Collidable } from "../physics/collidable";
import { Vector2 } from "../physics/vectors";
import { Effect } from "./effect";

export class BridgeEffect implements Effect {
  onTriggerEnter(self: Collidable, other: Entity): void {}

  onTriggerStay(self: Collidable, other: Entity): void {
    if (other instanceof Player) {
      other.setVelocity(
        other.getVelocity().add(new Vector2(0, -other.getVelocity().x * 0.3))
      );
    }
  }

  onTriggerExit(self: Collidable, other: Entity): void {}
}
