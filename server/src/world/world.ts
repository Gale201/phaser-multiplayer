export class World {
  mapJSON: any;

  constructor() {
    this.mapJSON = this.loadMap();
  }

  private loadMap() {
    // Load the map JSON from a file or other source
  }

  getMapJSON() {
    return this.mapJSON;
  }
}
