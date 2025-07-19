import { Server, Socket } from "socket.io";
import { Game } from "./game";
import { Player } from "../entities/player";
import { Signals } from "@shared/signals/signals";
import { RoomServerWrapper } from "./server-wrapper";

/*
 * Represents a game room where players can join the game.
 * Manages player connections and disconnections.
 */
export class Room {
  private name: string;
  private readonly server: RoomServerWrapper;
  private readonly max_players: number;

  private game: Game;

  constructor(name: string, server: RoomServerWrapper, max_players: number) {
    this.name = name;
    this.server = server;
    this.max_players = max_players;

    this.game = new Game(server);
  }

  addPlayer(socket: Socket, username: string) {
    this.game.addPlayer(new Player(socket, username));
  }

  removePlayer(playerId: string) {
    this.game.removePlayer(playerId);
  }

  hasPlayer(playerId: string): boolean {
    return this.game.getPlayers().has(playerId);
  }

  getPlayers() {
    return Array.from(this.game.getPlayers().values());
  }

  getMaxPlayers() {
    return this.max_players;
  }
}
