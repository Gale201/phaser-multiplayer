import { Server } from "socket.io";
import { Player } from "../entities/player";
import { Signals } from "@shared/signals/signals";
import { World } from "../world/world";
import { RoomServerWrapper } from "./server-wrapper";
import { CollisionHandler } from "../physics/collision-handler";
import { Box } from "../physics/box";
import { CollisionLayer } from "../physics/collision-layers";
import { BridgeEffect } from "../effects/bridge-effect";

export class Game {
  private readonly FPS = 60;
  private readonly server: RoomServerWrapper;

  private running: boolean = false;
  private lastUpdateTime: number = performance.now();

  private world: World;
  private collisionHandler: CollisionHandler;
  private players: Map<string, Player> = new Map();

  constructor(server: RoomServerWrapper) {
    this.server = server;

    this.world = new World();

    this.collisionHandler = new CollisionHandler(
      this.world.getWidth(),
      this.world.getHeight(),
      this.world.getTileSize()
    );

    this.world.generateTileHitboxes(this.collisionHandler);

    const collider = new Box(620, 460, 10, 80);
    collider.setCollisionLayer(CollisionLayer.EFFECTS);
    collider.setCollisionMask(CollisionLayer.PLAYER);
    collider.isTrigger = true;
    collider.isStatic = true;
    collider.effects = [new BridgeEffect()];
    this.collisionHandler.addCollider(collider);

    this.start();
  }

  private start() {
    this.running = true;
    this.lastUpdateTime = performance.now();
    this.gameLoop();
  }

  private gameLoop() {
    if (!this.running) return;

    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastUpdateTime;

    this.update((deltaTime / 1000) * this.FPS);

    this.lastUpdateTime = currentTime;

    setTimeout(this.gameLoop.bind(this), 1000 / this.FPS);
  }

  private update(deltaTime: number) {
    this.collisionHandler.resolveEffects();

    for (const player of this.players.values()) {
      player.update(deltaTime);
    }

    this.collisionHandler.update();

    this.server.emit(Signals.UPDATE_GAME, {
      players: Array.from(this.players.values()).map((player) =>
        player.serialized()
      ),
      tiles: this.world.getTileHitboxes(),
    });
  }

  addPlayer(player: Player) {
    this.players.set(player.getId(), player);
    this.server.emit(Signals.PLAYER_JOINED, player.serialized());
    player.send(Signals.LOAD_GAME_DATA, {
      map: this.world.getMapJSON(),
      playerData: player.serialized(),
    });
    this.collisionHandler.addMovingEntity(player);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
    this.server.emit(Signals.PLAYER_LEFT, playerId);
  }

  isRunning() {
    return this.running;
  }

  getPlayers() {
    return this.players;
  }
}
