import { Server, Socket } from "socket.io";
import { Game } from "./game";
import { Player } from "../entities/player";

/*
 * Represents a game room where players can join the game.
 * Manages player connections and disconnections.
 */
export class Room {
  private name: string;
  private readonly server: Server;
  private readonly max_players: number;

  private game: Game;
  private players: Map<string, Player> = new Map();

  constructor(name: string, server: Server, max_players: number) {
    this.name = name;
    this.server = server;
    this.max_players = max_players;

    this.game = new Game(server);
  }

  addPlayer(socket: Socket, username: string) {
    this.players.set(socket.id, new Player(socket, username));
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getMaxPlayers() {
    return this.max_players;
  }
}
