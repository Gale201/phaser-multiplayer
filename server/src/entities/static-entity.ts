import { Collidable } from "../physics/collidable";
import { Box } from "../physics/box";
import { Entity } from "./entity";

export abstract class StaticEntity extends Entity implements Collidable {
  constructor(hitbox: Box) {
    super(hitbox);
  }

  isStatic(): boolean {
    return true;
  }
}
