import Phaser from "phaser";
import { Player } from "../entities/player";
import { NetworkManager } from "./network-manager";
import { Signals } from "@shared/signals/signals";
import { RemotePlayer } from "../entities/remote-player";

export class GameScene extends Phaser.Scene {
  private network: NetworkManager;
  private player!: Player;
  private map!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super("GameScene");

    this.network = NetworkManager.getInstance();

    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    this.network.on(Signals.LOAD_GAME_DATA, (data) => {
      // this.createMap(data.map);
    });

    this.network.on(Signals.PLAYER_JOINED, (data) => {
      const player = new RemotePlayer(this, data.x, data.y, data.id);
      this.add.existing(player.getSprite());
    });

    this.network.on(Signals.PLAYER_LEFT, (data) => {
      // Handle player left
    });
  }

  preload() {
    this.load.image("tiles", "spritesheets/tiles.png");

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
    this.createMap(gameData.map);

    this.player = new Player(this, 100, 100, this.network.getSocket().id!);
    this.cameras.main.startFollow(this.player.getSprite());
  }

  update(time: number, delta: number) {
    this.player.update(delta);
  }

  private createMap(mapData: any) {
    this.cache.tilemap.add("map", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: mapData,
    });
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("tiles", "tiles");

    const layer = this.map.createLayer("Tile Layer 1", tileset!, 0, 0)!;
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

export const gameData = { map: null };
