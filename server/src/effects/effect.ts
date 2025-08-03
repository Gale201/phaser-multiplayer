import { Entity } from "../entities/entity";
import { Collidable } from "../physics/collidable";

export interface Effect {
  onTriggerEnter(self: Collidable, other: Entity): void;
  onTriggerStay(self: Collidable, other: Entity): void;
  onTriggerExit(self: Collidable, other: Entity): void;
}
