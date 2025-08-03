import { StaticEntity } from "../entities/static-entity";
import { SpatialHashGrid } from "./spatial-grid";
import { MovingEntity } from "../entities/moving-entity";
import { Box } from "./box";
import { Collidable } from "./collidable";
import { Player } from "../entities/player";
import { Effect } from "../effects/effect";

export class CollisionHandler {
  private staticEntities: Array<StaticEntity> = [];
  private movingEntities: Array<MovingEntity> = [];
  private spatialGrid: SpatialHashGrid;
  private effectsApplied: Effect[] = [];

  constructor(mapWidth: number, mapHeight: number, tileSize: number) {
    this.spatialGrid = new SpatialHashGrid(mapWidth, mapHeight, tileSize);
  }

  update() {
    for (const entity of this.movingEntities) {
      this.resolveCollisions(entity);
    }

    this.effectsApplied = [];
  }

  resolveEffects() {
    for (const entity of this.movingEntities) {
      const potentialCollisions = this.spatialGrid.query(entity.getHitbox());

      for (const trigger of potentialCollisions) {
        if (!trigger.isTrigger) continue;
        if (!this.layersMatch(entity, trigger)) continue;
        if (!entity.getHitbox().intersects(trigger.getHitbox())) continue;

        trigger.effects.forEach((effect) => {
          effect.onTriggerStay(trigger, entity);
        });
      }
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
        this.layersMatch(entity, potentialCollision) &&
        entity.getHitbox().intersects(potentialCollision.getHitbox()) &&
        !potentialCollision.isTrigger
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
        this.layersMatch(entity, potentialCollision) &&
        entity.getHitbox().intersects(potentialCollision.getHitbox()) &&
        !potentialCollision.isTrigger
      ) {
        entity.handleCollisionForYAxis(potentialCollision);
      }
    }
  }

  private layersMatch(entity: MovingEntity, other: Collidable): boolean {
    return (
      (entity.getCollisionMask() & other.getCollisionLayer()) !== 0 &&
      (other.getCollisionMask() & entity.getCollisionLayer()) !== 0
    );
  }
}
