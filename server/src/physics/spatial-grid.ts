import { Box } from "./box";
import { Collidable } from "./collidable";

export class SpatialHashGrid {
  private grid: Map<string, Collidable[]> = new Map();
  private tileSize: number;

  constructor(mapWidth: number, mapHeight: number, tileSize: number) {
    this.tileSize = tileSize;
    const cols = Math.ceil(mapWidth / tileSize);
    const rows = Math.ceil(mapHeight / tileSize);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        this.grid.set(`${x},${y}`, []);
      }
    }
  }

  insert(entity: Collidable) {
    if (!entity.getHitbox()) return;

    const keys = this.getKeysForEntity(entity.getHitbox()!);
    for (const key of keys) {
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)?.push(entity);
    }
  }

  remove(entity: Collidable) {
    for (const cellEntities of this.grid.values()) {
      const index = cellEntities.indexOf(entity);
      if (index !== -1) {
        cellEntities.splice(index, 1);
      }
    }
  }

  query(hitbox: Box): Collidable[] {
    const keys = this.getKeysForEntity(hitbox);
    const entities: Collidable[] = [];

    for (const key of keys) {
      const cellEntities = this.grid.get(key);
      if (cellEntities) {
        for (const entity of cellEntities) {
          if (!entities.includes(entity)) {
            entities.push(entity);
          }
        }
      }
    }

    return entities;
  }

  private getKeysForEntity(hitbox: Box): string[] {
    const keys: string[] = [];

    const startX = Math.floor(hitbox.x / this.tileSize);
    const startY = Math.floor(hitbox.y / this.tileSize);
    const endX = Math.ceil(hitbox.right / this.tileSize);
    const endY = Math.ceil(hitbox.bottom / this.tileSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        keys.push(`${x},${y}`);
      }
    }
    return keys;
  }
}
