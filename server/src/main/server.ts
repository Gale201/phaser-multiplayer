import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import http from "http";
import { Game } from "./game";
import { Signals } from "@shared/signals/signals";
import { GameRoomData, GameServerData } from "@shared/server/server-types";
import { Room } from "./room";

dotenv.config();

export class GameServer {
  private readonly PORT: string = process.env.PORT || "3002";
  private readonly id: string | undefined = process.env.SERVER_ID;
  private readonly server: http.Server;
  private readonly io: Server;
  private rooms: Map<string, Room> = new Map();

  constructor() {
    if (!this.id) {
      throw new Error("SERVER_ID environment variable is not set.");
    }

    // Create an HTTP server and attach Socket.IO to it
    this.server = http.createServer();
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.setupSocketEvents();
  }

  async start() {
    await this.loadRoomDataFromMainServer();

    // Start the server
    this.server.listen(this.PORT, () => {
      console.log("[SERVER] Listening on port", this.PORT);
    });
  }

  /**
   * This is here so that the game server can now
   * which rooms exist on the main server.
   *
   * @private
   */
  private async loadRoomDataFromMainServer() {
    const serverData = await fetch("http://localhost:3001/api/servers");
    if (!serverData.ok) {
      throw new Error("Failed to fetch room data from main server");
    }

    // Gets the server list and tries to find the server with this server's ID
    const servers = await serverData.json();
    const server = servers.find((s: GameServerData) => s.id == this.id);
    if (!server) {
      throw new Error(`Server with ID ${this.id} not found on main server`);
    }

    // Load the rooms from the server data
    const roomsData: GameRoomData[] = server.rooms;
    roomsData.forEach((room) => {
      const newRoom = new Room(room.name, this.io, room.maxPlayers);
      this.rooms.set(room.name, newRoom);
    });
  }

  /**
   * Updates the main server with the current player count in a room.
   * This is called whenever a player joins or leaves a room.
   *
   * @param {string} roomName
   * @returns {Promise<void>}
   * @private
   */
  private async updateMainServerPlayerCount(roomName: string) {
    await fetch("http://localhost:3001/api/servers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serverId: this.id,
        roomName: roomName,
        players: this.rooms.get(roomName)?.getPlayers().length || 0,
      }),
    }).catch((error) => {
      console.error(
        "[SERVER] Error updating player count on main server:",
        error
      );
    });
  }

  /*
   * Setup Socket.IO events for handling client connections and game logic.
   * This includes joining rooms, player management, and game updates.
   *
   * @private
   */
  private setupSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("[SERVER] New client connected:", socket.id);

      // Handle player joining a room
      socket.on(Signals.JOIN_ROOM, async ({ username, roomName }) => {
        await this.handleJoinRoom(socket, username, roomName).catch((error) => {
          console.error("[SERVER] Error handling join room:", error);
          socket.emit(Signals.JOIN_ROOM_FAILURE, "An error occurred.");
        });
      });
    });
  }

  private async handleJoinRoom(
    socket: Socket,
    username: string,
    roomName: string
  ) {
    // Validate username
    if (
      !username ||
      typeof username !== "string" ||
      username.length < 1 ||
      username.length > 20
    ) {
      console.error("[SERVER] Invalid username:", username);
      socket.emit(Signals.JOIN_ROOM_FAILURE, "Invalid username.");
      return;
    }

    // Validate room name
    if (
      !roomName ||
      typeof roomName !== "string" ||
      !this.rooms.has(roomName)
    ) {
      console.error("[SERVER] Invalid room name:", roomName);
      socket.emit(Signals.JOIN_ROOM_FAILURE, "Invalid room name.");
      return;
    }

    // Add player to the room
    const room = this.rooms.get(roomName)!;
    if (room.getPlayers().length >= room.getMaxPlayers()) {
      socket.emit(Signals.JOIN_ROOM_FAILURE, "Room is full.");
      return;
    }
    room.addPlayer(socket, username);

    // Join room and notify client
    socket.join(roomName);
    socket.emit(Signals.JOIN_ROOM_SUCCESS);

    await this.updateMainServerPlayerCount(roomName);

    // Handle player disconnection
    socket.on("disconnect", async () => {
      room.removePlayer(socket.id);
      console.log(
        `[SERVER] Player ${username} disconnected from room ${roomName}`
      );

      await this.updateMainServerPlayerCount(roomName);
    });
  }
}

const gameServer = new GameServer();
gameServer.start().catch((error) => {
  console.log("[SERVER] Error starting game server:", error);
  process.exit(1);
});
