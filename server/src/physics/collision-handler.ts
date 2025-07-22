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

  constructor(mapWidth: number, mapHeight: number, tileSize: number) {
    this.spatialGrid = new SpatialHashGrid(mapWidth, mapHeight, tileSize);
  }

  update() {
    for (const entity of this.movingEntities) {
      this.resolveCollisions(entity);
    }
  }

  addStaticEntity(entity: StaticEntity) {
    this.staticEntities.push(entity);
    this.spatialGrid.insert(entity);
  }

  addMovingEntity(entity: MovingEntity) {
    this.movingEntities.push(entity);
  }

  addCollider(collidable: Collidable) {
    this.spatialGrid.insert(collidable);
  }

  removeStaticEntity(entity: StaticEntity) {
    this.staticEntities = this.staticEntities.filter(
      (e) => e.getId() !== entity.getId()
    );
    this.spatialGrid.remove(entity);
  }

  removeMovingEntity(entity: MovingEntity) {
    this.movingEntities = this.movingEntities.filter(
      (e) => e.getId() !== entity.getId()
    );
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
}
