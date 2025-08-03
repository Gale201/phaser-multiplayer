export enum CollisionLayer {
  NONE = 0,
  PLAYER = 1 << 0,
  WORLD = 1 << 1,
  EFFECTS = 1 << 2,
}
