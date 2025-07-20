import { CollisionLayer } from "../physics/collision-layers";
import { Box } from "../physics/box";
import { v4 as uuidv4 } from "uuid";
import { Serializable } from "../utils/serializable";

export abstract class Entity implements Serializable {
  protected id: string;
  protected hitbox: Box;
  protected collisionLayer: number = CollisionLayer.ENTITY_LAYER;

  constructor(hitbox: Box) {
    this.hitbox = hitbox;
    this.id = uuidv4();
  }

  abstract update(deltaTime: number): void;

  getHitbox(): Box {
    return this.hitbox;
  }

  getCollisionLayer() {
    return this.collisionLayer;
  }

  setCollisionLayer(layer: number) {
    this.collisionLayer = layer;
  }

  getId(): string {
    return this.id;
  }

  abstract serialized(): any;
}
