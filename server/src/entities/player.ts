import { Socket } from "socket.io";

export class Player {
  private readonly id: string;
  private readonly socket: Socket;
  private username: string;

  constructor(socket: Socket, username: string) {
    this.socket = socket;
    this.username = username;

    this.id = socket.id;
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }
}
