import { CollisionLayer } from "../physics/collision-layers";
import { Box } from "../physics/box";
import { v4 as uuidv4 } from "uuid";
import { Serializable } from "../utils/serializable";
import { Effect } from "../effects/effect";

export abstract class Entity implements Serializable {
  protected id: string;
  protected hitbox: Box;
  protected collisionLayer: CollisionLayer = CollisionLayer.NONE;
  protected collisionMask: number = 0;

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

  getCollisionMask() {
    return this.collisionMask;
  }

  getId(): string {
    return this.id;
  }

  setCollisionLayer(layer: CollisionLayer) {
    this.collisionLayer = layer;
  }

  abstract serialized(): any;
}
