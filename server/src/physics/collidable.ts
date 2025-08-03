import { Box } from "./box";
import { CollisionLayer } from "./collision-layers";
import { Effect } from "../effects/effect";

export interface Collidable {
  getHitbox(): Box;
  getCollisionLayer(): CollisionLayer;
  getCollisionMask(): number;
  effects: Effect[];
  isStatic: boolean;
  isTrigger: boolean;
}
