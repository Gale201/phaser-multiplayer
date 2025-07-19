import { Server } from "socket.io";
import { Player } from "../entities/player";
import { Signals } from "@shared/signals/signals";
import { World } from "../world/world";
import { RoomServerWrapper } from "./server-wrapper";

export class Game {
  private readonly FPS = 60;
  private readonly server: RoomServerWrapper;

  private running: boolean = false;
  private lastUpdateTime: number = performance.now();

  private world: World;
  private players: Map<string, Player> = new Map();

  constructor(server: RoomServerWrapper) {
    this.server = server;

    this.world = new World();

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

  private update(deltaTime: number) {}

  addPlayer(player: Player) {
    this.players.set(player.getId(), player);
    this.server.emit(Signals.PLAYER_JOINED, player.serialized());
    player.send(Signals.LOAD_GAME_DATA, {
      map: this.world.getMapJSON(),
    });
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
