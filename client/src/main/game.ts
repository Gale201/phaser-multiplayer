import Phaser from "phaser";
import Player from "../entities/player";
import { NetworkManager } from "./network-manager";
import { Signals } from "@shared/signals/signals";

export default class GameScene extends Phaser.Scene {
  private network: NetworkManager;
  private player!: Player;

  constructor() {
    super("GameScene");

    this.network = NetworkManager.getInstance();

    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    this.network.on(Signals.LOAD_GAME_DATA, (data) => {
      console.log(data);
    });
  }

  preload() {
    this.load.image("tiles", "spritesheets/tiles.png");
    this.load.tilemapTiledJSON("map", "maps/map.json");

    this.load.spritesheet(
      "player-idle-left",
      "spritesheets/baco-idle-left.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "player-idle-right",
      "spritesheets/baco-idle-right.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "player-walk-left",
      "spritesheets/baco-walk-left.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "player-walk-right",
      "spritesheets/baco-walk-right.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");

    const layer = map.createLayer("Tile Layer 1", tileset!, 0, 0)!;

    this.player = new Player(this, 100, 100);
    this.cameras.main.startFollow(this.player.getSprite());
  }

  update(time: number, delta: number) {
    this.player.update(delta);
  }
}

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  pixelArt: true,
  roundPixels: true,
  backgroundColor: "#1d1d1d",
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
