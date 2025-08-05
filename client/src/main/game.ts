import Phaser from "phaser";
import { Player } from "../entities/player";
import { NetworkManager } from "./network-manager";
import { Signals } from "@shared/signals/signals";
import { RemotePlayer } from "../entities/remote-player";
import { PlayerManager } from "../entities/player-manager";
import { GameUpdateData, PlayerData } from "@shared/network/types";
import { HitboxDebugger } from "../utils/hitbox-debugger";
import { Box } from "../utils/box";

export class GameScene extends Phaser.Scene {
  private network: NetworkManager;
  private map!: Phaser.Tilemaps.Tilemap;

  private playerManager: PlayerManager;

  private hitboxDebugger: HitboxDebugger;

  private worldTiles: Box[] = [];

  constructor() {
    super("GameScene");

    if (gameData.map === null || gameData.playerData === null) {
      throw new Error("Game data is not loaded.");
    }

    this.hitboxDebugger = new HitboxDebugger(this);

    this.network = NetworkManager.getInstance();

    this.playerManager = new PlayerManager(this, gameData.playerData);

    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    this.network.on(Signals.PLAYER_JOINED, (data: PlayerData) => {
      this.playerManager.addRemotePlayer(data);
    });

    this.network.on(Signals.PLAYER_LEFT, (data: string) => {
      this.playerManager.removePlayer(data);
    });

    this.network.on(Signals.UPDATE_GAME, (data: GameUpdateData) => {
      this.playerManager.updatePlayers(data.players);

      // this.worldTiles = data.tiles.map((tile) => Box.from(tile));
      this.worldTiles = data.colliders.map((collider) => Box.from(collider));
    });
  }

  preload() {
    this.load.image("tiles", "spritesheets/padded-tiles.png");
    this.load.image(
      "small-bridge-tiles",
      "spritesheets/small-bridge-tiles-padded.png"
    );
    this.load.image(
      "big-bridge-tiles",
      "spritesheets/big-bridge-tiles-padded.png"
    );
    this.load.image(
      "big-bridge-tiles-h",
      "spritesheets/big-bridge-tiles-h-padded.png"
    );

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

    this.hitboxDebugger.create();
  }

  update(time: number, delta: number) {
    this.playerManager.update(delta);

    this.worldTiles.forEach((tile) => {
      this.hitboxDebugger.addHitbox(tile);
    });

    // this.hitboxDebugger.update();
  }

  private createMap(mapData: any) {
    this.cache.tilemap.add("map", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: mapData,
    });

    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("tiles", "tiles");
    const smallBridgeTileset = this.map.addTilesetImage(
      "small-bridge-tiles",
      "small-bridge-tiles"
    );
    const bigBridgeTileset = this.map.addTilesetImage(
      "big-bridge-tiles",
      "big-bridge-tiles"
    );
    const bigBridgeTilesetH = this.map.addTilesetImage(
      "big-bridge-tiles-h",
      "big-bridge-tiles-h"
    );

    const layer = this.map.createLayer(
      "Tile Layer 1",
      [tileset!, smallBridgeTileset!, bigBridgeTileset!, bigBridgeTilesetH!],
      0,
      0
    )!;
  }

  getNetworkManager() {
    return this.network;
  }

  getHitboxDebugger() {
    return this.hitboxDebugger;
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
  antialias: false,
  backgroundColor: "#1d1d1d",
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.NO_CENTER,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

type GameData = {
  map: any;
  playerData: PlayerData | null;
};
export const gameData: GameData = { map: null, playerData: null };
