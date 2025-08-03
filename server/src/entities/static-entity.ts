import { Collidable } from "../physics/collidable";
import { Box } from "../physics/box";
import { Entity } from "./entity";
import { Effect } from "../effects/effect";

export abstract class StaticEntity extends Entity implements Collidable {
  isStatic: boolean = true;
  isTrigger: boolean = false;
  effects: Effect[] = [];

  constructor(hitbox: Box) {
    super(hitbox);
  }
}
