import { StaticEntity } from "../entities/static-entity";
import { SpatialHashGrid } from "./spatial-grid";
import { MovingEntity } from "../entities/moving-entity";
import { Box } from "./box";
import { Collidable } from "./collidable";
import { Player } from "../entities/player";

export class CollisionHandler {
  private staticEntities: Array<StaticEntity> = [];
  private movingEntities: Array<MovingEntity> = [];
  private spatialGrid: SpatialHashGrid;

  private worldBounds: Box;

  constructor(
    mapWidth: number,
    mapHeight: number,
    tileSize: number,
    worldBounds: Box
  ) {
    this.spatialGrid = new SpatialHashGrid(mapWidth, mapHeight, tileSize);

    this.worldBounds = worldBounds;
  }

  update() {
    for (const entity of this.movingEntities) {
      this.resolveCollisions(entity);
      this.applyWorldBounds(entity);
    }
  }

  addStaticEntity(entity: StaticEntity) {
    this.staticEntities.push(entity);
    this.spatialGrid.insert(entity);
  }

  addMovingEntity(entity: MovingEntity) {
    this.movingEntities.push(entity);
  }

  removeStaticEntity(entity: StaticEntity) {
    this.staticEntities = this.staticEntities.filter(
      (e) => e.getId() !== entity.getId()
    );
    this.spatialGrid.remove(entity);
  }

  private resolveCollisions(entity: MovingEntity) {
    const potentialCollisions = this.spatialGrid.query(entity.getHitbox());

    this.resolveCollisionsForXAxis(entity, potentialCollisions);
    this.resolveCollisionsForYAxis(entity, potentialCollisions);
  }

  private resolveCollisionsForXAxis(
    entity: MovingEntity,
    potentialCollisions: Collidable[]
  ) {
    if (entity.getIntendedPosition() === null) return;

    entity.getHitbox().x = entity.getIntendedPosition()!.x;

    for (const potentialCollision of potentialCollisions) {
      if (
        entity.getCollisionLayer() == potentialCollision.getCollisionLayer() &&
        entity.getHitbox().intersects(potentialCollision.getHitbox())
      ) {
        entity.handleCollisionForXAxis(potentialCollision);
      }
    }
  }

  private resolveCollisionsForYAxis(
    entity: MovingEntity,
    potentialCollisions: Collidable[]
  ) {
    if (entity.getIntendedPosition() === null) return;

    entity.getHitbox().y = entity.getIntendedPosition()!.y;

    for (const potentialCollision of potentialCollisions) {
      if (
        entity.getCollisionLayer() == potentialCollision.getCollisionLayer() &&
        entity.getHitbox().intersects(potentialCollision.getHitbox())
      ) {
        entity.handleCollisionForYAxis(potentialCollision);
      }
    }
  }

  private applyWorldBounds(entity: MovingEntity) {
    entity.getHitbox().x = Math.min(
      Math.max(entity.getHitbox().x, this.worldBounds.x),
      this.worldBounds.w - entity.getHitbox().w
    );
    entity.getHitbox().y = Math.min(
      Math.max(entity.getHitbox().y, this.worldBounds.y),
      this.worldBounds.h - entity.getHitbox().h
    );
  }
}
