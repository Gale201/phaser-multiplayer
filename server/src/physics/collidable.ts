import { Box } from "./box";

export interface Collidable {
  getHitbox(): Box;
  getCollisionLayer(): number;
  isStatic(): boolean;
}
