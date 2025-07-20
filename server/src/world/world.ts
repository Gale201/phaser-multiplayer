import fs from "fs";

export class World {
  private readonly mapFilePath: string = "./assets/maps/map.json";
  private mapJSON: any;

  constructor() {
    this.mapJSON = this.loadMap();
  }

  private loadMap() {
    try {
      const data = fs.readFileSync(this.mapFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading map:", error);
      return null;
    }
  }

  getMapJSON() {
    return this.mapJSON;
  }
}
