import Phaser from "phaser";
import { Player } from "../entities/player";
import { NetworkManager } from "./network-manager";
import { Signals } from "@shared/signals/signals";
import { RemotePlayer } from "../entities/remote-player";
import { PlayerManager } from "../entities/player-manager";
import { GameUpdateData, PlayerData } from "@shared/network/types";

export class GameScene extends Phaser.Scene {
  private network: NetworkManager;
  private map!: Phaser.Tilemaps.Tilemap;

  private playerManager: PlayerManager;

  constructor() {
    super("GameScene");

    if (gameData.map === null || gameData.playerData === null) {
      throw new Error("Game data is not loaded.");
    }

    this.network = NetworkManager.getInstance();

    this.playerManager = new PlayerManager(this, gameData.playerData);

    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    this.network.on(Signals.PLAYER_JOINED, (data: PlayerData) => {});

    this.network.on(Signals.PLAYER_LEFT, (data) => {
      // Handle player left
    });

    this.network.on(Signals.UPDATE_GAME, (data: GameUpdateData) => {
      this.playerManager.updatePlayers(data.players);
    });
  }

  preload() {
    this.load.image("tiles", "spritesheets/padded-tiles.png");

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

    this.playerManager.create();
  }

  update(time: number, delta: number) {
    this.playerManager.update(delta);
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

  getNetworkManager() {
    return this.network;
  }
}

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  pixelArt: true,
  roundPixels: true,
  autoRound: true,
  backgroundColor: "#1d1d1d",
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export const gameData = { map: null, playerData: null };
