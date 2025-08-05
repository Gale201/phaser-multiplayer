import fs from "fs";
import { Box } from "../physics/box";
import { CollisionHandler } from "../physics/collision-handler";
import { CollisionLayer } from "../physics/collision-layers";
import { BridgeEffect } from "../effects/bridge-effect";

export class World {
  private readonly mapFilePath: string = "./assets/maps/map.json";
  private mapJSON: any;
  private tileIds: string[] = [];
  private tileMap: string[][] = [];
  private tileHitboxesMap: Map<string, Box[]> = new Map();
  private tileHitboxes: Box[] = [];
  private width: number;
  private height: number;

  constructor() {
    this.loadMap();
    this.loadTileHitboxesMap();
    this.createTileMap();

    this.width = this.mapJSON.width;
    this.height = this.mapJSON.height;
  }

  private loadMap() {
    try {
      const data = JSON.parse(fs.readFileSync(this.mapFilePath, "utf-8"));
      const buffer = Buffer.from(data.layers[0].data, "base64");

      this.tileIds = [];
      for (let i = 0; i < buffer.length; i += 4) {
        const rawId = buffer.readUInt32LE(i);
        const id = rawId & 0x1fffffff; // Strip flip flags
        this.tileIds.push(id.toString());
      }

      this.mapJSON = data;
    } catch (error) {
      console.error("Error loading map:", error);
    }
  }

  private loadTileHitboxesMap() {
    try {
      const data = JSON.parse(
        fs.readFileSync("./assets/tiles/tile-hitboxes.json", "utf-8")
      );
      for (const tileId in data.tileHitboxes) {
        const hitboxes: Box[] = data.tileHitboxes[tileId];
        this.tileHitboxesMap.set(
          tileId,
          hitboxes.map(
            (hitbox) => new Box(hitbox.x, hitbox.y, hitbox.w, hitbox.h)
          )
        );
      }
    } catch (error) {
      console.error("Error loading tile hitboxes:", error);
    }
  }

  private createTileMap() {
    for (let i = 0; i < this.mapJSON.height; i++) {
      const row: string[] = [];
      for (let j = 0; j < this.mapJSON.width; j++) {
        const index = i * this.mapJSON.width + j;
        row.push(this.tileIds[index] || "0");
      }
      this.tileMap.push(row);
    }
  }

  generateTileHitboxes(collisionHandler: CollisionHandler) {
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[i].length; j++) {
        const tileId = this.tileMap[i][j];
        const hitboxes = this.tileHitboxesMap.get(tileId) || [];

        const newHitboxes = [];
        for (let hitbox of hitboxes) {
          hitbox = hitbox.copy();
          hitbox.x += j * this.mapJSON.tilewidth;
          hitbox.y += i * this.mapJSON.tileheight;
          hitbox.setCollisionLayer(CollisionLayer.WORLD);
          hitbox.setCollisionMask(CollisionLayer.PLAYER);
          newHitboxes.push(hitbox);
        }
        this.tileHitboxes.push(...newHitboxes);
      }
    }

    for (const hitbox of this.tileHitboxes) {
      collisionHandler.addCollider(hitbox);
    }
  }

  generateWorldEffects(collisionHandler: CollisionHandler) {
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[i].length; j++) {
        const tileId = this.tileMap[i][j];

        let collider: Box;
        let bridgeEffect: BridgeEffect;

        switch (tileId) {
          case "42":
            collider = new Box(40, 10, 10, 100);
            bridgeEffect = new BridgeEffect(-0.5, BridgeEffect.HORIZONTAL);
            break;
          case "46":
            collider = new Box(14, 10, 10, 100);
            bridgeEffect = new BridgeEffect(0.5, BridgeEffect.HORIZONTAL);
            break;
          case "26":
            collider = new Box(8, 10, 48, 12);
            bridgeEffect = new BridgeEffect(-0.5, BridgeEffect.VERTICAL);
            break;
          case "29":
            collider = new Box(8, 32, 48, 16);
            bridgeEffect = new BridgeEffect(0.5, BridgeEffect.VERTICAL);
            break;
          case "37":
            collider = new Box(20, 0, 88, 16);
            bridgeEffect = new BridgeEffect(-0.5, BridgeEffect.VERTICAL);
            break;
          case "41":
            collider = new Box(20, 16, 88, 32);
            bridgeEffect = new BridgeEffect(0.5, BridgeEffect.VERTICAL);
            break;
          default:
            continue;
        }

        collider.x += j * this.mapJSON.tilewidth;
        collider.y += i * this.mapJSON.tileheight;
        collider.setCollisionLayer(CollisionLayer.EFFECTS);
        collider.setCollisionMask(CollisionLayer.PLAYER);
        collider.isTrigger = true;
        collider.isStatic = true;
        collider.effects = [bridgeEffect];
        collisionHandler.addCollider(collider);
      }
    }
  }

  getMapJSON() {
    return this.mapJSON;
  }

  getTileMap() {
    return this.tileMap;
  }

  getTileIds() {
    return this.tileIds;
  }

  getTileHitboxes() {
    return this.tileHitboxes;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getTileSize() {
    return this.mapJSON.tilewidth;
  }
}
