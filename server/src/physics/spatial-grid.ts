import { Box } from "./box";
import { Collidable } from "./collidable";

export class SpatialHashGrid {
  private grid: Map<string, Collidable[]> = new Map();
  private tileSize: number;

  constructor(mapWidth: number, mapHeight: number, tileSize: number) {
    this.tileSize = tileSize;

    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        this.grid.set(`${x},${y}`, []);
      }
    }
  }

  insert(collidable: Collidable) {
    if (!collidable.getHitbox()) return;

    const keys = this.getKeysForCollidable(collidable.getHitbox()!);
    for (const key of keys) {
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)?.push(collidable);
    }
  }

  remove(collidable: Collidable) {
    for (const cellCollidables of this.grid.values()) {
      const index = cellCollidables.indexOf(collidable);
      if (index !== -1) {
        cellCollidables.splice(index, 1);
      }
    }
  }

  query(hitbox: Box): Collidable[] {
    const keys = this.getKeysForCollidable(hitbox);
    const collidables: Collidable[] = [];

    for (const key of keys) {
      const cellCollidables = this.grid.get(key);
      if (cellCollidables) {
        for (const collidable of cellCollidables) {
          if (!collidables.includes(collidable)) {
            collidables.push(collidable);
          }
        }
      }
    }

    return collidables;
  }

  private getKeysForCollidable(hitbox: Box): string[] {
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
