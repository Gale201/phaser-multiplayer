import { Signals } from "@shared/signals/signals";
import { Server } from "socket.io";

/**
 * This is here so that rooms don't have control over server.
 */
export class RoomServerWrapper {
  private readonly server: Server;
  private readonly roomName: string;

  constructor(server: Server, roomName: string) {
    this.server = server;
    this.roomName = roomName;
  }

  emit(signal: Signals, data: any) {
    this.server.to(this.roomName).emit(signal, data);
  }
}
