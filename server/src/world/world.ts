import fs from "fs";
import zlib from "zlib";

export class World {
  private readonly mapFilePath: string = "./assets/maps/map.json";
  private mapJSON: any;
  private tileIds: string[] = [];
  private tileMap: string[][] = [];

  constructor() {
    this.loadMap();
    this.createTileMap();
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

  getMapJSON() {
    return this.mapJSON;
  }

  getTileMap() {
    return this.tileMap;
  }
}
